import { useState } from 'react';
import useFetchData from './hooks/useFetchData';
import Table from './components/Table';
import './styles/App.css';

function App() {
  const [showTable, setShowTable] = useState(false);

  const filmData = useFetchData('https://swapi.dev/api/films/4/');

  const handleClick = () => {
    setShowTable((prevState) => !prevState);
  };

  return (
    <div className="App">
      <h1 className="film-title">The Phantom Menace</h1>
      <button className="film-details-button" onClick={handleClick}>
        Details
      </button>
      {showTable && !filmData.error && <Table {...filmData} />}
      {showTable && filmData.error && <div>{filmData.data}</div>}
    </div>
  );
}

export default App;
