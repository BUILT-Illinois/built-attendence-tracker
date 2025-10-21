import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div>
      <div className="welcome">
        <h1>Welcome Name</h1>
      </div>
      <div className="card">
        <img src='https://built-illinois.org/built-logo.png'/>
      </div>
      <div className="mini_card_1">
        <h3>Ranking</h3>
        <p1>#2</p1>
      </div>
      <div className="mini_card_2">
        <h3>Points</h3>
        <p1>30</p1>
      </div>
      {/* <img src=''></> */}
    </div>
  );
}

export default App;
