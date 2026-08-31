/**
 * SAMPLE / PLACEHOLDER marketplace data for the homepage prototype.
 *
 * PRODUCTION NOTE (engineering handoff):
 * Nothing here should be hardcoded in production. Subjects and classes must be
 * derived from live marketplace data. A subject is only *eligible* to appear in
 * Subject Discovery when it has >= 1 eligible class, where an eligible class is:
 *   published && active && acceptingRegistrations && hasValidSchedule &&
 *   teacher.profileMeetsMarketplaceRequirements
 * If a subject drops to zero eligible classes it must disappear from the UI.
 */

import teacher1 from "@/assets/teacher-1.jpg";
import teacher2 from "@/assets/teacher-2.jpg";
import teacher3 from "@/assets/teacher-3.jpg";

export type Level = "SEA" | "CSEC" | "CAPE";
export type Format = "Online" | "In person";
/** Only render when backed by real marketplace data. */
export type DataLabel = "Popular" | "New" | "Starting soon" | "Limited spaces";

export type SampleTeacher = {
  id: string;
  name: string;
  photo: string;
  specialisation: string;
  /** Placeholder copy — replace with teacher-authored intro. */
  intro: string;
  location: string;
};

export type SampleClass = {
  id: string;
  title: string;
  subject: string;
  level: Level;
  teacherId: string;
  format: Format;
  day: string;
  time: string;
  priceTTD: number;
  per: "month" | "session";
  label?: DataLabel;
  accent: string;
};

export const sampleTeachers: Record<string, SampleTeacher> = {
  t1: {
    id: "t1",
    name: "Nadia Charles",
    photo: teacher1,
    specialisation: "Mathematics · Additional Mathematics",
    intro:
      "Placeholder intro — I teach the syllabus in the order students actually panic about it: past paper first, theory second.",
    location: "Port of Spain",
  },
  t2: {
    id: "t2",
    name: "Ravi Persad",
    photo: teacher2,
    specialisation: "Chemistry · Integrated Science",
    intro:
      "Placeholder intro — every session ends with one worked exam question, marked out loud against the scheme.",
    location: "San Fernando",
  },
  t3: {
    id: "t3",
    name: "Marlon Baptiste",
    photo: teacher3,
    specialisation: "English A · Literature",
    intro:
      "Placeholder intro — we build essays from evidence, not templates. Reading first, structure after.",
    location: "Arima",
  },
};

export const sampleClasses: SampleClass[] = [
  {
    id: "c1",
    title: "CSEC Mathematics — Algebra & Functions",
    subject: "Mathematics",
    level: "CSEC",
    teacherId: "t1",
    format: "Online",
    day: "Tuesdays",
    time: "5:00 – 6:30 PM",
    priceTTD: 450,
    per: "month",
    label: "Popular",
    accent: "var(--brand)",
  },
  {
    id: "c2",
    title: "CAPE Pure Mathematics Unit 1 — Paper 2 Drills",
    subject: "Mathematics",
    level: "CAPE",
    teacherId: "t1",
    format: "Online",
    day: "Saturdays",
    time: "9:00 – 11:00 AM",
    priceTTD: 600,
    per: "month",
    label: "Limited spaces",
    accent: "var(--sky)",
  },
  {
    id: "c3",
    title: "SEA Mathematics — Problem Solving Clinic",
    subject: "Mathematics",
    level: "SEA",
    teacherId: "t1",
    format: "In person",
    day: "Thursdays",
    time: "4:00 – 5:15 PM",
    priceTTD: 380,
    per: "month",
    accent: "var(--peach)",
  },
  {
    id: "c4",
    title: "CSEC Chemistry — Organic & Titration Lab Prep",
    subject: "Chemistry",
    level: "CSEC",
    teacherId: "t2",
    format: "Online",
    day: "Mondays",
    time: "6:00 – 7:30 PM",
    priceTTD: 500,
    per: "month",
    label: "Starting soon",
    accent: "var(--lavender)",
  },
  {
    id: "c5",
    title: "CAPE Chemistry Unit 2 — Exam Intensive",
    subject: "Chemistry",
    level: "CAPE",
    teacherId: "t2",
    format: "Online",
    day: "Sundays",
    time: "2:00 – 4:00 PM",
    priceTTD: 700,
    per: "month",
    accent: "var(--coral-soft)",
  },
  {
    id: "c6",
    title: "CSEC English A — Essay & Comprehension Workshop",
    subject: "English A",
    level: "CSEC",
    teacherId: "t3",
    format: "Online",
    day: "Wednesdays",
    time: "5:30 – 7:00 PM",
    priceTTD: 420,
    per: "month",
    label: "New",
    accent: "var(--brand-soft)",
  },
  {
    id: "c7",
    title: "SEA Creative Writing — Weekly Group",
    subject: "English A",
    level: "SEA",
    teacherId: "t3",
    format: "In person",
    day: "Fridays",
    time: "4:30 – 5:45 PM",
    priceTTD: 350,
    per: "month",
    accent: "var(--peach)",
  },
  {
    id: "c8",
    title: "CSEC Biology — Systems & Diagrams",
    subject: "Biology",
    level: "CSEC",
    teacherId: "t2",
    format: "Online",
    day: "Tuesdays",
    time: "7:00 – 8:15 PM",
    priceTTD: 480,
    per: "month",
    accent: "var(--sky)",
  },
  {
    id: "c9",
    title: "CSEC Principles of Business — Section by Section",
    subject: "Principles of Business",
    level: "CSEC",
    teacherId: "t3",
    format: "Online",
    day: "Thursdays",
    time: "6:00 – 7:15 PM",
    priceTTD: 400,
    per: "month",
    accent: "var(--lavender)",
  },
  {
    id: "c10",
    title: "CSEC Geography — Map Work & Fieldwork Skills",
    subject: "Geography",
    level: "CSEC",
    teacherId: "t1",
    format: "In person",
    day: "Saturdays",
    time: "10:00 – 11:30 AM",
    priceTTD: 430,
    per: "month",
    accent: "var(--brand-soft)",
  },
  {
    id: "c11",
    title: "CSEC Additional Mathematics — Calculus Foundations",
    subject: "Additional Mathematics",
    level: "CSEC",
    teacherId: "t1",
    format: "Online",
    day: "Sundays",
    time: "11:00 AM – 12:30 PM",
    priceTTD: 520,
    per: "month",
    accent: "var(--coral-soft)",
  },
];

/** Stand-in for the eligibility query described at the top of this file. */
export function eligibleSubjects(classes: SampleClass[] = sampleClasses) {
  const map = new Map<string, SampleClass[]>();
  for (const c of classes) {
    map.set(c.subject, [...(map.get(c.subject) ?? []), c]);
  }
  return [...map.entries()]
    .filter(([, list]) => list.length > 0)
    .map(([subject, list]) => ({ subject, count: list.length, classes: list }))
    .sort((a, b) => b.count - a.count || a.subject.localeCompare(b.subject));
}

export function teacherOf(c: SampleClass) {
  return sampleTeachers[c.teacherId]!;
}
