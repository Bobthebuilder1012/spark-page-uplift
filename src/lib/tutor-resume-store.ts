import { useEffect, useState } from "react";

export type ResumeEntry = {
  id: string;
  startYear: string;
  endYear: string;
  title: string;
  description: string;
  verified?: boolean;
};

export type Specialty = {
  id: string;
  name: string;
  description: string;
};

export type TutorResume = {
  education: ResumeEntry[];
  certifications: ResumeEntry[];
  experience: ResumeEntry[];
  specialties: Specialty[];
};

const STORAGE_PREFIX = "itutor.tutorResume.v1.";

const DEFAULTS: Record<string, TutorResume> = {
  ramdeen: {
    education: [
      { id: "e1", startYear: "2010", endYear: "2014", title: "BSc Mathematics — UWI St. Augustine", description: "First-class honours. Focus on applied analysis and numerical methods.", verified: true },
    ],
    certifications: [
      { id: "c1", startYear: "2015", endYear: "2015", title: "CXC Examiner Training — CSEC Mathematics", description: "Trained as an official CXC examiner for CSEC Mathematics papers.", verified: true },
      { id: "c2", startYear: "2018", endYear: "2018", title: "Cambridge International A-Level Endorsement", description: "Cambridge-endorsed teacher for A-Level Mathematics.", verified: false },
    ],
    experience: [
      { id: "x1", startYear: "2016", endYear: "Present", title: "Senior Maths Tutor — Independent", description: "10+ years of CSEC, CAPE, GCSE and A-Level instruction with a Grade I track record." },
    ],
    specialties: [
      { id: "s1", name: "CSEC Mathematics", description: "Full syllabus coverage, weekly past-paper drills, and SBA support." },
      { id: "s2", name: "CAPE Pure Mathematics — Unit 1 & 2", description: "Calculus, sequences & series, complex numbers with exam-style problem sets." },
      { id: "s3", name: "Cambridge A-Level Mathematics", description: "Pure, Mechanics and Statistics modules aligned to the 9709 syllabus." },
      { id: "s4", name: "CSEC Physics", description: "Concept-led teaching with practical lab walkthroughs and SBA guidance." },
    ],
  },
};

const EMPTY: TutorResume = { education: [], certifications: [], experience: [], specialties: [] };

function read(id: string): TutorResume {
  if (typeof window === "undefined") return DEFAULTS[id] ?? EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    if (raw) return JSON.parse(raw) as TutorResume;
  } catch {}
  return DEFAULTS[id] ?? EMPTY;
}

function write(id: string, value: TutorResume) {
  try {
    localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("itutor:resume-changed", { detail: { id } }));
  } catch {}
}

export function useTutorResume(id: string) {
  const [resume, setResume] = useState<TutorResume>(() => read(id));

  useEffect(() => {
    setResume(read(id));
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id?: string } | undefined;
      if (!detail || detail.id === id) setResume(read(id));
    };
    window.addEventListener("itutor:resume-changed", handler);
    return () => window.removeEventListener("itutor:resume-changed", handler);
  }, [id]);

  const save = (next: TutorResume) => {
    setResume(next);
    write(id, next);
  };

  return { resume, save };
}

export const newId = () => Math.random().toString(36).slice(2, 9);
