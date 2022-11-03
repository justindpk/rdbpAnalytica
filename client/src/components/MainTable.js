import {useState} from "react";

function MainTable({databases, setDatabases, amountToLoad}) {
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
  }
  const sortIcon = <img src="/img/upDown.svg" alt="sort" className='duckIcon'/>

  return (
    <table>
      <thead>
      <tr>
        <th onClick={() => handleSort('rank', (a, b) => a.history[0].rank - b.history[0].rank)}>
          Rank {sortIcon}</th>
        <th><img src="/img/duckIcon.svg" alt="duck" className='duckIcon'/></th>
        <th onClick={() => handleSort('id', (a, b) => a.duck - b.duck)}>ID {sortIcon}</th>
        <th onClick={() => handleSort('version', (a, b) => a.history[0].version - b.history[0].version)}>
          Version {sortIcon}</th>
        <th onClick={() => handleSort('parties', (a, b) => a.attributes[0].value - b.attributes[0].value)}>
          Parties {sortIcon}</th>
        <th onClick={() => handleSort('rankChange', (a, b) =>
          (a.history.length > 1 ? a.history[1].rank - a.history[0].rank : 0) -
          (b.history.length > 1 ? b.history[1].rank - b.history[0].rank : 0))}>Rank Change {sortIcon}
        </th>
        <th>Opensea</th>
      </tr>
      </thead>
      <tbody>
      {databases['allDucks'].slice(0, amountToLoad).map((duck, index) => {
        return (
          <tr key={index}>
            <td>{duck.history[0].rank}</td>
            <td><a href={`https://duck.art/${duck.duck}`} target="_blank" rel="noreferrer">
              <img src={duck.history[0].image} alt="duck" className='duckImage'/></a>
            </td>
            <td>{duck.duck}</td>
            <td>{duck.history[0].version}</td>
            <td>{duck.attributes[0].value} / {duck.attributes[0].max_value}</td>
            <td>{duck.history.length > 1 ? duck.history[1].rank - duck.history[0].rank : 0}</td>
            <td><a href={`https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/${duck.duck}`}
                   target="_blank" rel="noreferrer"><img src={"/img/opensea.svg"} alt="opensea"/></a></td>
          </tr>
        )
      })}


      </tbody>
    </table>

  );
}

export default MainTable;