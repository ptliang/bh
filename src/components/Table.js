import '../styles/Table.css';

export default function Table(props) {
  const { loading, data, error } = props;
  const loadingMsgs = [
    'Loading film data...',
    'Loading character data...',
    'Loading world data...',
  ];
  const createTableRows = () => {
    return data.characters.map((character) => {
      const homeworld = data.homeworld[character.homeworld];
      return (
        <tr key={character.url}>
          <td>{character.name}</td>
          <td>{character.birth_year}</td>
          <td>{homeworld.name}</td>
          <td>{homeworld.population}</td>
        </tr>
      );
    });
  };
  return (
    <div className="film-details">
      {loading < 3 && <div>{loadingMsgs[loading]}</div>}
      {loading === 3 && (
        <table className="film-details-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Birth Year</th>
              <th>Homeworld</th>
              <th>Homeworld Population</th>
            </tr>
          </thead>
          <tbody>{createTableRows()}</tbody>
          <tfoot>
            <tr>
              <td colSpan="4">
                Total Population:{' '}
                {parseInt(data.totalPopulation).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
