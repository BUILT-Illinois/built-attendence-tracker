import '../assets/Welcome.css';

function Welcome () {
    return (
        <div className="welcome-container">
          <div className="welcome">
            <h1>Welcome Name</h1>
          </div>
          <div className="card">
            <img src="https://built-illinois.org/built-logo.png" alt="Logo" />
          </div>
          <div className="mini_card_1">
            <h3>Ranking</h3>
            <p className="stat">#2</p>
          </div>
          <div className="mini_card_2">
            <h3>Points</h3>
            <p className="stat">30</p>
          </div>
        </div>
      );
    }
    

export default Welcome;