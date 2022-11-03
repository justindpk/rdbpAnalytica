import {useEffect, useState} from "react";

function getTrait(duck, traitType) {
  for (const attribute of duck['attributes']) {
    if (attribute['trait_type'] === traitType) {
      return attribute['value'];
    }
  }
}

function getImageURL(traitType, traitName) {
  let extension = 'png';
  if (traitType === 'background' && traitName === '95') {
    extension = 'gif';
  } else if (traitType === 'body' && traitName === '99') {
    extension = 'gif';
  }
  if (traitName === undefined) {
    return `https://duck.art/img/traits/body/01.png`;
  }
  return `https://duck.art/img/traits/${traitType}/${traitName}.${extension}`;
}

function TraitsTable({databases, setDatabases, amountToLoad}) {
  const [sort, setSort] = useState({'rank': true, 'version': null, 'rarityChange': null, 'parties': null})
  const [originalDatabases, setOriginalDatabases] = useState();
  const [sortBy, setSortBy] = useState("rank");
  const [sortAscending, setSortAscending] = useState(true);
  const [traitToID, setTraitToID] = useState();

  useEffect(() => {
    let newTraitToID = {};
    for (const [traitType, traits] of Object.entries(databases['traits'])) {
      newTraitToID[traitType] = {};
      for (const trait of traits) {
        newTraitToID[traitType][trait['name']] = (trait['id'].length < 2 ? '0' + trait['id'] : trait['id']);
      }
    }
    setTraitToID(newTraitToID);
  }, [databases]);

  useEffect(() => {
    setOriginalDatabases(databases);
  }, [databases]);

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
        <th>Background</th>
        <th>Body</th>
        <th>Tattoo</th>
        <th>Head</th>
        <th>Shirt</th>
        <th>Neck</th>
        <th>Beak</th>
        <th>Eyes</th>
        <th>Cover</th>
      </tr>
      </thead>
      <tbody>
      {traitToID && databases['allDucks'].slice(0, amountToLoad).map((duck, index) => {
        return (
          <tr key={index}>
            <td className={handleSortClassName('rank')}>{duck.history[0].rank}</td>
            <td><a href={`https://duck.art/${duck.duck}`} target="_blank" rel="noreferrer">
              <img src={duck.history[0].image} alt="duck" className='duckImage'/></a>
            </td>
            <td className={handleSortClassName('id')}>{duck.duck}</td>
            <td><img src={getImageURL('background', traitToID['Background'][getTrait(duck, 'Background')])}
                     alt={traitToID['Background'][getTrait(duck)]} className='duckImage'/></td>
            <td><img src={getImageURL('body', traitToID['Body'][getTrait(duck, 'Body')])}
                     alt={traitToID['Body'][getTrait(duck)]} className='duckImage'/></td>
            <td><img src={getImageURL('tattoo', traitToID['Tattoo'][getTrait(duck, 'Tattoo')])}
                     alt={traitToID['Tattoo'][getTrait(duck)]} className='duckImage'/></td>
            <td><img src={getImageURL('head', traitToID['Head'][getTrait(duck, 'Head')])}
                     alt={traitToID['Head'][getTrait(duck)]} className='duckImage'/></td>
            <td><img src={getImageURL('shirt', traitToID['Shirt'][getTrait(duck, 'Shirt')])}
                     alt={traitToID['Shirt'][getTrait(duck)]} className='duckImage'/></td>
            <td><img src={getImageURL('neck', traitToID['Neck'][getTrait(duck, 'Neck')])}
                     alt={traitToID['Neck'][getTrait(duck)]} className='duckImage'/></td>
            <td><img src={getImageURL('beak', traitToID['Beak'][getTrait(duck, 'Beak')])}
                     alt={traitToID['Beak'][getTrait(duck)]} className='duckImage'/></td>
            <td><img src={getImageURL('eyes', traitToID['Eyes'][getTrait(duck, 'Eyes')])}
                     alt={traitToID['Eyes'][getTrait(duck)]} className='duckImage'/></td>
            <td><img src={getImageURL('cover', traitToID['Cover'][getTrait(duck, 'Cover')])}
                     alt={traitToID['Cover'][getTrait(duck)]} className='duckImage'/></td>
          </tr>
        )
      })}


      </tbody>
    </table>

  );
}

export default TraitsTable;
