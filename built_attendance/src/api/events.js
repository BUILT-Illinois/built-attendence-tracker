import { api } from "./client";

export async function listEvents() {
  const res = await api.get("/events");
  return res.data;
}

export async function createEvent(payload) {
  const res = await api.post("/events", payload);
  return res.data;
}

export async function updateEvent(eventId, patch) {
  const res = await api.patch(`/events/${eventId}`, patch);
  return res.data;
}

export async function deleteEvent(eventId) {
  const res = await api.delete(`/events/${eventId}`);
  return res.data;
}
