import './App.css';
import {useEffect, useState} from 'react';
import Table from './components/Table.js';
import './main.css';


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
  }, []);

  useEffect(() => {
    console.log(databases);
    setLoaded(true);
  }, [databases]);

  return (
    <div className="App">
      <header className="header">
        <div className="logoAndTitle">

          <a className="analyticaLogo" href="#top">
            <img src="/img/analyticaStrawberryDuck.png" />
          </a>
          <div className="analyticaTitle">
            <a> RDBP Analytica </a>
            <p className="description"> A community project analyzing the <a className="description" href="https://duck.art/" target="_blank">Rubber Duck Bath Party</a> NFT collection.</p>
          </div>
        </div>
        {/*<div className="links">*/}
        {/*  <a className="socialMediaSvg" href="https://duck.art/" target="_blank"><img className="darkDuckIcon" src="/client1/public/img/darkDuck.png"></a>*/}
        {/*  <a className="socialMediaSvg" href="https://opensea.io/collection/rubber-duck-bath-party" target="_blank"><img src="/client1/public/img/opensea.svg"></a>*/}
        {/*  <a className="socialMediaSvg" href="https://looksrare.org/collections/0x7A4D1b54dD21ddE804c18B7a830B5Bc6e586a7F6" target="_blank"><img src="/client1/public/img/looksrare.svg"></a>*/}
        {/*  <a className="socialMediaSvg" href="https://twitter.com/rubberduckbp" target="_blank"><img src="/client1/public/img/twitter.svg"></a>*/}
        {/*  <a className="socialMediaSvg" href="https://discord.gg/rdbp" target="_blank"><img src="/client1/public/img/discord.svg"></a>*/}
        {/*</div>*/}
      </header>
      <div className="doubleHeader">
        <div className="screenerTitle">
          {loaded ? (
            <div>
              <p className="screenerTitle">Loaded:
                {Object.keys(databases).map((databaseName) => " " + databaseName)}</p>
              <Table databases={databases}/>
            </div>
          ) : (
            <p className="screenerTitle">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
