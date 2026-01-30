import "../assets/CreateEvent.css";
import { useState } from "react";
import { createEvent } from "../api/events";

export default function CreateEvent() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [points, setPoints] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(""); // optional

  // YYYY-MM-DD -> ISO (local noon avoids timezone shifting)
  const ymdToLocalISOString = (ymd) => {
    if (!ymd) return null;
    const [y, m, d] = ymd.split("-").map(Number);
    const localNoon = new Date(y, m - 1, d, 12, 0, 0);
    return localNoon.toISOString();
  };

  const onCreate = async () => {
    try {
      setError("");
      setSuccess("");

      if (!name.trim()) return setError("Please enter a title.");
      if (!date) return setError("Please choose a date.");
      const pts = Number(points);
      if (!Number.isFinite(pts)) return setError("Points must be a number.");

      setSaving(true);

      const payload = {
        name: name.trim(),
        date: ymdToLocalISOString(date),
        points: pts,
      };

      // BACKEND NOW RETURNS THE CREATED EVENT OBJECT
      const created = await createEvent(payload);

      // clear inputs
      setName("");
      setDate("");
      setPoints("");

      // optional success feedback
      if (created?._id) {
        setSuccess(`Created! Event ID: ${created._id}`);
      } else {
        setSuccess("Created!");
      }

      // If you want to navigate after creating:
      // window.location = "/events";
      // or if you're using react-router's useNavigate:
      // navigate("/events");

    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create_event">
      <h1 className="create_event_title">Create Event</h1>

      <div className="create_event_box">
        <div className="create_event_row">
          <h2 className="create_event_label">Title of Event:</h2>
          <input
            className="create_event_input"
            placeholder="(Start Typing)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="create_event_row">
          <h2 className="create_event_label">Date:</h2>
          <input
            className="create_event_input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="create_event_row">
          <h2 className="create_event_label">Points:</h2>
          <input
            className="create_event_input"
            placeholder="(Start Typing)"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            inputMode="numeric"
          />
        </div>

        {error && <div className="create_event_error">{error}</div>}
        {success && <div className="create_event_success">{success}</div>}
      </div>

      <button
        className="create_event_button"
        onClick={onCreate}
        disabled={saving}
      >
        {saving ? "Creating..." : "Create"}
      </button>
    </div>
  );
}
