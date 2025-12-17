import '../assets/Header.css';
import { Link } from 'react-router';
import {useLocation} from 'react-router';

function Header () {
    const location = useLocation();

    if (location.pathname === '/') {
        return null;
    }
    
    
    return(
        <div className='header'>
            <div className='container'>
                <Link className='' to="/home">
                    <img className='built-img' src='https://built-illinois.org/built-logo.png'/>
                </Link>
                <Link to="/leaderboard">
                    <h2 className='header-button'>Leaderboard</h2>
                </Link>
                <Link to="/events">
                    <h2 className='header-button'>Events</h2>
                </Link>
                <Link to='/checkin'>
                    <h2 className='header-button'>Check-In</h2>
                </Link>
                
                <div>
                    {/* <img/> */}
                    <h2>Name</h2>
                    <h2>Logout</h2>
                </div>
            </div>
        </div>
    );
}
export default Header;