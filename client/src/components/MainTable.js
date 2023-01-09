import {TableHeaderSortable} from "./TableHelpers";
import columns from "./helpers";

function loadLand(ducks) {
  let src;
  const duck = ducks[0];
  if (duck) {
    const ground = duck.cubes.Ground[0];
    if (ground === 'Beige Sand') {
      src = '/img/beige.png';
    } else if (ground === 'White Sand') {
      src = '/img/white.png';
    } else if (ground === 'Yellow Sand') {
      src = '/img/yellow.png';
    }
  }

  if (!src) {
    src = '/img/dirt.png';
  }

  return src;
}

function loadTub(ducks) {
  let src;
  const duck = ducks[0];
  if (duck) {
    const count = duck.numOwned;
    if (count <= 1 ) {
      src = '/img/tubCutout0.png';
    } else if (count >= 2 && count <= 10) {
      src = '/img/tubCutout1.png';
    } else if (count >= 11 && count <= 20) {
      src = '/img/tubCutout2.png';
    } else if (count >= 21 && count <= 99) {
      src = '/img/tubCutout3.png';
    } else if (count >= 100) {
      src = '/img/tubCutout4.png';
    }
  }

  if (!src) {
    src = '/img/dirt.png';
  }

  return src;
}

function MainTable({databases, amountToLoad, handleSort, sorts}) {
  return (
      <table>
        <thead>
        <tr>
          <TableHeaderSortable name="id" handleSort={handleSort} sorts={sorts}/>
          <TableHeaderSortable name="rank" handleSort={handleSort} sorts={sorts}/>
          <TableHeaderSortable name="version" handleSort={handleSort} sorts={sorts}/>
          <TableHeaderSortable name="parties" handleSort={handleSort} sorts={sorts}/>
          <TableHeaderSortable name="totalTraits" handleSort={handleSort} sorts={sorts}/>
          <th>Tub Size</th>
          <th>Owner's Tub</th>
          <th>Owner's Land</th>
          <th>Opensea</th>
        </tr>
        </thead>
        <tbody>
        {databases['allDucks'].slice(0, amountToLoad).map((duck, index) => {
          const owner = duck['owner'];
          const srcLand = loadLand(databases['allDucks'].filter((duck) => duck.owner === owner));
          const srcTub = loadTub(databases['allDucks'].filter((duck) => duck.owner === owner));
          return (
            <tr key={index}>
            <td>
                <a href={`https://duck.art/${duck.duck}`} target="_blank" rel="noreferrer">
                  <img src={duck.image} alt="duck" className='duckImage'/>
                </a>
                <p className="duckLabel">{columns['id'].value(duck)}</p>
              </td>
              <td>{columns['rank'].value(duck)}</td>
              <td>{columns['version'].value(duck)}</td>
              <td>{columns['parties'].value(duck)}</td>
              <td>{columns['totalTraits'].value(duck)} / 9</td>
              <td>{columns['totalDucks'].value(duck)}</td>    
              <td><a href = {`https://duck.art/tub#${duck['owner']}`} target="_blank" rel="noreferrer"> <img src={srcTub} alt="opensea"
                                                           style={{width: '140px'}}/> </a> </td>
              <td><a href = {`https://duck.art/land/${duck['owner']}`} target="_blank" rel="noreferrer"> <img src={srcLand} alt="opensea"
                                                           style={{width: '75px'}}/> </a> </td>     
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

export default MainTable;