const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

async function updateLocalDatabases(database_name, database_url) {
    async function getWriteDB() {
        let response = await axios.get(database_url);
        response = response.data.replace(database_name + ' = ', '');
        fs.writeFileSync(databaseFilepath, response);
    }

    const databaseFilepath = `./databases/${database_name}.json`
    if (!fs.existsSync(databaseFilepath)) {
        await getWriteDB();
    }
    let stat = fs.statSync(databaseFilepath);
    if (Date.now() - stat.mtimeMs > 604800000) {
        await getWriteDB();
    }
}


const URLS = {
    'allDucks': 'https://duck.art/rarity-data/v7/allDucks.js',
    'globalRarity': 'https://duck.art/rarity-data/v7/globalRarity.js',
    'allBackpacks': 'https://duck.art/rarity-data/v7/allBackpacks.js',
    'backpackRarity': 'https://duck.art/rarity-data/v7/backpackRarity.js',
}

for (let [databaseName, url] of Object.entries(URLS)) {
    updateLocalDatabases(databaseName, url).catch((err) => {
        console.log(err)
    });
}
let parsedDucks = [];
let allDucks = JSON.parse(fs.readFileSync("./databases/allDucks.json").toString());
console.log(allDucks);
for (const duck of allDucks) {
    let duckData = {
        "id": duck.duck,
        "rank": duck.history[0].rank,
        "versions": duck.history.length,
        "rarityChange": (duck.history.length < 2) ? 0 : duck.history[0].rank - duck.history[1].rank,
        "img": duck.history[0].image,
        "parties": duck.attributes[0].value
    };
    parsedDucks.push(duckData)
}


app.use(cors(
    {'Access-Control-Allow-Origin': '*'}
));

app.get('/', (req, res) => {
    res.send(parsedDucks);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

