import './App.css';
import {useEffect, useState} from 'react';


const databaseNames = ['allDucks', 'globalRarity', 'allBackpacks', 'backpackRarity', 'traits'];


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
  const [databases, setDatabases] = useState();
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    let newDatabases = {};
    databaseNames.forEach((databaseName) => {
      newDatabases = {...newDatabases, [databaseName]: window[databaseName]}
    });
    setDatabases(newDatabases);
    setLoaded(true);
  }, []);

  useEffect(() => {
    console.log(databases);
  }, [databases]);

  return (
    <div className="App">
      <header className="header">
      </header>
        <div className="doubleHeader"> 
          <div className="screenerTitle">
          {loaded ? (
              <p className="screenerTitle">Loaded</p>
            ) : (
              <p className="screenerTitle">Loading...</p>
            )}
            </div>
        </div>
    </div>
  );
}

export default App;
