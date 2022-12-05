import {useEffect, useState} from 'react';
import './styles/main.scss';
import MainTable from "./components/MainTable";
import BackpacksTable from "./components/BackpacksTable";
import TraitsTable from "./components/TraitsTable";
import columns, {scrollToLeft, scrollToTop} from "./components/helpers";
import TimelineTable from "./components/TimelineTable";

const databaseNames = ['allDucks', 'globalRarity', 'allBackpacks', 'backpackRarity', 'traits'];

function TopBar() {
  return (
    <header className="header">
      <div className="logoAndTitle">

        <div className="analyticaLogo">
          <img src="/img/analyticaStrawberryDuckSmiling.png" alt="strawberry duck"/>
        </div>
        <div className="analyticaTitle">
          <h1> RDBP Analytica </h1>
          <p className="description">
            A community project analyzing the <a className="description" href="https://duck.art/" target="_blank" rel="noreferrer">
            Rubber Duck Bath Party </a> NFT collection.
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
  )
}

function TableTypeBar({setTableType, setReset, reset}) {
  return (
    <div className="filterBar">
      <div className='left'>
        <button className="button row yellow" onClick={() => {
          setTableType("main");
          scrollToLeft();
        }}>
          <img className="duckButtonIcon" src="/img/duckIcon.svg" alt="ducks"/>
        </button>
        <button className="button row red" onClick={() => {
          setTableType("traits");
          scrollToLeft();
        }}>Traits
        </button>
        <button className="button row lightPurple" onClick={() => {
          setTableType("backpacks");
          scrollToLeft();
        }}>
          <img className="backpackIcon" src="/img/backpack.png" alt="backpacks"/>
        </button>
        
        <button className="button row orange" onClick={() => {
          setTableType("timeline");
          scrollToLeft();
        }}>Parties
        </button>
      </div>

      <div className='control'>
        <button className="button row grey" onClick={() => {
          setReset(reset + 1);
        }}>
          <img className="backpackIcon" src="/img/reset.png" alt="reset"/>
        </button>
        <button className="button row grey" onClick={() => {
          scrollToTop();
        }}>
          <img className="arrowIcon" src="/img/upArrow.png" alt="scrollToTop"/>
        </button>
      </div>

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

    let fullHistory = [];
    for (const duck of newDatabases['allDucks']) {
      if (duck.history.length === 10) {
        for (const history of duck.history) {
          fullHistory.push(history.image.split('/')[4]);
        }
        break;
      }
    }
    fullHistory.reverse();

    function findHistoryMatch(duck, tag) {
      for (const history of duck.history) {
        if (history.image.split('/')[4] === tag) {
          return history;
        }
      }
    }

    for (const duck of newDatabases['allDucks']) {
      let paddedHistory = [];
      for (const tag of fullHistory) {
        const history = findHistoryMatch(duck, tag);
        if (history) {
          paddedHistory.push(history);
          paddedHistory[paddedHistory.length - 1].empty = false;
        }  else {
          paddedHistory.push(paddedHistory[paddedHistory.length - 1]);
          paddedHistory[paddedHistory.length - 1].empty = true;
        } 
      }
      duck.paddedHistory = paddedHistory;
    }

    let traitToID = {};
    for (const [traitType, traits] of Object.entries(newDatabases['traits'])) {
      traitToID[traitType] = {};
      for (const trait of traits) {
        traitToID[traitType][trait['name']] = (trait['id'].length < 2 ? '0' + trait['id'] : trait['id']);
      }
    }
    newDatabases['traitToID'] = traitToID;

    let duckDict = {}
    for (let duck of newDatabases['allDucks']) {
      duck['traits'] = {};
      duck['attributes'].forEach((attribute) => {
        duck['traits'][attribute['trait_type']] = attribute['value']
      });

      duck['backpacks'] = {};
      duckDict[duck['duck']] = duck;
    }
    newDatabases['allBackpacks'].forEach((duckBackpack) => duckBackpack['attributes'].forEach((backpackAttr) => {
      if (duckDict[duckBackpack['duck']]['backpacks'][backpackAttr['trait_type']] === undefined) {
        duckDict[duckBackpack['duck']]['backpacks'][backpackAttr['trait_type']] = [];
      }
      duckDict[duckBackpack['duck']]['backpacks'][backpackAttr['trait_type']].push(backpackAttr['value']);
    }));
    newDatabases['allDucks'] = Object.values(duckDict);
    newDatabases['allDucks'].sort((a, b) => a['history'][0]['rank'] - b['history'][0]['rank']);

    setDatabases(newDatabases);
    setOriginalDatabases(JSON.parse(JSON.stringify(newDatabases)));
    setSorts({});
    setFilters({});
    setAmountToLoad(20);
  }, [reset]);

  function handleScroll(e) {
    if (0.95 * (e.target.scrollHeight - e.target.scrollTop) <= e.target.clientHeight) {
      setAmountToLoad(amountToLoad + 10);
    }
    //console.log(e.target.scrollHeight, e.target.scrollTop, e.target.clientHeight);
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
      for (const [name, [attrType, values]] of Object.entries(filters)) {
        const upperFirst = columns[name].name;
        let passedDucks = [];
        if (values.length > 0) {
          filteredDucks.forEach((duck) => {
            if (attrType === 'trait') {
              if (values.includes(duck['traits'][upperFirst])) {
                passedDucks.push(duck);
              } else if (values.includes('None') && !duck['traits'][upperFirst]) {
                passedDucks.push(duck);
              }
            } else if (attrType === 'backpack') {
              if (values.includes(duck['backpacks'][upperFirst][0])) {
                passedDucks.push(duck);
              } else if (values.includes('None') && !duck['backpacks'][upperFirst][0]) {
                passedDucks.push(duck);
              }
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
      
      case "timeline":
        table = <TimelineTable databases={databases}
                               amountToLoad={amountToLoad}
                               handleSort={handleSort}
                               sorts={sorts}
                               filters={filters}/>
        break;
      
      default:
        table = <MainTable databases={databases}
                           amountToLoad={amountToLoad}/>;
    }
  } else {
    table = <p className="loading">Loading...</p>;
  }

  return (
    <div className="mainContainer" onScroll={handleScroll}>
      <TopBar/>
      <div className="doubleHeader">
        <p className="screenerTitle"> Duck Screener </p>
      </div>
      <TableTypeBar setTableType={setTableType} reset={reset} setReset={setReset}/>
      {table}
    </div>
  );
}

export default App;