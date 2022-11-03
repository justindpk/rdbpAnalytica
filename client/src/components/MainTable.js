import {useState} from "react";

function MainTable({databases, setDatabases, amountToLoad}) {
  const [sort, setSort] = useState({'rank': true, 'version': null, 'rarityChange': null, 'parties': null})
  const [sortBy, setSortBy] = useState("rank");
  const [sortAscending, setSortAscending] = useState(true);

  function handleSort(name, func) {
    let newSortAscending;
    if (name === sortBy) {
      newSortAscending = !sortAscending;
    } else {
      newSortAscending = true;
    }
    let newDatabases = {...databases};
    newDatabases['allDucks'].sort((a, b) => {
      return func(a, b) * (newSortAscending ? 1 : -1);
    });
    setSortAscending(newSortAscending);
    setDatabases(newDatabases);
    setSortBy(name);
    setSort({...sort, [name]: newSortAscending});
  }

  function handleSortClassName(name) {
    if (name === sortBy) {
      return "selected"
    } else {
      return "";
    }
  }

  function getArrow(name) {
    switch (sort[name]) {
      case true:
        return "▼";
      case false:
        return "▲";
      default:
        return "▪";
    }
  }


  return (
    <table>
      <thead>
      <tr>
        <th onClick={() => handleSort('rank', (a, b) => a.history[0].rank - b.history[0].rank)}
            className={handleSortClassName('rank')}>
          Rank {getArrow('rank')}</th>
        <th><img src="/img/duckIcon.svg" alt="duck" className='duckIcon'/></th>
        <th className={handleSortClassName('id')}
            onClick={() => handleSort('id', (a, b) => a.duck - b.duck)}>ID {getArrow('id')}</th>
        <th className={handleSortClassName('version')}
            onClick={() => handleSort('version', (a, b) => a.history[0].version - b.history[0].version)}>
          Version {getArrow('version')}</th>
        <th className={handleSortClassName('parties')}
            onClick={() => handleSort('parties', (a, b) => a.attributes[0].value - b.attributes[0].value)}>
          Parties {getArrow('parties')}</th>
        <th className={handleSortClassName('rankChange')} onClick={() => handleSort('rankChange', (a, b) =>
          (a.history.length > 1 ? a.history[1].rank - a.history[0].rank : 0) -
          (b.history.length > 1 ? b.history[1].rank - b.history[0].rank : 0))}>Rank
          Change {getArrow('rankChange')}
        </th>
        <th>Opensea</th>
      </tr>
      </thead>
      <tbody>
      {databases['allDucks'].slice(0, amountToLoad).map((duck, index) => {
        return (
          <tr key={index}>
            <td className={handleSortClassName('rank')}>{duck.history[0].rank}</td>
            <td><a href={`https://duck.art/${duck.duck}`} target="_blank" rel="noreferrer">
              <img src={duck.history[0].image} alt="duck" className='duckImage'/></a>
            </td>
            <td className={handleSortClassName('id')}>{duck.duck}</td>
            <td className={handleSortClassName('version')}>{duck.history[0].version}</td>
            <td
              className={handleSortClassName('parties')}>{duck.attributes[0].value} / {duck.attributes[0].max_value}</td>
            <td
              className={handleSortClassName('rankChange')}>{duck.history.length > 1 ? duck.history[1].rank - duck.history[0].rank : 0}</td>
            <td><a href={`https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/${duck.duck}`}
                   target="_blank" rel="noreferrer"><img src={"/img/opensea.svg"} alt="opensea"
                                                         style={{width: '45px'}}/></a></td>
          </tr>
        )
      })}


      </tbody>
    </table>

  );
}

export default MainTable;