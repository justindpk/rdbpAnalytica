import {useEffect} from "react";
import {MultiSelectDropdown, TableHeaderSortable} from "./TableHelpers";
import columns from "./helpers";

//e.g duck = 3078, itemType = Sand
// return = Beige
function getItem(duck, itemType) {
  return duck.backpacks[itemType][0].toLowerCase();
}

//e.g duck = 3078, itemType = Paint
// return = Peach
function getItemLabel(duck, itemType) {
  const item = getItem(duck, itemType);
  if (item === undefined) {
    return 'None';
  }
  return item.charAt(0).toUpperCase() + item.slice(1);
}

//e.g itemType = Sand, itemName = Beige
function getImageURL(itemType, itemName) {
  let extension = 'png';
  return `https://duck.art/img/mysterious-items/item-${itemType}-${itemName}.${extension}`;
}



function BackpacksTable({databases, amountToLoad, handleSort, sorts, filters, setFilters}) {
  useEffect(() => {
    console.log("Table loaded");
  }, []);

  return (
    <table>
      <thead>
      <tr>
        <TableHeaderSortable name="cube" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="cubeRank" handleSort={handleSort} sorts={sorts}/>
        <MultiSelectDropdown name="paintBucket" databases={databases} filters={filters} setFilters={setFilters} attrType='backpack'/>
        <MultiSelectDropdown name="water" databases={databases} filters={filters} setFilters={setFilters} attrType='backpack'/>
        <MultiSelectDropdown name="bagOfSand" databases={databases} filters={filters} setFilters={setFilters} attrType='backpack'/>
        <TableHeaderSortable name="egg" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="seed" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="chest" handleSort={handleSort} sorts={sorts}/>
        <th>Opensea</th>
      </tr>
      </thead>
      <tbody>
      {databases['allDucks'].slice(0, amountToLoad).map((duck, index) => {
        return (
          <tr key={index}>
             <td>
                <a href={`https://duck.art/${duck.duck}`} target="_blank" rel="noreferrer">
                  <img src={duck.cubeImage} alt="duck" className='cubeImage'/>
                </a>
                <p className="duckLabel">{columns['id'].value(duck)}</p>
            </td>
           
            <td>{columns['cubeRank'].value(duck)}</td>
          
            <td>
              <img src={getImageURL('paint', getItem(duck, 'Paint'))}
              alt={'paint bucket'} className='duckImage'/>
              <p className="duckLabel">{getItemLabel(duck, 'Paint')}</p>
            </td>
            <td>
              <img src={getImageURL('water', getItem(duck, 'Water'))}
              alt={'water'} className='duckImage'/>
              <p className="duckLabel">{getItemLabel(duck, 'Water')}</p>
            </td>
            <td>
              <img src={getImageURL('sand', getItem(duck, 'Sand'))}
              alt={'bag of sand'} className='duckImage'/>
            <p className="duckLabel">{getItemLabel(duck, 'Sand')}</p>
            </td>
            <td>{columns['egg'].value(duck)}</td>
            <td>{columns['seed'].value(duck)}</td>
            <td>{columns['chest'].value(duck)}</td> 
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

export default BackpacksTable;