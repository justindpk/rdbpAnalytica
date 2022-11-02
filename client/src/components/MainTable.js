import {useEffect} from "react";

function MainTable({databases}) {
  //TODO: Create table load
  // console.log(databases['allDucks']);
  useEffect(() => {
    console.log("Table loaded");
  }, []);

  return (
    <table className="duckTable">
      <thead>
      <tr>
        <th>Rank</th>
        <th><img src="/img/duckIcon.svg" alt="duck"/></th>
        <th>ID</th>
        <th>Version</th>
        <th>Parties</th>
        <th>Rank Change</th>
        <th>Opensea</th>
      </tr>
      </thead>
      <tbody>
      </tbody>
    </table>

  );
}

export default MainTable;