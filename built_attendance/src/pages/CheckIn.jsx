import '../assets/CheckIn.css'

export default function CheckIn() {
    return (
        <div className='checkin'>
            <h1>Date - Title of Event</h1>
            <div className='checkin-box'>
                <h1>Name:</h1>
                <input className='text-box' placeholder='(Start Typing)'/>
            </div>
            <button>Submit</button>
        </div>
    );
}
