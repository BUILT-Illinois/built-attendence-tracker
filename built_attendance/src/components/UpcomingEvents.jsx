import '../assets/UpcomingEvents.css'
// Contains event info
const events = [
  { title: "October GBM", date: "10/7", points: "1 pt" },
  { title: "October GBM", date: "10/7", points: "1 pt" },
  { title: "October GBM", date: "10/7", points: "1 pt" },
  { title: "October GBM", date: "10/7", points: "1 pt" },
  { title: "October GBM", date: "10/7", points: "1 pt" },
  { title: "October GBM", date: "10/7", points: "1 pt" },
];
//Upcoming Events Component

function UpcomingEvents({eventName}) {
  return (
    <section className="events">
      <h1 className="events__title" id="events-title">
        {eventName}
      </h1>

      <div className="events__card" role="region" aria-labelledby="events-title">
        {events.map((e, i) => (
          <div className="events__row" key={`${e.title}-${i}`}>
            <span className="events__cell events__cell--title">{e.title}</span>
            <span className="events__cell">{e.date}</span>
            <span className="events__cell events__cell--pts">{e.points}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UpcomingEvents;