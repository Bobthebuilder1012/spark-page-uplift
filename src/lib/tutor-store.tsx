import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

// TODO(cursor): replace this entire mock store with real backend wiring.
// `listed` is derived from completion of all 5 tertiary requirements.

export type TutorSubject = { id: string; name: string; level: string };
export type AvailabilitySlot = { day: number; hour: number }; // day 0=Sun..6=Sat, hour 0-23

export type TutorProfile = {
  name: string;
  initials: string;
  email: string;
  avatarUrl: string | null;
  bio: string;
  subjects: TutorSubject[];
  availability: AvailabilitySlot[];
  hourlyRateTtd: number | null;
};

export type TutorSession = {
  id: string;
  student: string;
  subject: string;
  date: string; // ISO
  durationMin: number;
  type: "1-on-1" | "Group";
  status: "upcoming" | "past" | "pending";
};

export type TutorLesson = {
  id: string;
  title: string;
  subject: string;
  level: string;
  students: number;
  capacity: number;
  rateTtd: number;
  recurring: boolean;
};

export type ActivityItem = {
  id: string;
  kind: "inquiry" | "review" | "payout" | "booking";
  text: string;
  at: string;
};

const STORAGE_KEY = "itutor.tutorProfile.v1";

const DEFAULT_PROFILE: TutorProfile = {
  name: "Anil Ramdeen",
  initials: "AR",
  email: "anil.ramdeen@example.tt",
  avatarUrl: null,
  bio: "",
  subjects: [],
  availability: [],
  hourlyRateTtd: null,
};

export const PLACEHOLDER_SESSIONS: TutorSession[] = [
  { id: "s1", student: "Aliyah Mohammed", subject: "CSEC Mathematics", date: new Date(Date.now() + 36e5 * 4).toISOString(), durationMin: 60, type: "1-on-1", status: "upcoming" },
  { id: "s2", student: "Devon Charles", subject: "CSEC Physics", date: new Date(Date.now() + 36e5 * 26).toISOString(), durationMin: 90, type: "1-on-1", status: "upcoming" },
  { id: "s3", student: "Group · Form 5", subject: "CSEC Maths Revision", date: new Date(Date.now() + 36e5 * 50).toISOString(), durationMin: 60, type: "Group", status: "upcoming" },
  { id: "s4", student: "Keshawn Boodoo", subject: "CAPE Pure Maths", date: new Date(Date.now() + 36e5 * 74).toISOString(), durationMin: 60, type: "1-on-1", status: "upcoming" },
  { id: "s5", student: "Sade Williams", subject: "CSEC Add. Maths", date: new Date(Date.now() + 36e5 * 96).toISOString(), durationMin: 60, type: "1-on-1", status: "upcoming" },
];

export const PLACEHOLDER_LESSONS: TutorLesson[] = [
  { id: "l1", title: "CSEC Maths Crash Course", subject: "Mathematics", level: "CSEC", students: 8, capacity: 12, rateTtd: 120, recurring: true },
  { id: "l2", title: "CAPE Pure Maths Unit 1", subject: "Pure Mathematics", level: "CAPE", students: 4, capacity: 8, rateTtd: 180, recurring: true },
];

export const PLACEHOLDER_STUDENTS = [
  { id: "u1", name: "Aliyah Mohammed", level: "Form 5", subject: "CSEC Maths", sessions: 12 },
  { id: "u2", name: "Devon Charles", level: "Form 5", subject: "CSEC Physics", sessions: 7 },
  { id: "u3", name: "Keshawn Boodoo", level: "Lower 6", subject: "CAPE Pure Maths", sessions: 4 },
  { id: "u4", name: "Sade Williams", level: "Form 4", subject: "CSEC Add. Maths", sessions: 9 },
];

export const PLACEHOLDER_ACTIVITY: ActivityItem[] = [
  { id: "a1", kind: "inquiry", text: "New inquiry from Renée P. about CSEC Add. Maths", at: "2h ago" },
  { id: "a2", kind: "review", text: "Aliyah M. left a 5-star review", at: "Yesterday" },
  { id: "a3", kind: "payout", text: "Payout of TTD 1,840 processed to your bank", at: "3 days ago" },
  { id: "a4", kind: "booking", text: "Devon C. booked 90 mins for Saturday 4:00 PM", at: "5 days ago" },
];

export const SUBJECT_OPTIONS = [
  // TODO(cursor): replace with real subject taxonomy from the backend.
  { name: "Mathematics", levels: ["SEA", "Form 1-3", "CSEC", "Add. Maths", "CAPE Pure", "CAPE Applied"] },
  { name: "Physics", levels: ["Form 1-3", "CSEC", "CAPE Unit 1", "CAPE Unit 2"] },
  { name: "Chemistry", levels: ["Form 1-3", "CSEC", "CAPE Unit 1", "CAPE Unit 2"] },
  { name: "Biology", levels: ["Form 1-3", "CSEC", "CAPE Unit 1", "CAPE Unit 2"] },
  { name: "English A", levels: ["SEA", "Form 1-3", "CSEC"] },
  { name: "English B", levels: ["CSEC", "CAPE"] },
  { name: "Spanish", levels: ["CSEC", "CAPE"] },
  { name: "Information Technology", levels: ["CSEC", "CAPE"] },
  { name: "Principles of Accounts", levels: ["CSEC"] },
  { name: "Economics", levels: ["CSEC", "CAPE"] },
];

type TutorContextValue = {
  profile: TutorProfile;
  setProfile: (updater: (p: TutorProfile) => TutorProfile) => void;
  completion: {
    avatar: boolean;
    bio: boolean;
    subjects: boolean;
    availability: boolean;
    rate: boolean;
    completed: number;
    total: number;
    listed: boolean;
  };
};

const TutorCtx = createContext<TutorContextValue | null>(null);

export function TutorStoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<TutorProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfileState({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const setProfile = (updater: (p: TutorProfile) => TutorProfile) => {
    setProfileState((prev) => {
      const next = updater(prev);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const completion = useMemo(() => {
    const avatar = !!profile.avatarUrl;
    const bio = profile.bio.trim().length >= 150;
    const subjects = profile.subjects.length >= 1;
    const availability = profile.availability.length >= 1;
    const rate = !!profile.hourlyRateTtd && profile.hourlyRateTtd > 0;
    const checks = [avatar, bio, subjects, availability, rate];
    const completed = checks.filter(Boolean).length;
    return { avatar, bio, subjects, availability, rate, completed, total: 5, listed: completed === 5 };
  }, [profile]);

  return <TutorCtx.Provider value={{ profile, setProfile, completion }}>{children}</TutorCtx.Provider>;
}

export function useTutor() {
  const v = useContext(TutorCtx);
  if (!v) throw new Error("useTutor must be used inside TutorStoreProvider");
  return v;
}
