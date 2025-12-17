import './App.css';
import Header from './components/Header';
import Welcome from './components/Welcome';
import UpcomingEvents from './components/UpcomingEvents';

function App() {
  return (
    <div>
      <div className='column'>
        <Welcome/>
        <UpcomingEvents eventName="Upcoming Events"/>
      </div>
    </div>
  );
}

export default App;
