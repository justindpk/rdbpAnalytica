import axios from "axios";

async function duckDatabaseParser(database_name, database_url) {
    let response = await axios.get(database_url)
    response = response.data.replace(database_name + ' = ', '')
    return [database_name, JSON.parse(response)]
}


function main(databases) {
    for (let [name, database] of databases) {
        console.log(name, database)
    }
}


const URLS = {
    'allDucks': 'https://duck.art/rarity-daat/v7/allDucks.js',
    'globalRarity': 'https://duck.art/rarity-data/v7/globalRarity.js',
    'allBackpacks': 'https://duck.art/rarity-data/v7/allBackpacks.js',
    'backpackRarity': 'https://duck.art/rarity-data/v7/backpackRarity.js',
}


const promises = []
for (const [database_name, database_url] of Object.entries(URLS)) {
    const promise = duckDatabaseParser(database_name, database_url); promises.push(promise);
}

Promise.all(promises).then((values) => {
    main(values)
})