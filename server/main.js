const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

async function duckDatabaseParser(database_name, database_url) {
    let response = await axios.get(database_url)
    response = response.data.replace(database_name + ' = ', '')
    return JSON.parse(response)
}


// function main(databases) {
//     for (let [name, database] of databases) {
//         console.log(name, database)
//     }
// }

const URLS = {
    'allDucks': 'https://duck.art/rarity-data/v7/allDucks.js',
    'globalRarity': 'https://duck.art/rarity-data/v7/globalRarity.js',
    'allBackpacks': 'https://duck.art/rarity-data/v7/allBackpacks.js',
    'backpackRarity': 'https://duck.art/rarity-data/v7/backpackRarity.js',
}


// const promises = []
// for (const [database_name, database_url] of Object.entries(URLS)) {
//     const promise = duckDatabaseParser(database_name, database_url);
//     promises.push(promise);
// }

// Promise.all(promises).then((values) => {
//     main(values)
// })
app.use(cors(
    {'Access-Control-Allow-Origin': '*'}
));

app.get('/', (req, res) => {
    duckDatabaseParser('allDucks', URLS['allDucks']).then((value) => {
    console.log(value); res.send(value) }).catch((error) => {
        res.send(error)
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

