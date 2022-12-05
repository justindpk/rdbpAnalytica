import columns from "./helpers";
import {TableHeaderSortable} from "./TableHelpers";

export default function TimelineTable({databases, amountToLoad, sorts, handleSort}) {
  return (
    <table>
      <thead>
      <tr>
        <TableHeaderSortable name="rank" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="id" handleSort={handleSort} sorts={sorts}/>
        <th>Mint</th>
        <th>Carnival</th>
        <th>High Tea</th>
        <th>Zen</th>
        <th>Space</th>
        <th>Jungle</th>
        <th>Summer</th>
        <th>Circus</th>
        <th>Halloween</th>
        <th>Winter</th>
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
                          <a href={`https://duck.art/${duck.duck}`} className="noUnderline" target="_blank" rel="noreferrer">
                            <img src={version.image} alt="duck" className='duckImage'/>
                            <p className="duckLabel">{'Attended'}</p>
                          </a>
                        </>
                      : <>
                          <a href={`https://duck.art/${duck.duck}`} className="noUnderline" target="_blank" rel="noreferrer">
                            <img src={version.image} alt="duck" className='duckImage'/>
                            <p className="duckLabel">{'Missed'}</p>
                          </a>
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
