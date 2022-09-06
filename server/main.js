const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3005;

async function updateLocalDatabases(database_name, database_url) {
    const databaseFilepath = `./databases/${database_name}.json`

    async function getWriteDB() {
        let response = await axios.get(database_url);
        response = response.data.replace(database_name + ' = ', '');
        fs.writeFileSync(databaseFilepath, response);
    }

    let stat = fs.statSync(databaseFilepath);
    if (!fs.existsSync(databaseFilepath)) {
        await getWriteDB();
    } else if (Date.now() - stat.mtimeMs > 604800000) {
        await getWriteDB();
    } else {
        console.log(`Database ${database_name} is up to date`);
    }
}


const URLS = {
    'allDucks': 'https://duck.art/rarity-data/v7/allDucks.js',
    'globalRarity': 'https://duck.art/rarity-data/v7/globalRarity.js',
    'allBackpacks': 'https://duck.art/rarity-data/v7/allBackpacks.js',
    'backpackRarity': 'https://duck.art/rarity-data/v7/backpackRarity.js',
}


async function parseAllDucks() {
    for (let [databaseName, url] of Object.entries(URLS)) {
        updateLocalDatabases(databaseName, url).catch((err) => {
            console.log(err)
        })
    }


    let parsedDucks = [];
    let allDucks = JSON.parse(fs.readFileSync("./databases/allDucks.json").toString());
    for (const duck of allDucks) {
        let attributes = [];
        for (const [key, value] of Object.entries(duck.attributes)) {
            if (key > 0) {
                attributes.push(value);
            }
        }
        let duckData = {
            "id": duck.duck,
            "rank": duck.history[0].rank,
            "version": duck.history.length,
            "rarityChange": (duck.history.length < 2) ? 0 : duck.history[1].rank - duck.history[0].rank,
            "img": duck.history[0].image,
            "parties": duck.attributes[0].value,
            "traits": attributes,
        };
        parsedDucks.push(duckData);
    }
    return parsedDucks;
}


app.use(cors(
    {'Access-Control-Allow-Origin': '*'}
));

app.get('/api', (req, res) => {
    parseAllDucks().then((data) => res.send(data)).catch((err) => {
        console.log(err);
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

