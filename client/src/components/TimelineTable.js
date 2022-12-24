import { version } from "react";
import columns from "./helpers";
import {TableHeaderSortable} from "./TableHelpers";

export default function TimelineTable({databases, amountToLoad, sorts, handleSort}) {
  const partyNames = ['Mint', 'Carnival', 'High Tea', 'Zen', 'Space', 'Jungle', 'Summer', 'Circus', 'Halloween', 'Winter']

  return (
    
    <table>
      <thead>
      <tr>
        <TableHeaderSortable name="rank" handleSort={handleSort} sorts={sorts}/>
        <TableHeaderSortable name="id" handleSort={handleSort} sorts={sorts}/>
       {partyNames.map((partyName, index) => (
          <th key={index}>{partyName}</th>
        ))}
      </tr>
      </thead>
      <tbody>

      {databases['allDucks'].slice(0, amountToLoad).map((duck, index) => {
      console.log(duck.name)  
      console.log(duck.parties)
      let currentImage = duck.paddedHistory[0].image;
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
              <a href={`https://duck.art/${duck.duck}`} target="_blank" rel="noreferrer">
                <img src={duck.paddedHistory[0].image} alt="duck" className='duckImage'/>
              </a> <p className="duckLabel"> Minted </p>
            </td>
                              
          {duck.parties.map((party, index) => {
          let version;
            if (party.value === "Attended") {
              version = duck.paddedHistory[index + 1];
              currentImage = version.image;
            } else {
              version = duck.paddedHistory[index ];
              currentImage = version.image;
            }

            return (
              <td key={index} className={party.value === "Missed" ? "empty" : null}>
                <a href={`https://duck.art/${duck.duck}`} className="noUnderline" target="_blank" rel="noreferrer">
                  <img src={currentImage} alt="duck" className='duckImage'/>
                  <p className="duckLabel">{party.value}</p>
                </a>
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
