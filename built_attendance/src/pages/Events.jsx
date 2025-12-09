import UpcomingEvents from "../components/UpcomingEvents";

function Events () {
    return(
    <div className="events-columns">
      <UpcomingEvents
        eventName="Upcoming Events"
      />
      <UpcomingEvents
        eventName="Past Events"
      />
    </div>
    );
}

export default Events;