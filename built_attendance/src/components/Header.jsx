import '../assets/Header.css';
import { Link } from 'react-router';

function Header () {
    return(
        <div className='header'>
            <div className='container'>
                <Link className='' to="/">
                    <img className='built-img' src='https://built-illinois.org/built-logo.png'/>
                </Link>
                <Link to="/leaderboard">
                    <h2>Leaderboard</h2>
                </Link>
                <h2>Events</h2>
                <h2>Check-In</h2>

                <h2>Logout</h2>
            </div>
        </div>
    );
}
export default Header;