import {useEffect, useState} from 'react';
import './main.css';
import MainTable from "./components/MainTable";
import BackpacksTable from "./components/BackpacksTable";
import TraitsTable from "./components/TraitsTable";

const databaseNames = ['allDucks', 'globalRarity', 'allBackpacks', 'backpackRarity', 'traits'];

function TopBar() {
  return (
    <>
      <header className="header">
        <div className="logoAndTitle">

          <a className="analyticaLogo" onClick={() => {window.scroll(0, 0)}}>
            <img src="/img/analyticaStrawberryDuck.png" alt="strawberry duck"/>
          </a>
          <div className="analyticaTitle">
            <a onClick={() => {window.scroll(0, 0)}}> RDBP Analytica </a>
            <p className="description">
              A community project analyzing the <a className="description" href="https://duck.art/" target="_blank"
                                                   rel="noreferrer">
              Rubber Duck Bath Party</a> NFT collection.
            </p>
          </div>
        </div>
        <div className="links">
          <a className="socialMediaSvg" href="https://duck.art/" target="_blank" rel="noreferrer">
            <img className="darkDuckIcon" src="/img/darkDuck.png" alt="duck.art"/>
          </a>
          <a className="socialMediaSvg" href="https://opensea.io/collection/rubber-duck-bath-party" target="_blank"
             rel="noreferrer">
            <img src="/img/opensea.svg" alt="opensea"/>
          </a>
          <a className="socialMediaSvg"
             href="https://looksrare.org/collections/0x7A4D1b54dD21ddE804c18B7a830B5Bc6e586a7F6" target="_blank"
             rel="noreferrer">
            <img src="/img/looksrare.svg" alt="looksrare"/>
          </a>
          <a className="socialMediaSvg" href="https://twitter.com/rubberduckbp" target="_blank" rel="noreferrer">
            <img src="/img/twitter.svg" alt="twitter"/>
          </a>
          <a className="socialMediaSvg" href="https://discord.gg/rdbp" target="_blank" rel="noreferrer">
            <img src="/img/discord.svg" alt="discord"/>
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
  const [loaded, setLoaded] = useState(false);
  const [tableType, setTableType] = useState("main");


  useEffect(() => {
    let newDatabases = {};
    databaseNames.forEach((databaseName) => {
      newDatabases = {...newDatabases, [databaseName]: window[databaseName]}
    });
    setDatabases(newDatabases);
    setLoaded(true);
  }, []);


  let table;
  if (loaded) {
    switch (tableType) {
      case "main":
        table = <MainTable databases={databases}/>;
        break;
      case "traits":
        table = <TraitsTable databases={databases}/>;
        break;
      case "backpacks":
        table = <BackpacksTable databases={databases}/>;
        break;
      default:
        table = <MainTable databases={databases}/>;
    }
  } else {
    table = <p className="loading">Loading...</p>;
  }

  return (
    <div className="App">
      <TopBar/>
      <TableTypeBar setTableType={setTableType}/>
      <div className="screenerTitle">
        {table}
      </div>
    </div>
  );
}

export default App;
