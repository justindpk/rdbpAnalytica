const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3005;

async function updateLocalDatabases(database_name, database_url) {
    console.log("Updating " + database_name + " database");
    const databaseFilepath = `./databases/${database_name}.json`

    async function getWriteDB() {
        let response = await axios.get(database_url);
        response = response.data.replace(database_name + ' = ', '');
        fs.writeFileSync(databaseFilepath, response);
    }

    if (!fs.existsSync(databaseFilepath)) {
        await getWriteDB();
    } else {
        let stat = fs.statSync(databaseFilepath);
        if (Date.now() - stat.mtimeMs > 604800000) {
            await getWriteDB();
        } else {
            console.log(`Database ${database_name} is up to date`);
        }
    }
}


const URLS = {
    'allDucks': 'https://duck.art/rarity-data/v7/allDucks.js',
    'globalRarity': 'https://duck.art/rarity-data/v7/globalRarity.js',
    'allBackpacks': 'https://duck.art/rarity-data/v7/allBackpacks.js',
    'backpackRarity': 'https://duck.art/rarity-data/v7/backpackRarity.js',
    'traits': 'https://duck.art/rarity-data/traits.js',
}


async function parseAllDucks() {
    for (let [databaseName, url] of Object.entries(URLS)) {
        await updateLocalDatabases(databaseName, url).catch((err) => {
            console.log(err)
        })
    }
    const traitsTable = JSON.parse(fs.readFileSync("./databases/traits.json").toString());
    const backpackRarity = JSON.parse(fs.readFileSync("./databases/backpackRarity.json").toString());
    let backpackTypesCount = {};
    for (let [backpackId, backpack] of Object.entries(backpackRarity)) {
        if (backpackId !== "traitCount") {
            backpackTypesCount[backpackId] = Object.keys(backpack).length;
        }
    }


    let parsedDucks = [];
    let allDucks = JSON.parse(fs.readFileSync("./databases/allDucks.json").toString());
    let allBackpacks = JSON.parse(fs.readFileSync("./databases/allBackpacks.json").toString());

    allDucks.sort((a, b) => a["duck"] - b["duck"])
    allBackpacks.sort((a, b) => a["duck"] - b["duck"])

    for (const i in allDucks) {
        let duck = allDucks[i];
        let backpack = allBackpacks[i];
        let duckData = {
            "id": duck.duck,
            "rank": duck.history[0].rank,
            "version": duck.history.length,
            "rarityChange": (duck.history.length < 2) ? 0 : duck.history[1].rank - duck.history[0].rank,
            "img": duck.history[0].image,
            "parties": duck.attributes[0].value,
            "background": null,
            "body": null,
            "tattoo": null,
            "head": null,
            "shirt": null,
            "neck": null,
            "beak": null,
            "eyes": null,
            "cover": null,
            "water": null,
            "bag of sand": null,
            "paint bucket": null,
            "egg": 0,
            "seed": 0,
            "chest": 0
        };

        for (let [key, value] of Object.entries(duck.attributes)) {
            if (key > 0) {
                duckData[value.trait_type.toLowerCase()] = value.value;
            }
        }

        // Backpacks
        for (let [backpackId, backpackTypeCount] of Object.entries(backpackTypesCount)) {
            if (backpackTypeCount > 1) {
                duckData[backpackId] = 0;
            }
        }
        for (const [key, value] of Object.entries(backpackTypesCount)) {
            if (value === 1) {
                duckData[key] = 0;
            }
        }
        for (let attribute of backpack.attributes) {
             if (backpackTypesCount[attribute.trait_type] === 1) {
                duckData[attribute.trait_type.toLowerCase()] += 1;
            } else {
                duckData[attribute.trait_type.toLowerCase()] = attribute.value;
            }
        }
        parsedDucks.push(duckData);
    }
    return [parsedDucks, traitsTable, backpackRarity];
}


app.use(cors(
    {'Access-Control-Allow-Origin': '*'}
));

app.get('/api', (req, res) => {
    parseAllDucks().then((data) => res.send(data)).catch((err) => {
        console.log(err);
    })
})

app.get('/traits', (req, res) => {
    res.send(fs.readFileSync("./databases/traits.json").toString());
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

