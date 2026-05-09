import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lesson = {
  id: string;
  title: string;
  subject: string;
  tutor: string;
  color: string; // tailwind text/bg color class slug
  emoji: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  tutor: string;
  // ISO weekday 0-6 (Sun-Sat)
  day: number;
  startHour: number; // 0-23 (decimal allowed)
  endHour: number;
  color: string; // brand|coral|sky|lavender|peach
};

export const ALL_LESSONS: Lesson[] = [
  { id: "csec-maths", title: "CSEC Mathematics", subject: "Maths", tutor: "Mr. Ramdeen", color: "coral", emoji: "📐" },
  { id: "csec-physics", title: "CSEC Physics", subject: "Physics", tutor: "Ms. Singh", color: "sky", emoji: "⚛️" },
  { id: "english-lit", title: "English Literature", subject: "English", tutor: "Mr. Joseph", color: "lavender", emoji: "📚" },
  { id: "biology", title: "CSEC Biology", subject: "Biology", tutor: "Ms. Ali", color: "brand", emoji: "🧬" },
  { id: "chemistry", title: "CAPE Chemistry", subject: "Chemistry", tutor: "Mr. Thomas", color: "peach", emoji: "🧪" },
];

export const UPCOMING_EVENTS: CalendarEvent[] = [
  { id: "e1", title: "CSEC Maths — Functions", tutor: "Mr. Ramdeen", day: 6, startHour: 16, endHour: 17, color: "coral" },
  { id: "e2", title: "Physics — Waves", tutor: "Ms. Singh", day: 2, startHour: 17.5, endHour: 18.5, color: "sky" },
  { id: "e3", title: "English Lit — Essays", tutor: "Mr. Joseph", day: 3, startHour: 16, endHour: 17, color: "lavender" },
  { id: "e4", title: "Maths — Calculus", tutor: "Mr. Ramdeen", day: 5, startHour: 16, endHour: 17, color: "coral" },
  { id: "e5", title: "Biology — Cells", tutor: "Ms. Ali", day: 4, startHour: 15, endHour: 16, color: "brand" },
];

type Ctx = {
  pinnedLessons: string[];
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
};

const StudentCtx = createContext<Ctx | null>(null);
const KEY = "itutor.pinnedLessons";

export function StudentStoreProvider({ children }: { children: ReactNode }) {
  const [pinnedLessons, setPinned] = useState<string[]>(ALL_LESSONS.map((l) => l.id));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPinned(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(pinnedLessons)); } catch {}
  }, [pinnedLessons]);

  const togglePin = (id: string) =>
    setPinned((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const isPinned = (id: string) => pinnedLessons.includes(id);

  return <StudentCtx.Provider value={{ pinnedLessons, togglePin, isPinned }}>{children}</StudentCtx.Provider>;
}

export function useStudentStore() {
  const ctx = useContext(StudentCtx);
  if (!ctx) throw new Error("useStudentStore must be used inside StudentStoreProvider");
  return ctx;
}
