import { api } from './client';

export async function createCheckin(user_id, event_id) {
    const res = await api.post("/checkins", { user_id, event_id});
    return res.data;
}