import {useEffect} from "react";
import columns from "./ColumnClasses";
import {TableHeaderSortable} from "./TableHelpers";

function BackpacksTable({databases, amountToLoad, handleSort, sorts}) {
  //TODO: Create table load
  useEffect(() => {
    console.log("Table loaded");
  }, []);

  return (
    <table>
      <thead>
      <tr>
        <TableHeaderSortable name="rank" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="id" handleSort={handleSort} sorts={sorts}/>
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