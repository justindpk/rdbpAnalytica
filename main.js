const axios = require('axios');

async function getDataFromUrl(url) {
    const data = await axios.get(url)
    return data.data
}

function parseAllDucks(name, data) {
    data = data.replace(name + ' = ', '')
    data = JSON.parse(data)
    console.log(data)
    return data
}

URLS = {
    'allDucks': 'https://duck.art/rarity-data/v7/allDucks.js',
    'globalRarity': 'https://duck.art/rarity-data/v7/globalRarity.js',
    'allBackpacks': 'https://duck.art/rarity-data/v7/allBackpacks.js',
    'backpackRarity': 'https://duck.art/rarity-data/v7/backpackRarity.js',
}


for (const [database_name, database_url] of Object.entries(URLS)) {
    getDataFromUrl(database_url).then(data => { parseAllDucks(database_name, data)})
}
