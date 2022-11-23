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

function getTraitLink(traitType, traitName) {
  let link = '';
  if (traitName) {
    link = `https://duck.art/trait/${traitType}/${traitName.toLowerCase()}`;
  } else {
    link = `https://duck.art/traits/#${traitType}`;
  }
  return link;
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
        let traitLabels = {};
        let traits = {};
        for (const traitType of ['Background', 'Body', 'Tattoo', 'Head', 'Shirt', 'Neck', 'Beak', 'Eyes', 'Cover']) {
          traitLabels[traitType] = getTraitLabel(duck, traitType);
          traits[traitType] = getTrait(duck, traitType);
        }
        return (
          <tr key={index}>
            <td>{columns['rank'].value(duck)}</td>
            <td>
              <a href={`https://duck.art/${duck.duck}`} target="_blank" rel="noreferrer">
                <img src={duck.history[0].image} alt="duck" className='duckImage'/>
              </a>
              <p className="duckLabel">{columns['id'].value(duck)}</p>
            </td>
            <td>
              <a href={getTraitLink('background', traits['Background'])} target="_blank" rel="noreferrer">
                <img src={getImageURL('background', traitToID['Background'][traits['Background']])} alt="background"
                     className='duckImage'/>
              </a>
              <p className="duckLabel">{traitLabels['Background']}</p></td>

            <td>
              <a href={getTraitLink('body', traits['Body'])} target="_blank" rel="noreferrer">
                <img src={getImageURL('body', traitToID['Body'][traits['Body']])} alt="body" className='duckImage'/>
              </a>
              <p className="duckLabel">{traitLabels['Body']}</p></td>

            <td>
              <a href={getTraitLink('tattoo', traits['Tattoo'])} target="_blank" rel="noreferrer">
                <img src={getImageURL('tattoo', traitToID['Tattoo'][traits['Tattoo']])} alt="tattoo"
                     className='duckImage'/>
              </a>
              <p className="duckLabel">{traitLabels['Tattoo']}</p></td>

                          <td>
              <a href={getTraitLink('head', traits['Head'])} target="_blank" rel="noreferrer">
                <img src={getImageURL('head', traitToID['Head'][traits['Head']])} alt="head" className='duckImage'/>
              </a>
              <p className="duckLabel">{traitLabels['Head']}</p></td>

            <td>
              <a href={getTraitLink('shirt', traits['Shirt'])} target="_blank" rel="noreferrer">
                <img src={getImageURL('shirt', traitToID['Shirt'][traits['Shirt']])} alt="shirt" className='duckImage'/>
              </a>
              <p className="duckLabel">{traitLabels['Shirt']}</p></td>

            <td>
              <a href={getTraitLink('neck', traits['Neck'])} target="_blank" rel="noreferrer">
                <img src={getImageURL('neck', traitToID['Neck'][traits['Neck']])} alt="neck" className='duckImage'/>
              </a>
              <p className="duckLabel">{traitLabels['Neck']}</p></td>

            <td>
              <a href={getTraitLink('beak', traits['Beak'])} target="_blank" rel="noreferrer">
                <img src={getImageURL('beak', traitToID['Beak'][traits['Beak']])} alt="beak" className='duckImage'/>
              </a>
              <p className="duckLabel">{traitLabels['Beak']}</p></td>

            <td>
              <a href={getTraitLink('eyes', traits['Eyes'])} target="_blank" rel="noreferrer">
                <img src={getImageURL('eyes', traitToID['Eyes'][traits['Eyes']])} alt="eyes" className='duckImage'/>
              </a>
              <p className="duckLabel">{traitLabels['Eyes']}</p></td>

            <td>
              <a href={getTraitLink('cover', traits['Cover'])} target="_blank" rel="noreferrer">
                <img src={getImageURL('cover', traitToID['Cover'][traits['Cover']])} alt="cover" className='duckImage'/>
              </a>
              <p className="duckLabel">{traitLabels['Cover']}</p></td>

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