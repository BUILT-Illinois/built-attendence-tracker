import '../assets/UpcomingEvents.css'
import { useEffect, useState } from "react";
import { listEvents } from "../api/events";

// Contains event info


// const events = [
//   { title: "October GBM", date: "10/7", points: "1 pt" },
//   { title: "October GBM", date: "10/7", points: "1 pt" },
//   { title: "October GBM", date: "10/7", points: "1 pt" },
//   { title: "October GBM", date: "10/7", points: "1 pt" },
//   { title: "October GBM", date: "10/7", points: "1 pt" },
//   { title: "October GBM", date: "10/7", points: "1 pt" },
// ];



//Upcoming Events Component

function UpcomingEvents({eventName}) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await listEvents();
        setEvents(data);
      } catch (e) {
        setError(e?.response?.data?.error || e.message);
      }
    })();
  }, []);

  return (
    <section className="events">
      <div className="events__wrapper">
        <h1 className="events__title" id="events-title">
          {eventName}
        </h1>
  
        <div
          className="events__card"
          role="region"
          aria-labelledby="events-title"
        >
          {events.map((e, i) => (
            <div className="events__row" key={`${e.name}-${i}`}>
              <span className="events__cell events__cell--title">
                {e.name}
              </span>
  
              <span className="events__cell">
                {(() => {
                  const d = new Date(e.date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                })()}
              </span>
  
              <span className="events__cell events__cell--pts">
                {e.points} pt
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  
}

export default UpcomingEvents;