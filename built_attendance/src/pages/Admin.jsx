import EditEvents from '../components/EditEvents';
import { useNavigate } from "react-router";
import '../assets/CheckIn.css';
import '../assets/Admin.css';

export default function Admin() {
    let navigate = useNavigate();
    return(
        <div className='admin-columns'>
            <EditEvents eventName="Edit Event"></EditEvents>
            <button className='checkin-button' onClick={() => navigate('/create')}>Make Event</button>
        </div>
    );
}