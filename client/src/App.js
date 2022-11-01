// import './App.css';
import {useEffect, useState} from 'react';
import './main.css';
import MainTable from "./components/MainTable";
import BackpacksTable from "./components/BackpacksTable";
import TraitsTable from "./components/TraitsTable";


const databaseNames = ['allDucks', 'globalRarity', 'allBackpacks', 'backpackRarity', 'traits'];


function parseAllDucks({backpackRarity, allDucks, allBackpacks}) {
  let backpackTypesCount = {};
  for (let [backpackId, backpack] of Object.entries(backpackRarity)) {
    if (backpackId !== "traitCount") {
      backpackTypesCount[backpackId] = Object.keys(backpack).length;
    }
  }


  let parsedDucks = [];

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
  return parsedDucks;
}

function TopBar() {
  return (
    <>
      <header className="header">
        <div className="logoAndTitle">

          <a className="analyticaLogo" href="#top">
            <img src="/img/analyticaStrawberryDuck.png" alt="strawberry duck"/>
          </a>
          <div className="analyticaTitle">
            <a href="top"> RDBP Analytica </a>
            <p className="description">
              A community project analyzing the <a className="description" href="https://duck.art/" target="_blank" rel="noreferrer">
              Rubber Duck Bath Party</a> NFT collection.
            </p>
          </div>
        </div>
        <div className="links">
          <a className="socialMediaSvg" href="https://duck.art/" target="_blank" rel="noreferrer">
            <img className="darkDuckIcon" src="/img/darkDuck.png" alt="duck.art" />
          </a>
          <a className="socialMediaSvg" href="https://opensea.io/collection/rubber-duck-bath-party" target="_blank" rel="noreferrer">
            <img src="/img/opensea.svg" alt="opensea"/>
          </a>
          <a className="socialMediaSvg"
             href="https://looksrare.org/collections/0x7A4D1b54dD21ddE804c18B7a830B5Bc6e586a7F6" target="_blank" rel="noreferrer">
            <img src="/img/looksrare.svg" alt="looksrare"/>
          </a>
          <a className="socialMediaSvg" href="https://twitter.com/rubberduckbp" target="_blank" rel="noreferrer">
            <img src="/img/twitter.svg" alt="twitter" />
          </a>
          <a className="socialMediaSvg" href="https://discord.gg/rdbp" target="_blank" rel="noreferrer">
            <img src="/img/discord.svg" alt="discord" />
          </a>
        </div>
      </header>

      <div className="doubleHeader">
        <div className="screenerTitle">
          <a href="/" id="screenerTitle"> Duck Screener </a>
        </div>
      </div>
    </>
  )

}

function TableTypeBar({setTableType}) {
  return (
    <div className="filterBar">
      <button className="button row yellow" onClick={() => setTableType("main")}>
        <img className="duckButtonIcon" src="/img/duckIcon.svg" alt="ducks"/>
      </button>
      <button className="button row red" onClick={() => setTableType("traits")}>Traits</button>
      <button className="button row lightPurple" onClick={() => setTableType("backpacks")}>
        <img className="backpackIcon" src="/img/backpack.png" alt="backpacks"/>
      </button>
    </div>
  )
}

function App() {
  const [databases, setDatabases] = useState();
  const [parsedDatabase, setParsedDatabase] = useState();
  const [loaded, setLoaded] = useState(false);
  const [tableType, setTableType] = useState("main");


  useEffect(() => {
    let newDatabases = {};
    databaseNames.forEach((databaseName) => {
      newDatabases = {...newDatabases, [databaseName]: window[databaseName]}
    });
    setDatabases(newDatabases);
  }, []);

  useEffect(() => {
    if (databases) {
      setParsedDatabase(parseAllDucks({
        backpackRarity: databases['backpackRarity'],
        allDucks: databases['allDucks'],
        allBackpacks: databases['allBackpacks'],
      }));
      setLoaded(true);
      console.log(databases);
    }
  }, [databases]);

  return (
    <div className="App">
      <TopBar/>
      <TableTypeBar setTableType={setTableType}/>
      <div className="screenerTitle">
        {loaded ? (
          <div>
            <p className="screenerTitle">Loaded:
              {Object.keys(databases).map((databaseName) => " " + databaseName)}</p>
            {
              tableType === "main" ? (
                <MainTable databases={databases}/>
              ) : tableType === "traits" ? (
                <TraitsTable databases={databases}/>
              ) : tableType === "backpacks" ? (
                <BackpacksTable databases={databases}/>
              ) : null
            }
          </div>
        ) : (
          <p className="screenerTitle">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default App;
