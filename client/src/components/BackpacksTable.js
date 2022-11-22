import {useEffect} from "react";
import {MultiSelectDropdown, TableHeaderSortable} from "./TableHelpers";
import columns from "./helpers";


//e.g duck = 3078, itemType = Bag of Sand
// return = Beige
function getItem(duck, itemType) {
  console.log(duck);
  return duck.backpacks[itemType][0].toLowerCase();
}

//e.g duck = 3078, itemType = Paint Bucket
// return = Peach
function getItemLabel(duck, itemType) {
  const item = getItem(duck, itemType);
  if (item === undefined) {
    return 'None';
  }
  return item;
}

//e.g itemType = Bag of Sand, itemName = Beige
function getImageURL(itemType, itemName) {
  let extension = 'png';
  if(itemType === "bagOfSand")
    {
      itemType = 'bag-of-sand';
    }
  else if(itemType === "paintBucket")
    {
      itemType = 'paint-bucket';
    }
  else if(itemType === "Water")
    {
      itemType = 'water';
    }
  
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
        <TableHeaderSortable name="rank" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="id" handleSort={handleSort} sorts={sorts}/>
        
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
            <td>{columns['rank'].value(duck)}</td>
            <td>
                <a href={`https://duck.art/${duck.duck}`} target="_blank" rel="noreferrer">
                  <img src={duck.history[0].image} alt="duck" className='duckImage'/>
                </a>
                <p className="duckLabel">{columns['id'].value(duck)}</p>
            </td>
           
            <td>
              <img src={getImageURL('paintBucket', getItem(duck, 'Paint Bucket'))}
              alt={'paint bucket'} className='duckImage'/>
              <p className="duckLabel">{getItemLabel(duck, 'Paint Bucket')}</p>
            </td>
            <td>
              <img src={getImageURL('water', getItem(duck, 'Water'))}
              alt={'water'} className='duckImage'/>
              <p className="duckLabel">{getItemLabel(duck, 'Water')}</p>
            </td>
            <td>
              <img src={getImageURL('bagOfSand', getItem(duck, 'Bag of Sand'))}
              alt={'bag of sand'} className='duckImage'/>
            <p className="duckLabel">{getItemLabel(duck, 'Bag of Sand')}</p>
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