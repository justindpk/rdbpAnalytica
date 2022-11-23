import columns from "./helpers";
import {TableHeaderSortable} from "./TableHelpers";

export default function TimelineTable({databases, amountToLoad, sorts, handleSort}) {
  console.log(databases);
  return (
    <table>
      <thead>
      <tr>
        <TableHeaderSortable name="rank" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="id" handleSort={handleSort} sorts={sorts}/>
        <th>V1</th>
        <th>V2</th>
        <th>V3</th>
        <th>V4</th>
        <th>V5</th>
        <th>V6</th>
        <th>V7</th>
        <th>V8</th>
        <th>V9</th>
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
            {duck.paddedHistory.map((version, index) => {
                return (
                  <td key={index} className={version.empty ? "empty" : null}>
                    {!version.empty
                      ? <>
                        <img src={version.image} alt="duck" className='duckImage'/>
                        <p className="duckLabel">{'Attended'}</p>
                      </>
                      : <>
                        <img src={version.image} alt="duck" className='duckImage'/>
                        <p className="duckLabel">{'Missed'}</p>
                        {/*<img src='/img/duckIcon.svg' className='duckIcon' alt='duck icon' style={{height: '50px', width: '100px'}}/>*/}
                      </>
                    }
                  </td>
                )
              }
            )}
          </tr>
        )
      })}
      </tbody>
    </table>
  );
}
