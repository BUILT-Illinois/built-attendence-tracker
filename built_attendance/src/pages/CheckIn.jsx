import { useState } from "react";
import "../assets/CheckIn.css";
import { createCheckin } from "../api/checkins";

export default function CheckIn() {
  const myUserId = localStorage.getItem("user_id");
  const [eventId, setEventId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setStatus("");

    const trimmed = eventId.trim();
    if (!myUserId) return setStatus("Not logged in. Please log in again.");
    if (!trimmed) return setStatus("Enter an event id.");

    setLoading(true);
    try {
      const res = await createCheckin(myUserId, trimmed);
      setStatus(`✅ Checked in! +${res.points} points`);
      setEventId("");
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        (e?.response?.status === 409 ? "Already checked in for this event." : e.message);
      setStatus(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkin">
      <h1>Check In</h1>

      <div className="checkin-box">
        <h1>Event ID:</h1>
        <input
          className="text-box"
          placeholder="Paste event id"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />
      </div>

      <button onClick={onSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>

      {status && <div style={{ marginTop: 10 }}>{status}</div>}
    </div>
  );
}
