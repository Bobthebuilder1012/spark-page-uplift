// Lightweight client-side auth gate for booking & enrollment flows.
// Real auth happens on /login or /signup; this just tracks a flag.

const AUTH_KEY = "itutor.authed";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

export function setAuthed(v: boolean) {
  try {
    if (v) localStorage.setItem(AUTH_KEY, "1");
    else localStorage.removeItem(AUTH_KEY);
  } catch {}
}
