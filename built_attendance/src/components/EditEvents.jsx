import "../assets/UpcomingEvents.css";
import { useEffect, useState } from "react";
import { listEvents, updateEvent, deleteEvent } from "../api/events";

function AdminUpcomingEvents({ eventName }) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  // editing state
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ name: "", date: "", points: "" });
  const [saving, setSaving] = useState(false);

  // ---- helpers to prevent NaN/NaN + NaN points right after save ----
  const toDate = (v) => {
    if (!v) return null;
    if (v instanceof Date) return v;

    if (typeof v === "string" || typeof v === "number") {
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    }

    // handles Mongo extended JSON like { $date: "..." } or { $date: 123 }
    if (typeof v === "object" && v.$date) {
      const d = new Date(v.$date);
      return isNaN(d.getTime()) ? null : d;
    }

    return null;
  };

  const fmtMD = (v) => {
    const d = toDate(v);
    if (!d) return "—";
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const toNumberOr = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const toInputYYYYMMDD = (v) => {
    const d = toDate(v);
    if (!d) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  // ------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      try {
        const data = await listEvents();
        setEvents(data || []);
      } catch (e) {
        setError(e?.response?.data?.error || e.message);
      }
    })();
  }, []);

  const startEdit = (e) => {
    setEditingId(e._id);

    setDraft({
      name: e.name || "",
      date: toInputYYYYMMDD(e.date),
      points: String(e.points ?? ""),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ name: "", date: "", points: "" });
    setError("");
  };

  const saveEdit = async (eventId) => {
    try {
      setSaving(true);
      setError("");

      // grab current event to use as fallback values
      const current = events.find((ev) => String(ev._id) === String(eventId));

      const patch = {
        name: draft.name,
        points: toNumberOr(draft.points, current?.points ?? 0),
        // keep existing date if draft.date empty
        date: draft.date
          ? new Date(draft.date).toISOString()
          : (toDate(current?.date)?.toISOString() || current?.date || null),
      };

      const updated = await updateEvent(eventId, patch);

      setEvents((prev) =>
        prev.map((ev) => {
            if (String(ev._id) !== String(eventId)) return ev;

            // keep existing fields, apply patch + whatever backend returned
            const merged = {
            ...ev,
            ...patch,
            ...updated,
            };

            return {
            ...merged,
            name: merged.name ?? ev.name ?? patch.name,
            points: toNumberOr(merged.points, toNumberOr(patch.points, ev.points || 0)),
            date: toDate(merged.date)?.toISOString() || patch.date || ev.date,
            };
        })
        );

      cancelEdit();
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  };

  const removeEvent = async (eventId) => {
    const ok = window.confirm("Delete this event?");
    if (!ok) return;

    try {
      setError("");
      await deleteEvent(eventId);
      setEvents((prev) =>
        prev.filter((ev) => String(ev._id) !== String(eventId))
      );
      if (String(editingId) === String(eventId)) cancelEdit();
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    }
  };

  return (
    <section className="events">
      <div className="events__wrapper">
        <h1 className="events__title" id="events-title">
          {eventName}
        </h1>

        <div className="events__card" role="region" aria-labelledby="events-title">
          {error && <div className="events__error">{error}</div>}

          {events.map((e, i) => {
            const isEditing = String(editingId) === String(e._id);

            return (
              <div className="events__row" key={`${e._id || e.name}-${i}`}>
                {/* name */}
                <span className="events__cell events__cell--title">
                  {isEditing ? (
                    <input
                      className="events__input"
                      value={draft.name}
                      onChange={(ev) =>
                        setDraft((d) => ({ ...d, name: ev.target.value }))
                      }
                      placeholder="Event name"
                    />
                  ) : (
                    e.name
                  )}
                </span>

                {/* date */}
                <span className="events__cell">
                  {isEditing ? (
                    <input
                      className="events__input"
                      type="date"
                      value={draft.date}
                      onChange={(ev) =>
                        setDraft((d) => ({ ...d, date: ev.target.value }))
                      }
                    />
                  ) : (
                    fmtMD(e.date)
                  )}
                </span>

                {/* points */}
                <span className="events__cell events__cell--pts">
                  {isEditing ? (
                    <input
                      className="events__input events__input--pts"
                      value={draft.points}
                      onChange={(ev) =>
                        setDraft((d) => ({ ...d, points: ev.target.value }))
                      }
                      inputMode="numeric"
                      placeholder="Pts"
                    />
                  ) : (
                    `${toNumberOr(e.points, 0)} pt`
                  )}
                </span>

                {/* 4th column: edit controls */}
                <span className="events__cell events__cell--edit">
                  {!isEditing ? (
                    <button
                      type="button"
                      className="events__iconBtn"
                      onClick={() => startEdit(e)}
                      aria-label={`Edit ${e.name}`}
                    >
                      ✎
                    </button>
                  ) : (
                    <div className="events__editActions">
                      <button
                        type="button"
                        className="events__actionBtn"
                        disabled={saving}
                        onClick={() => saveEdit(e._id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="events__actionBtn events__actionBtn--ghost"
                        disabled={saving}
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="events__actionBtn events__actionBtn--danger"
                        disabled={saving}
                        onClick={() => removeEvent(e._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AdminUpcomingEvents;
