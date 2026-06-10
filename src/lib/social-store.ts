// Lightweight cross-app store for favourite tutors, enrolled classes, and pending class join requests.
// Persisted in localStorage so the student experience survives reloads without a backend.

import { useEffect, useState, useCallback } from "react";

const FAV_KEY = "itutor.favoriteTutors.v1";
const ENROLLED_KEY = "itutor.enrolledClasses.v1";
const REQUESTS_KEY = "itutor.pendingClassRequests.v1";

function readSet(key: string): Set<string> {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {}
  return new Set();
}
function writeSet(key: string, value: Set<string>) {
  try { localStorage.setItem(key, JSON.stringify([...value])); } catch {}
}

type Listener = () => void;
const listeners = new Set<Listener>();
function emit() { listeners.forEach((l) => l()); }

function useLocalSet(key: string) {
  const [set, setSet] = useState<Set<string>>(() => readSet(key));
  useEffect(() => {
    const l = () => setSet(readSet(key));
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, [key]);
  const toggle = useCallback((id: string) => {
    const next = new Set(readSet(key));
    if (next.has(id)) next.delete(id); else next.add(id);
    writeSet(key, next);
    emit();
  }, [key]);
  const add = useCallback((id: string) => {
    const next = new Set(readSet(key));
    next.add(id);
    writeSet(key, next);
    emit();
  }, [key]);
  const remove = useCallback((id: string) => {
    const next = new Set(readSet(key));
    next.delete(id);
    writeSet(key, next);
    emit();
  }, [key]);
  return { set, has: (id: string) => set.has(id), toggle, add, remove };
}

export function useFavoriteTutors() { return useLocalSet(FAV_KEY); }
export function useEnrolledClasses() { return useLocalSet(ENROLLED_KEY); }
export function usePendingClassRequests() { return useLocalSet(REQUESTS_KEY); }

export async function shareLink(url: string, title: string): Promise<"shared" | "copied"> {
  try {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      await (navigator as any).share({ url, title });
      return "shared";
    }
  } catch {}
  try {
    await navigator.clipboard.writeText(url);
  } catch {}
  return "copied";
}
