import { api } from "./client";

export async function loginSyncUser(profile) {
  // your backend route should be POST /users/login
  const res = await api.post("/users/login", profile || {});
  return res.data;
}

export async function listUsers() {
    const res = await api.get("/users");
    return res.data;
}