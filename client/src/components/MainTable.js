function MainTable({databases, amountToLoad}) {
  return (
    <table>
      <thead>
      <tr>
        <th>Rank</th>
        <th><img src="/img/duckIcon.svg" alt="duck" className='duckIcon'/></th>
        <th>ID</th>
        <th>Version</th>
        <th>Parties</th>
        <th>Rank Change</th>
        <th>Opensea</th>
      </tr>
      </thead>
      <tbody>
      {databases['allDucks'].slice(0, amountToLoad).map((duck, index) => {
        return (
          <tr key={index}>
            <td>{duck.history[0].rank}</td>
            <td><img src={duck.history[0].image} alt="duck" className='duckImage'/></td>
            <td>{duck.duck}</td>
            <td>{duck.history[0].version}</td>
            <td>{duck.attributes[0].value} / {duck.attributes[0].max_value}</td>
            <td>{duck.history.length > 1 ? duck.history[1].rank - duck.history[0].rank : 0}</td>
            <td><a href={`https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/${duck.duck}`}
                   target="_blank" rel="noreferrer"><img src={"/img/opensea.svg"} alt="opensea"/></a></td>
          </tr>
        )
      })}


      </tbody>
    </table>

  );
}

export default MainTable;