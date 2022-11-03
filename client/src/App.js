import {useEffect, useState} from 'react';
import './main.css';
import MainTable from "./components/MainTable";
import BackpacksTable from "./components/BackpacksTable";
import TraitsTable from "./components/TraitsTable";
import {scrollToTop} from "./components/helpers";

const databaseNames = ['allDucks', 'globalRarity', 'allBackpacks', 'backpackRarity', 'traits'];

function TopBar() {
  return (
    <div className="topBar">
      <header className="header">
        <div className="logoAndTitle">

          <a className="analyticaLogo">
            <img src="/img/analyticaStrawberryDuck.png" alt="strawberry duck"/>
          </a>
          <div className="analyticaTitle">
            <a> RDBP Analytica </a>
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

    </div>
  )

}

function TableTypeBar({setTableType, setReset, reset}) {
  return (
    <div className="filterBar">
      <button className="button row yellow" onClick={() => {
        setTableType("main");
        scrollToTop();
      }}>
        <img className="duckButtonIcon" src="/img/duckIcon.svg" alt="ducks"/>
      </button>
      <button className="button row red" onClick={() => {
        setTableType("traits");
        scrollToTop();
      }}>Traits
      </button>
      <button className="button row lightPurple" onClick={() => {
        setTableType("backpacks");
        scrollToTop();
      }}>
        <img className="backpackIcon" src="/img/backpack.png" alt="backpacks"/>
      </button>
      <button className="button row grey" onClick={() => {
        scrollToTop();
        setReset(reset + 1);
      }}>
        <img className="backpackIcon" src="/img/reset.svg" alt="reset"/>
      </button>
    </div>
  )
}

function App() {
  const [databases, setDatabases] = useState();
  const [loaded, setLoaded] = useState(false);
  const [tableType, setTableType] = useState("main");
  const [amountToLoad, setAmountToLoad] = useState(20);
  const [reset, setReset] = useState(0);


  useEffect(() => {
    let newDatabases = {};
    databaseNames.forEach((databaseName) => {
      newDatabases = {...newDatabases, [databaseName]: JSON.parse(JSON.stringify(window[databaseName]))}
    });
    setDatabases(newDatabases);
    setLoaded(true);
  }, [reset]);

  function handleScroll(e) {
    if (0.9 * (e.target.scrollHeight - e.target.scrollTop) <= e.target.clientHeight) {
      setAmountToLoad(amountToLoad + 10);
    }
  }


  let table;
  if (loaded) {
    switch (tableType) {
      case "main":
        table = <MainTable databases={databases} setDatabases={setDatabases} amountToLoad={amountToLoad}/>
        break;
      case "traits":
        table = <TraitsTable databases={databases} setDatabases={setDatabases} amountToLoad={amountToLoad}/>
        break;
      case "backpacks":
        table = <BackpacksTable databases={databases} setDatabases={setDatabases} amountToLoad={amountToLoad}/>
        break;
      default:
        table = <MainTable databases={databases} setDatabases={setDatabases} amountToLoad={amountToLoad}/>;
    }
  } else {
    table = <p className="loading">Loading...</p>;
  }

  return (
    <div className="body">
      <div className="tableContainer" onScroll={handleScroll}>
        <TopBar/>

        <div className="doubleHeader">
          <p className="screenerTitle"> Duck Screener </p>
        </div>

        <TableTypeBar setTableType={setTableType} reset={reset} setReset={setReset}/>
        <div className="duckTable" key={reset}>
          {table}
        </div>
      </div>
    </div>
  );
}

export default App;
