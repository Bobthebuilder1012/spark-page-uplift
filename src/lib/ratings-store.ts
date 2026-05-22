// Shared mock store for ratings & comments. UI-only.
import { useEffect, useState } from "react";

export type TargetKind = "class" | "tutor";
export type Target = { kind: TargetKind; id: string; name: string; billingPeriod?: string };

export type Eligibility = {
  can_view: true;
  can_comment: boolean;
  can_react: boolean;
  alreadyCommented?: boolean;
};

export type Rating = { stars: 1 | 2 | 3 | 4 | 5; count: number };
export type RatingSummary = {
  average: number;
  total: number;
  dist: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type Comment = {
  id: string;
  targetKind: TargetKind;
  targetId: string;
  authorId: string;
  authorName: string;
  authorHue: number;
  body: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  createdAt: string; // "2 days ago"
  edited?: boolean;
  likes: number;
  dislikes: number;
  myReaction?: "up" | "down" | null;
  hiddenByMod?: boolean;
  reply?: {
    body: string;
    createdAt: string;
    edited?: boolean;
    tutorName: string;
    tutorHue: number;
  };
};

export type PendingRating = {
  id: string;
  classId: string;
  className: string;
  tutorName: string;
  tutorHue: number;
  billingPeriod: string;
  dismissals: number; // 0..3
  expiresInDays: number;
};

export type TutoringPreference = "both" | "classes-only" | "one-on-one-only";

// ---------------- Mock ratings ----------------
function makeSummary(dist: Record<1 | 2 | 3 | 4 | 5, number>): RatingSummary {
  const total = dist[1] + dist[2] + dist[3] + dist[4] + dist[5];
  const sum = 1 * dist[1] + 2 * dist[2] + 3 * dist[3] + 4 * dist[4] + 5 * dist[5];
  return { dist, total, average: total ? sum / total : 0 };
}

export const RATING_SUMMARIES: Record<string, RatingSummary> = {
  // Tutors
  "tutor:ramdeen": makeSummary({ 1: 2, 2: 1, 3: 4, 4: 18, 5: 37 }),
  "tutor:singh": makeSummary({ 1: 1, 2: 3, 3: 12, 4: 24, 5: 14 }),
  "tutor:joseph": makeSummary({ 1: 0, 2: 0, 3: 1, 4: 1, 5: 1 }),
  // Classes
  "class:csec-maths-crash": makeSummary({ 1: 1, 2: 0, 3: 3, 4: 9, 5: 22 }),
  "class:cape-physics-u1": makeSummary({ 1: 0, 2: 1, 3: 4, 4: 11, 5: 18 }),
  "class:csec-english-lit": makeSummary({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }),
};

export function getSummary(kind: TargetKind, id: string): RatingSummary {
  return RATING_SUMMARIES[`${kind}:${id}`] ?? makeSummary({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
}

// ---------------- Mock comments ----------------
export const SEED_COMMENTS: Comment[] = [
  {
    id: "c1", targetKind: "tutor", targetId: "ramdeen",
    authorId: "u1", authorName: "Sasha M.", authorHue: 220,
    body: "Mr. Ramdeen made functions click for me. Patient, real-world examples, and great notes after every session.",
    rating: 5, createdAt: "2 days ago", likes: 12, dislikes: 0, myReaction: null,
    reply: { body: "Thanks Sasha — you put in the work. Keep going!", createdAt: "1 day ago", tutorName: "Mr. Ramdeen", tutorHue: 145 },
  },
  {
    id: "c2", targetKind: "tutor", targetId: "ramdeen",
    authorId: "u2", authorName: "Devan R.", authorHue: 20,
    body: "Solid notes shared after every session. Would love more past paper drills though.",
    rating: 4, createdAt: "1 week ago", edited: true, likes: 4, dislikes: 1, myReaction: null,
  },
  {
    id: "c3", targetKind: "class", targetId: "csec-maths-crash",
    authorId: "u3", authorName: "Aliyah M.", authorHue: 35,
    body: "This crash course saved me. Worth every dollar.",
    rating: 5, createdAt: "3 days ago", likes: 8, dislikes: 0, myReaction: "up",
  },
  {
    id: "c4", targetKind: "class", targetId: "csec-maths-crash",
    authorId: "u4", authorName: "Kareem H.", authorHue: 280,
    body: "Pace was a bit fast for me at first but it picked up. Good overall.",
    rating: 3, createdAt: "2 weeks ago", likes: 2, dislikes: 1, myReaction: null,
  },
  {
    id: "c5", targetKind: "class", targetId: "csec-maths-crash",
    authorId: "u5", authorName: "Anonymous",
    authorHue: 0, body: "This comment was hidden by moderators.",
    rating: 1, createdAt: "1 month ago", likes: 0, dislikes: 0, hiddenByMod: true,
  },
  {
    id: "c6", targetKind: "tutor", targetId: "singh",
    authorId: "u6", authorName: "Trinity H.", authorHue: 165,
    body: "Ms. Singh explains physics intuitively. Made waves topic actually fun.",
    rating: 5, createdAt: "5 days ago", likes: 6, dislikes: 0,
  },
  {
    id: "c7", targetKind: "class", targetId: "cape-physics-u1",
    authorId: "u7", authorName: "Marcus A.", authorHue: 200,
    body: "Strong content but I wish there were more office hours.",
    rating: 4, createdAt: "1 week ago", likes: 3, dislikes: 0,
  },
  {
    id: "c8", targetKind: "tutor", targetId: "ramdeen",
    authorId: "u8", authorName: "Jada S.", authorHue: 320,
    body: "Honestly the best tutor I've worked with for CAPE Pure Maths.",
    rating: 5, createdAt: "3 weeks ago", likes: 9, dislikes: 0,
  },
];

// ---------------- Pending class ratings (A2) ----------------
export const PENDING_RATINGS: PendingRating[] = [
  { id: "p1", classId: "csec-maths-crash", className: "Form 4 Physics", tutorName: "Mr. Maharaj", tutorHue: 165, billingPeriod: "April 2026", dismissals: 3, expiresInDays: 5 },
  { id: "p2", classId: "csec-english-lit", className: "CSEC English Literature", tutorName: "Mr. Joseph", tutorHue: 20, billingPeriod: "April 2026", dismissals: 1, expiresInDays: 12 },
  { id: "p3", classId: "cape-physics-u1", className: "CAPE Physics Unit 1", tutorName: "Ms. Singh", tutorHue: 220, billingPeriod: "April 2026", dismissals: 0, expiresInDays: 14 },
];

// ---------------- Reports (admin queue) ----------------
export type ReportReason = "spam" | "harassment" | "language" | "misleading" | "other";
export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "language", label: "Inappropriate language" },
  { value: "misleading", label: "Misleading information" },
  { value: "other", label: "Other" },
];

export type Report = {
  id: string;
  commentId: string;
  commentPreview: string;
  reason: ReportReason;
  reporter: string;
  reportedUser: string;
  target: string;
  date: string;
  status: "pending" | "resolved" | "dismissed";
};

export const ADMIN_REPORTS: Report[] = [
  { id: "rep1", commentId: "c2", commentPreview: "Solid notes shared after every session…", reason: "spam", reporter: "Devan R.", reportedUser: "—", target: "Mr. Ramdeen", date: "2h ago", status: "pending" },
  { id: "rep2", commentId: "c4", commentPreview: "Pace was a bit fast for me at first…", reason: "misleading", reporter: "Aliyah M.", reportedUser: "Kareem H.", target: "CSEC Maths Crash", date: "5h ago", status: "pending" },
  { id: "rep3", commentId: "c6", commentPreview: "Ms. Singh explains physics intuitively…", reason: "harassment", reporter: "Anon", reportedUser: "Trinity H.", target: "Ms. Singh", date: "1d ago", status: "pending" },
  { id: "rep4", commentId: "c7", commentPreview: "Strong content but I wish there were more…", reason: "language", reporter: "Mods", reportedUser: "Marcus A.", target: "CAPE Physics U1", date: "2d ago", status: "pending" },
  { id: "rep5", commentId: "c1", commentPreview: "Mr. Ramdeen made functions click for me…", reason: "other", reporter: "—", reportedUser: "Sasha M.", target: "Mr. Ramdeen", date: "3d ago", status: "resolved" },
];

// ---------------- Helpers ----------------
export function fmtCount(n: number): string {
  return n.toLocaleString("en-US");
}

export function distPct(summary: RatingSummary, stars: 1 | 2 | 3 | 4 | 5): number {
  if (!summary.total) return 0;
  return (summary.dist[stars] / summary.total) * 100;
}

// ---------------- Tutoring preference persistence ----------------
const TUTOR_PREF_KEY = "itutor.tutoringPreference";

export function useTutoringPreference() {
  const [value, setValue] = useState<TutoringPreference>("both");
  useEffect(() => {
    try {
      const v = localStorage.getItem(TUTOR_PREF_KEY) as TutoringPreference | null;
      if (v === "both" || v === "classes-only" || v === "one-on-one-only") setValue(v);
    } catch {}
  }, []);
  const save = (v: TutoringPreference) => {
    setValue(v);
    try { localStorage.setItem(TUTOR_PREF_KEY, v); } catch {}
  };
  return [value, save] as const;
}

// Viewer eligibility per target. In real life would come from session/db.
export function getViewerEligibility(_kind: TargetKind, id: string): Eligibility {
  // Demo: viewer has completed work with ramdeen + csec-maths-crash; not with singh.
  const eligible = id === "ramdeen" || id === "csec-maths-crash";
  return {
    can_view: true,
    can_comment: eligible,
    can_react: eligible,
    alreadyCommented: false,
  };
}
