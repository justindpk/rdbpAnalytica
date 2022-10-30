import './App.css';
import {useEffect, useState} from 'react';

const URLS = {
  'allDucks': 'https://duck.art/rarity-data/v9/allDucks.js',
  'globalRarity': 'https://duck.art/rarity-data/v9/globalRarity.js',
  'allBackpacks': 'https://duck.art/rarity-data/v9/allBackpacks.js',
  'backpackRarity': 'https://duck.art/rarity-data/v9/backpackRarity.js',
  'traits': 'https://duck.art/rarity-data/traits.js',
}


// async function parseAllDucks() {
//   for (let [databaseName, url] of Object.entries(URLS)) {
//     await updateLocalDatabases(databaseName, url).catch((err) => {
//       console.log(err)
//     })
//   }
//   const traitsTable = JSON.parse(fs.readFileSync("./databases/traits.json").toString());
//   const backpackRarity = JSON.parse(fs.readFileSync("./databases/backpackRarity.json").toString());
//   let backpackTypesCount = {};
//   for (let [backpackId, backpack] of Object.entries(backpackRarity)) {
//     if (backpackId !== "traitCount") {
//       backpackTypesCount[backpackId] = Object.keys(backpack).length;
//     }
//   }
//
//
//   let parsedDucks = [];
//   let allDucks = JSON.parse(fs.readFileSync("./databases/allDucks.json").toString());
//   let allBackpacks = JSON.parse(fs.readFileSync("./databases/allBackpacks.json").toString());
//
//   allDucks.sort((a, b) => a["duck"] - b["duck"])
//   allBackpacks.sort((a, b) => a["duck"] - b["duck"])
//
//   for (const i in allDucks) {
//     let duck = allDucks[i];
//     let backpack = allBackpacks[i];
//     let duckData = {
//       "id": duck.duck,
//       "rank": duck.history[0].rank,
//       "version": duck.history.length,
//       "rarityChange": (duck.history.length < 2) ? 0 : duck.history[1].rank - duck.history[0].rank,
//       "img": duck.history[0].image,
//       "parties": duck.attributes[0].value,
//       "background": null,
//       "body": null,
//       "tattoo": null,
//       "head": null,
//       "shirt": null,
//       "neck": null,
//       "beak": null,
//       "eyes": null,
//       "cover": null,
//       "water": null,
//       "bag of sand": null,
//       "paint bucket": null,
//       "egg": 0,
//       "seed": 0,
//       "chest": 0
//     };
//
//     for (let [key, value] of Object.entries(duck.attributes)) {
//       if (key > 0) {
//         duckData[value.trait_type.toLowerCase()] = value.value;
//       }
//     }
//
//     // Backpacks
//     for (let [backpackId, backpackTypeCount] of Object.entries(backpackTypesCount)) {
//       if (backpackTypeCount > 1) {
//         duckData[backpackId] = 0;
//       }
//     }
//     for (const [key, value] of Object.entries(backpackTypesCount)) {
//       if (value === 1) {
//         duckData[key] = 0;
//       }
//     }
//     for (let attribute of backpack.attributes) {
//       if (backpackTypesCount[attribute.trait_type] === 1) {
//         duckData[attribute.trait_type.toLowerCase()] += 1;
//       } else {
//         duckData[attribute.trait_type.toLowerCase()] = attribute.value;
//       }
//     }
//     parsedDucks.push(duckData);
//   }
//   return [parsedDucks, traitsTable, backpackRarity];
// }


function App() {
  const [allDucks, setAllDucks] = useState();
  const [globalRarity, setGlobalRarity] = useState();
  const [allBackpacks, setAllBackpacks] = useState();
  const [backpackRarity, setBackpackRarity] = useState();
  const [traits, setTraits] = useState();
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    Object.entries(URLS).forEach(([databaseName, url]) => {
      const script = document.createElement('script');
      script.src = url;
      script.addEventListener('load', () => {
        switch (databaseName) {
          case 'allDucks':
            setAllDucks(window.allDucks);
            break;
          case 'globalRarity':
            setGlobalRarity(window.globalRarity);
            break;
          case 'allBackpacks':
            setAllBackpacks(window.allBackpacks);
            break;
          case 'backpackRarity':
            setBackpackRarity(window.backpackRarity);
            break;
          case 'traits':
            setTraits(window.traits);
            break;
          default:
            break;
        }
        document.body.removeChild(script);
      });
      document.body.appendChild(script);
    });
  }, []);

  useEffect(() => {
    if (allDucks && globalRarity && allBackpacks && backpackRarity && traits) {
      console.log({
        'allDucks': allDucks,
        'globalRarity': globalRarity,
        'allBackpacks': allBackpacks,
        'backpackRarity': backpackRarity,
        'traits': traits
      });
      setLoaded(true);
    }
  }, [allDucks, globalRarity, allBackpacks, backpackRarity, traits]);


  return (
    <div className="App">
      <header className="App-header">
        {loaded ? (
          <p>Loaded</p>
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
}

export default App;
