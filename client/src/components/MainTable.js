import columns from "./columnClasses";
import {TableHeaderSortable} from "./TableHelpers";

function MainTable({databases, amountToLoad, handleSort, sorts, filters}) {
  return (
    <table>
      <thead>
      <tr>
        <TableHeaderSortable name="rank" handleSort={handleSort} sorts={sorts}/>
        <th><img src="/img/duckIcon.svg" alt="duck" className='duckIcon'/></th>
        <TableHeaderSortable name="id" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="version" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="parties" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="rankChange" handleSort={handleSort} sorts={sorts}/>
        <th>Opensea</th>
      </tr>
      </thead>
      <tbody>
      {databases['allDucks'].slice(0, amountToLoad).map((duck, index) => {
        return (
          <tr key={index}>
            <td>{columns['rank'].value(duck)}</td>
            <td><a href={`https://duck.art/${duck.duck}`} target="_blank" rel="noreferrer">
              <img src={duck.history[0].image} alt="duck" className='duckImage'/></a>
            </td>
            <td>{columns['id'].value(duck)}</td>
            <td>{columns['version'].value(duck)}</td>
            <td>{columns['parties'].value(duck)}</td>
            <td>{columns['rankChange'].value(duck)}</td>
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