const axios = require('axios');

async function getDataFromUrl(url) {
    const data = await axios.get(url)
    return data.data
}

function read_data(data) {
    console.log(JSON.parse(data))
}

URLS = {
    'allDucks': 'https://duck.art/rarity-data/v7/allDucks.js',
    'globalRarity': 'https://duck.art/rarity-data/v7/globalRarity.js',
    'allBackpacks': 'https://duck.art/rarity-data/v7/globalRarity.js',
    'backpackRarity': 'https://duck.art/rarity-data/v7/globalRarity.js',
}

//Test func
getDataFromUrl(URLS.allDucks).then(data => read_data(data))