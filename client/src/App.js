import {useEffect, useState} from 'react';
import './main.css';
import MainTable from "./components/MainTable";
import BackpacksTable from "./components/BackpacksTable";
import TraitsTable from "./components/TraitsTable";
import {scrollToTop, upperFirstLetter} from "./components/helpers";
import columns from "./components/columnClasses";

const databaseNames = ['allDucks', 'globalRarity', 'allBackpacks', 'backpackRarity', 'traits'];

function TopBar() {
  return (
    <div className="topBar">
      <header className="header">
        <div className="logoAndTitle">

          <div className="analyticaLogo">
            <img src="/img/analyticaStrawberryDuck.png" alt="strawberry duck"/>
          </div>
          <div className="analyticaTitle">
            <h1> RDBP Analytica </h1>
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
             href="https://blur.io/collection/rubber-duck-bath-party" target="_blank"
             rel="noreferrer">
            <img className="darkBlurIcon" src="/img/blurio.png" alt="blur"/>
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
  const [originalDatabases, setOriginalDatabases] = useState();
  const [tableType, setTableType] = useState("main");
  const [amountToLoad, setAmountToLoad] = useState(20);
  const [reset, setReset] = useState(0);
  const [sorts, setSorts] = useState({});
  const [filters, setFilters] = useState({});


  useEffect(() => {
    let newDatabases = {};
    databaseNames.forEach((databaseName) => {
      newDatabases = {...newDatabases, [databaseName]: JSON.parse(JSON.stringify(window[databaseName]))}
    });

    let traitToID = {};
    for (const [traitType, traits] of Object.entries(newDatabases['traits'])) {
      traitToID[traitType] = {};
      for (const trait of traits) {
        traitToID[traitType][trait['name']] = (trait['id'].length < 2 ? '0' + trait['id'] : trait['id']);
      }
    }
    newDatabases['traitToID'] = traitToID;

    let newDucks = []
    for (let duck of newDatabases['allDucks']) {
      duck['traits'] = {};
      duck['attributes'].forEach((attribute) => {
        duck['traits'][attribute['trait_type']] = attribute['value']
      });
      newDucks.push(duck);
    }
    newDatabases['allDucks'] = newDucks;

    setDatabases(newDatabases);
    setOriginalDatabases(JSON.parse(JSON.stringify(newDatabases)));
    setSorts({});
    setFilters({});
  }, [reset]);

  function handleScroll(e) {
    if (0.9 * (e.target.scrollHeight - e.target.scrollTop) <= e.target.clientHeight) {
      setAmountToLoad(amountToLoad + 10);
    }
  }

  function handleSort(name) {
    if (sorts[name]) {
      if (sorts[name]['ascending']) {
        const priority = sorts[name]['priority'];
        setSorts({...sorts, [name]: {ascending: false, priority: priority}});
      } else {
        const newSorts = {...sorts};
        const priority = sorts[name]['priority'];
        for (let sort in newSorts) {
          if (newSorts[sort]['priority'] > priority) {
            newSorts[sort]['priority'] -= 1;
          }
        }
        delete newSorts[name];
        setSorts(newSorts);
      }
    } else {
      setSorts({...sorts, [name]: {ascending: true, priority: Object.keys(sorts).length + 1}});
    }
  }

  function runAllSorts(allDucks) {
    let sortedDucks = [...allDucks];
    if (databases) {
      const sortedSorts = Object.entries(sorts).sort((a, b) => a[1]['priority'] - b[1]['priority']);
      for (const [name, attrs] of sortedSorts) {
        const compareFn = columns[name].sort
        sortedDucks.sort((a, b) => compareFn(a, b) * (attrs['ascending'] ? 1 : -1));
      }
    }
    return sortedDucks;
  }

  function runAllFilters(allDucks) {
    let filteredDucks = [...allDucks];
    if (databases) {
      console.log(filters);
      for (const [name, values] of Object.entries(filters)) {
        const upperFirst = upperFirstLetter(name)
        let passedDucks = [];
        if (values.length > 0) {
          filteredDucks.forEach((duck) => {
            if (values.includes(duck['traits'][upperFirst])) {
              passedDucks.push(duck);
            } else if (values.includes('Empty') && !duck['traits'][upperFirst]) {
              passedDucks.push(duck);
            }
          });
          filteredDucks = passedDucks;
        }
      }
    }
    return filteredDucks;
  }


  useEffect(() => {
    if (databases) {
      setDatabases({...databases, allDucks: runAllSorts(databases['allDucks'])});
    }
  }, [sorts]);

  useEffect(() => {
    if (databases) {
      const filteredDucks = runAllFilters(originalDatabases['allDucks']);
      setDatabases({...databases, allDucks: runAllSorts(filteredDucks)});
    }
  }, [filters]);

  let table;
  if (databases) {
    switch (tableType) {
      case "main":
        table = <MainTable databases={databases}
                           amountToLoad={amountToLoad}
                           handleSort={handleSort}
                           sorts={sorts}
                           filters={filters}
        />
        break;
      case "traits":
        table = <TraitsTable databases={databases}
                             amountToLoad={amountToLoad}
                             handleSort={handleSort}
                             sorts={sorts}
                             filters={filters}
                             setFilters={setFilters}
        />
        break;
      case "backpacks":
        table = <BackpacksTable databases={databases} 
                                amountToLoad={amountToLoad} 
                                handleSort={handleSort}
                                sorts={sorts}
                                filters={filters}
                                setFilters={setFilters}
        />
        break;
      default:
        table = <MainTable databases={databases}
                           amountToLoad={amountToLoad}/>;
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
