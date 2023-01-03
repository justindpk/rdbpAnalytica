import {TableHeaderSortable} from "./TableHelpers";
import columns from "./helpers";

function MainTable({databases, amountToLoad, handleSort, sorts}) {
  return (
      <table>
        <thead>
        <tr>
          <TableHeaderSortable name="rank" handleSort={handleSort} sorts={sorts}/>
          <TableHeaderSortable name="id" handleSort={handleSort} sorts={sorts}/>
          <TableHeaderSortable name="version" handleSort={handleSort} sorts={sorts}/>
          <TableHeaderSortable name="parties" handleSort={handleSort} sorts={sorts}/>
          <TableHeaderSortable name="totalTraits" handleSort={handleSort} sorts={sorts}/>
          <th>Tub Size</th>
          <th>Owner's Tub</th>
          <th>Opensea</th>
        </tr>
        </thead>
        <tbody>
        {databases['allDucks'].slice(0, amountToLoad).map((duck, index) => {
          console.log(duck)
          return (
            <tr key={index}>
              <td>{columns['rank'].value(duck)}</td>
              <td>
                <a href={`https://duck.art/${duck.duck}`} target="_blank" rel="noreferrer">
                  <img src={duck.image} alt="duck" className='duckImage'/>
                </a>
                <p className="duckLabel">{columns['id'].value(duck)}</p>
              </td>
              <td>{columns['version'].value(duck)}</td>
              <td>{columns['parties'].value(duck)}</td>
              <td>{columns['totalTraits'].value(duck)} / 9</td>
               <td>{columns['totalDucks'].value(duck)}</td>    
              <td><a href = {`https://duck.art/tub#${duck['owner']}`} target="_blank" rel="noreferrer"> <img src={"/img/tubCutout.png"} alt="opensea"
                                                           style={{width: '140px'}}/> </a> </td>                                         
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