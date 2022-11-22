import {MultiSelectDropdown, TableHeaderSortable} from "./TableHelpers";
import columns from "./helpers";

function getTrait(duck, traitType) {
  for (const attribute of duck['attributes']) {
    if (attribute['trait_type'] === traitType) {
      return attribute['value'];
    }
  }
}

function getTraitLabel(duck, traitType) {
  const trait = getTrait(duck, traitType);
  if (trait === undefined) {
    return 'None';
  }
  return trait;
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

function TraitsTable({databases, amountToLoad, handleSort, sorts, filters, setFilters}) {
  let traitToID = {};
  for (const [traitType, traits] of Object.entries(databases['traits'])) {
    traitToID[traitType] = {};
    for (const trait of traits) {
      traitToID[traitType][trait['name']] = (trait['id'].length < 2 ? '0' + trait['id'] : trait['id']);
    }
  }


  return (
    <table>
      <thead>
      <tr>
        <TableHeaderSortable name="rank" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="id" handleSort={handleSort} sorts={sorts}/>
        <MultiSelectDropdown name="background" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="body" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="tattoo" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="head" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="shirt" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="neck" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="beak" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="eyes" databases={databases} filters={filters} setFilters={setFilters}/>
        <MultiSelectDropdown name="cover" databases={databases} filters={filters} setFilters={setFilters}/>
        <th>Opensea</th>
      </tr>
      </thead>
      <tbody>
      {databases['allDucks'].slice(0, amountToLoad).map((duck, index) => {
        return (
          <tr key={index}>
            <td>{columns['rank'].value(duck)}</td>
            <td>
              <a href={`https://duck.art/${duck.duck}`} target="_blank" rel="noreferrer">
                <img src={duck.history[0].image} alt="duck" className='duckImage'/>
              </a>
              <p className="duckLabel">{columns['id'].value(duck)}</p>
            </td>
            <td><img src={getImageURL('background', traitToID['Background'][getTrait(duck, 'Background')])}
                     alt={traitToID['Background'][getTrait(duck)]} className='duckImage'/><p
              className="duckLabel">{getTraitLabel(duck, 'Background')}</p></td>
            <td><img src={getImageURL('body', traitToID['Body'][getTrait(duck, 'Body')])}
                     alt={traitToID['Body'][getTrait(duck)]} className='duckImage'/><p
              className="duckLabel">{getTraitLabel(duck, 'Body')}</p></td>
            <td><img src={getImageURL('tattoo', traitToID['Tattoo'][getTrait(duck, 'Tattoo')])}
                     alt={traitToID['Tattoo'][getTrait(duck)]} className='duckImage'/><p
              className="duckLabel">{getTraitLabel(duck, 'Tattoo')}</p></td>
            <td><img src={getImageURL('head', traitToID['Head'][getTrait(duck, 'Head')])}
                     alt={traitToID['Head'][getTrait(duck)]} className='duckImage'/><p
              className="duckLabel">{getTraitLabel(duck, 'Head')}</p></td>
            <td><img src={getImageURL('shirt', traitToID['Shirt'][getTrait(duck, 'Shirt')])}
                     alt={traitToID['Shirt'][getTrait(duck)]} className='duckImage'/><p
              className="duckLabel">{getTraitLabel(duck, 'Shirt')}</p></td>
            <td><img src={getImageURL('neck', traitToID['Neck'][getTrait(duck, 'Neck')])}
                     alt={traitToID['Neck'][getTrait(duck)]} className='duckImage'/><p
              className="duckLabel">{getTraitLabel(duck, 'Neck')}</p></td>
            <td><img src={getImageURL('beak', traitToID['Beak'][getTrait(duck, 'Beak')])}
                     alt={traitToID['Beak'][getTrait(duck)]} className='duckImage'/><p
              className="duckLabel">{getTraitLabel(duck, 'Beak')}</p></td>
            <td><img src={getImageURL('eyes', traitToID['Eyes'][getTrait(duck, 'Eyes')])}
                     alt={traitToID['Eyes'][getTrait(duck)]} className='duckImage'/><p
              className="duckLabel">{getTraitLabel(duck, 'Eyes')}</p></td>
            <td><img src={getImageURL('cover', traitToID['Cover'][getTrait(duck, 'Cover')])}
                     alt={traitToID['Cover'][getTrait(duck)]} className='duckImage'/><p
              className="duckLabel">{getTraitLabel(duck, 'Cover')}</p></td>
            <td><a href={`https://opensea.io/assets/0x7a4d1b54dd21dde804c18b7a830b5bc6e586a7f6/${duck.duck}`}
                   target="_blank" rel="noreferrer"><img src={"/img/opensea.svg"} alt="opensea"
                                                         style={{width: '45px'}}/></a></td>
          </tr>
        )
      })}
      </tbody>
    </table>

  );
}

export default TraitsTable;