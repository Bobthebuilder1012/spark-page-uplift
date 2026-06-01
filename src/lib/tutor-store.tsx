import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

// TODO(cursor): replace this entire mock store with real backend wiring.

export type TutorSubject = { id: string; name: string; level: string };
export type AvailabilitySlot = { day: number; hour: number };

export type TutorProfile = {
  name: string;
  initials: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  bio: string;
  subjects: TutorSubject[];
  availability: AvailabilitySlot[];
  hourlyRateTtd: number | null;
  videoProvider: "zoom" | "google-meet" | "itutor" | null;
};

// Lesson schema -- 4 kinds
export type LessonKind = "1on1-oneoff" | "1on1-recurring" | "group-oneoff" | "group-recurring";
export type LessonStatus = "draft" | "published" | "full" | "completed" | "cancelled";

export type MemberStatus = "invited" | "active" | "suspended" | "banned" | "removed";
export type EnrolledStudent = {
  studentId: string;
  name: string;
  paymentStatus: "paid" | "pending" | "overdue";
  status?: MemberStatus;
  outstandingTtd?: number;
  joinedAt?: string;
};

export type BillingModel = "per-session" | "per-month" | "prepaid";
export type PromotionKind = "early-bird" | "time-limited" | "open-ended";
export type ClassPromotion = {
  kind: PromotionKind;
  originalPrice: number;
  discountedPrice: number;
  endsAt?: string;       // required for time-limited
  seatCap?: number;      // required for early-bird (first N students)
  label?: string;
};
export type ParentFeedbackMode = "off" | "included" | "paid";
export type PrimaryChannel = "native" | "whatsapp" | "classroom";

export type RecurringRequest = {
  id: string;
  studentId: string;
  studentName: string;
  initials: string;
  subject: string;
  level: string;
  preferredTime: string;
  message: string;
  receivedAt: string;
};

export type FeedbackDraft = {
  id: string;
  studentId: string;
  studentName: string;
  initials: string;
  lessonId: string;
  lessonName: string;
  month: string;
  status: "pending" | "approved" | "sent";
  // System-filled facts (never written by tutor or AI)
  stats: { attendance: string; sessionsAttended: number; sessionsScheduled: number };
  // Tutor writes ONE narrative report. Suggested prompts (FEEDBACK_PROMPTS) are
  // shown as guidance only — they're not separate fields.
  body: string;
  refinedByAi?: boolean;
};

export type StreamPost = {
  id: string;
  kind: "announcement" | "attachment" | "link";
  title: string;
  body: string;
  at: string;
  pinned?: boolean;
  pendingApproval?: boolean;
  attachmentName?: string;
  linkUrl?: string;
};

export type TutorLesson = {
  id: string;
  title: string;
  kind: LessonKind;
  subject: string;
  level: string;          // e.g. CSEC / CAPE / Form 5
  description: string;
  startDate: string;      // ISO
  recurrenceRule?: string; // e.g. "Weekly · Mon 4pm"
  durationMin: number;
  pricingMode: "per-session" | "per-block" | "per-student";
  rateTtd: number;
  capacity: number;       // 1 for 1:1
  enrollments: EnrolledStudent[];
  materialsCount: number;
  notes: string;
  status: LessonStatus;
  // Customization & marketplace
  thumbnailGradient?: string;       // tailwind gradient classes for the banner
  bio?: string;                     // long-form description shown on listing
  visibility?: "public" | "private";
  approvalRequired?: boolean;
  waitlistEnabled?: boolean;
  archived?: boolean;
  whatsappLink?: string;
  classroomLink?: string;
  videoProvider?: "zoom" | "google-meet" | "itutor";
  ownerId?: string;
  totalSessionsRun?: number;
  earningsTtd?: number;
  avgAttendance?: number;           // 0-100
  retention?: number;               // 0-100
  rating?: number | null;           // 0-5
  reviewCount?: number;
  // New: billing & policies
  billingModel?: BillingModel;
  memberServiceFee?: number;         // TTD per member
  autoSuspend?: boolean;
  graceWindowDays?: number;
  joinRequests?: boolean;
  primaryChannel?: PrimaryChannel;
  parentFeedbackMode?: ParentFeedbackMode;
  parentFeedbackPrice?: number;
  promotion?: ClassPromotion | null;
};

export type TutorSession = {
  id: string;
  lessonId?: string;
  student: string;
  studentId?: string;
  subject: string;
  date: string;
  durationMin: number;
  type: "1-on-1" | "Group";
  status: "upcoming" | "past" | "pending";
  paymentStatus?: "paid" | "pending" | "overdue";
  attendance?: "attended" | "no-show" | "cancelled";
  reviewed?: boolean;
};

export type ActivityItem = { id: string; kind: "inquiry" | "review" | "payout" | "booking"; text: string; at: string };

// Students CRM
export type StudentTag = { id: string; label: string; color: string };
export type StudentRecord = {
  id: string;
  name: string;
  initials: string;
  level: string;
  email?: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  parentLinked?: boolean; // parent has a linked iTutor account
  primarySubjects: string[];
  tagIds: string[];
  joinedAt: string;
  lastSessionAt: string;
  totalSessions: number;
  revenueTtd: number;
  paymentReliability: number; // 0-100
  outstandingTtd: number;
  active: boolean;
  enrollmentLessonIds: string[];
  notes: { id: string; at: string; text: string; pinned?: boolean }[];
  performance: { metric: string; value: number; max: number }[];
  performanceHistory: { date: string; score: number }[];
};

// Lookup helper used by class rosters to surface contact info.
export function getStudentContact(studentId: string) {
  return PLACEHOLDER_STUDENTS.find((s) => s.id === studentId);
}

// Wallet
export type Transaction = {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  lessonId?: string;
  lessonName: string;
  type: LessonKind;
  sessionNumber?: number;
  grossTtd: number;
  feeTtd: number;
  netTtd: number;
  status: "paid" | "pending" | "failed" | "refunded";
};

export type Payout = { id: string; date: string; amount: number; method: string; status: "Paid" | "Scheduled" };

// Notifications
export type TutorNotif = {
  id: string;
  type: "booking" | "reminder" | "payment" | "message" | "review" | "system";
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

const STORAGE_KEY = "itutor.tutorProfile.v1";

const DEFAULT_PROFILE: TutorProfile = {
  name: "Anil Ramdeen",
  initials: "AR",
  email: "anil.ramdeen@example.tt",
  phone: "+1 868 555 0142",
  avatarUrl: null,
  bio: "",
  subjects: [],
  availability: [],
  hourlyRateTtd: null,
  videoProvider: null,
};

// -------------------- Placeholder data --------------------

const iso = (offsetH: number) => new Date(Date.now() + offsetH * 36e5).toISOString();

export const TAG_LIBRARY: StudentTag[] = [
  { id: "exam", label: "Exam prep", color: "bg-coral-soft text-coral" },
  { id: "advanced", label: "Advanced", color: "bg-brand-soft text-brand-deep" },
  { id: "follow", label: "Needs follow-up", color: "bg-peach text-ink" },
  { id: "parent", label: "Parent involved", color: "bg-lavender text-ink" },
  { id: "scholarship", label: "Scholarship", color: "bg-sky text-ink" },
];

export const PLACEHOLDER_STUDENTS: StudentRecord[] = [
  {
    id: "u1", name: "Aliyah Mohammed", initials: "AM", level: "Form 5",
    email: "aliyah.m@example.tt", phone: "+1 868 555 0121",
    parentName: "Ramona Mohammed", parentPhone: "+1 868 555 0188", parentEmail: "ramona.m@example.tt", parentLinked: true,
    primarySubjects: ["CSEC Mathematics", "Add. Maths"], tagIds: ["exam", "advanced"], joinedAt: iso(-24*120), lastSessionAt: iso(-26),
    totalSessions: 14, revenueTtd: 2520, paymentReliability: 96, outstandingTtd: 0, active: true,
    enrollmentLessonIds: ["l1", "l2"],
    notes: [
      { id: "n1", at: iso(-48), text: "Strong on algebra, weak on trig identities. Drill weekly.", pinned: true },
      { id: "n2", at: iso(-200), text: "Mum prefers WhatsApp updates over email.", pinned: false },
    ],
    performance: [{ metric: "Confidence", value: 8, max: 10 }, { metric: "Topic mastery", value: 4, max: 5 }],
    performanceHistory: [{date: "Wk 1", score: 62},{date: "Wk 2", score: 68},{date: "Wk 3", score: 71},{date: "Wk 4", score: 78},{date: "Wk 5", score: 82},{date: "Wk 6", score: 85}],
  },
  {
    id: "u2", name: "Devon Charles", initials: "DC", level: "Form 5",
    email: "devon.c@example.tt", phone: "+1 868 555 0134",
    primarySubjects: ["CSEC Physics"],
    tagIds: ["exam"], joinedAt: iso(-24*60), lastSessionAt: iso(-72),
    totalSessions: 7, revenueTtd: 1260, paymentReliability: 78, outstandingTtd: 360, active: true,
    enrollmentLessonIds: ["l3"],
    notes: [{ id: "n1", at: iso(-72), text: "Pays late but always pays. Send reminder day before.", pinned: true }],
    performance: [{ metric: "Lab skills", value: 6, max: 10 }],
    performanceHistory: [{date: "Wk 1", score: 55},{date: "Wk 2", score: 58},{date: "Wk 3", score: 62},{date: "Wk 4", score: 60},{date: "Wk 5", score: 65}],
  },
  {
    id: "u3", name: "Keshawn Boodoo", initials: "KB", level: "Lower 6",
    email: "keshawn.b@example.tt", phone: "+1 868 555 0145",
    primarySubjects: ["CAPE Pure Maths"],
    tagIds: ["advanced", "scholarship"], joinedAt: iso(-24*40), lastSessionAt: iso(-150),
    totalSessions: 4, revenueTtd: 720, paymentReliability: 100, outstandingTtd: 0, active: true,
    enrollmentLessonIds: ["l2"], notes: [],
    performance: [{ metric: "Calculus", value: 9, max: 10 }],
    performanceHistory: [{date: "Wk 1", score: 70},{date: "Wk 2", score: 74},{date: "Wk 3", score: 80},{date: "Wk 4", score: 88}],
  },
  {
    id: "u4", name: "Sade Williams", initials: "SW", level: "Form 4",
    email: "sade.w@example.tt", phone: "+1 868 555 0152",
    parentName: "Pat Williams", parentPhone: "+1 868 555 0177", parentEmail: "pat.w@example.tt", parentLinked: false,
    primarySubjects: ["CSEC Add. Maths"], tagIds: ["follow", "parent"], joinedAt: iso(-24*200), lastSessionAt: iso(-24*9),
    totalSessions: 9, revenueTtd: 1620, paymentReliability: 88, outstandingTtd: 180, active: true,
    enrollmentLessonIds: ["l1"], notes: [],
    performance: [{ metric: "Confidence", value: 5, max: 10 }],
    performanceHistory: [{date: "Wk 1", score: 50},{date: "Wk 2", score: 55},{date: "Wk 3", score: 58}],
  },
  {
    id: "u5", name: "Renée Phillip", initials: "RP", level: "Form 5",
    email: "renee.p@example.tt", phone: "+1 868 555 0163",
    primarySubjects: ["CSEC English A"],
    tagIds: [], joinedAt: iso(-24*15), lastSessionAt: iso(-24*15),
    totalSessions: 1, revenueTtd: 180, paymentReliability: 100, outstandingTtd: 0, active: false,
    enrollmentLessonIds: [], notes: [],
    performance: [],
    performanceHistory: [],
  },
];

export const PLACEHOLDER_LESSONS: TutorLesson[] = [
  {
    id: "l1", title: "CSEC Maths Crash Course", kind: "group-recurring", subject: "Mathematics", level: "CSEC",
    description: "6-week intensive review covering all 9 topics on the CSEC Maths syllabus.",
    bio: "A 6-week sprint built around past-paper drills, weekly diagnostics and live problem-solving. Students leave knowing exactly which topics to defend and which to attack on exam day.",
    startDate: iso(48), recurrenceRule: "Weekly · Sat 10:00 AM AST", durationMin: 90,
    pricingMode: "per-session", rateTtd: 120, capacity: 12,
    enrollments: [
      { studentId: "u1", name: "Aliyah Mohammed", paymentStatus: "paid", status: "active", joinedAt: iso(-24*40) },
      { studentId: "u4", name: "Sade Williams", paymentStatus: "overdue", status: "active", outstandingTtd: 180, joinedAt: iso(-24*30) },
      { studentId: "u5", name: "Renée Phillip", paymentStatus: "pending", status: "invited", joinedAt: iso(-24*2) },
    ],
    materialsCount: 6, notes: "", status: "published",
    thumbnailGradient: "from-orange-500 to-amber-400",
    visibility: "public", approvalRequired: false, waitlistEnabled: true, archived: false,
    whatsappLink: "", classroomLink: "", videoProvider: "zoom",
    totalSessionsRun: 12, earningsTtd: 1440, avgAttendance: 92, retention: 85, rating: 4.8, reviewCount: 9,
    billingModel: "per-session", memberServiceFee: 5, autoSuspend: true, graceWindowDays: 7,
    joinRequests: false, primaryChannel: "native", parentFeedbackMode: "included", parentFeedbackPrice: 0,
    promotion: { kind: "early-bird", originalPrice: 150, discountedPrice: 120, endsAt: iso(24*14), label: "Early-bird · ends in 2 weeks" },
  },
  {
    id: "l2", title: "CAPE Pure Maths · Unit 1", kind: "group-recurring", subject: "Pure Mathematics", level: "CAPE",
    description: "Unit 1 syllabus deep-dive. Past paper drills every other week.",
    bio: "Full Unit 1 coverage with weekly past-paper sets. Targeted at students aiming for Grade I.",
    startDate: iso(72), recurrenceRule: "Weekly · Tue 5:00 PM AST", durationMin: 120,
    pricingMode: "per-block", rateTtd: 180, capacity: 8,
    enrollments: [
      { studentId: "u1", name: "Aliyah Mohammed", paymentStatus: "paid" },
      { studentId: "u3", name: "Keshawn Boodoo", paymentStatus: "paid" },
    ],
    materialsCount: 9, notes: "", status: "published",
    thumbnailGradient: "from-fuchsia-500 to-purple-500",
    visibility: "public", approvalRequired: true, waitlistEnabled: false, archived: false,
    whatsappLink: "", classroomLink: "", videoProvider: "google-meet",
    totalSessionsRun: 18, earningsTtd: 3240, avgAttendance: 88, retention: 91, rating: 4.9, reviewCount: 14,
  },
  {
    id: "l3", title: "Physics 1:1 · Devon", kind: "1on1-recurring", subject: "Physics", level: "CSEC",
    description: "Weekly 1:1 focusing on lab reports and SBA.",
    startDate: iso(26), recurrenceRule: "Weekly · Wed 4:00 PM AST", durationMin: 60,
    pricingMode: "per-session", rateTtd: 200, capacity: 1,
    enrollments: [{ studentId: "u2", name: "Devon Charles", paymentStatus: "pending" }],
    materialsCount: 3, notes: "", status: "published",
    thumbnailGradient: "from-sky-500 to-cyan-400",
    visibility: "private", approvalRequired: true, waitlistEnabled: false, archived: false,
    videoProvider: "itutor",
    totalSessionsRun: 7, earningsTtd: 1190, avgAttendance: 100, retention: 100, rating: 5, reviewCount: 2,
  },
  {
    id: "l4", title: "SBA Trial Run · Group", kind: "group-oneoff", subject: "Mathematics", level: "Form 5",
    description: "One-off mock SBA session before final submission.",
    startDate: iso(120), durationMin: 120,
    pricingMode: "per-student", rateTtd: 90, capacity: 10,
    enrollments: [{ studentId: "u1", name: "Aliyah Mohammed", paymentStatus: "paid" }],
    materialsCount: 2, notes: "", status: "published",
    thumbnailGradient: "from-emerald-500 to-teal-400",
    visibility: "public", approvalRequired: false, waitlistEnabled: false, archived: false,
    videoProvider: "zoom",
    totalSessionsRun: 0, earningsTtd: 90, avgAttendance: 0, retention: 0, rating: null, reviewCount: 0,
  },
  {
    id: "l5", title: "Diagnostic Session · Renée", kind: "1on1-oneoff", subject: "English A", level: "CSEC",
    description: "First-time diagnostic to assess English A readiness.",
    startDate: iso(-24*15), durationMin: 60,
    pricingMode: "per-session", rateTtd: 180, capacity: 1,
    enrollments: [{ studentId: "u5", name: "Renée Phillip", paymentStatus: "paid" }],
    materialsCount: 1, notes: "Recommend enrolling in recurring CSEC English starting next month.", status: "completed",
    thumbnailGradient: "from-rose-500 to-pink-400",
    visibility: "private", archived: false, videoProvider: "google-meet",
    totalSessionsRun: 1, earningsTtd: 153, avgAttendance: 100, retention: 0, rating: 5, reviewCount: 1,
  },
  {
    id: "l6", title: "POA Bootcamp 2024 (Archived)", kind: "group-recurring", subject: "Principles of Accounts", level: "CSEC",
    description: "Last year's CSEC POA cohort.",
    startDate: iso(-24*180), recurrenceRule: "Weekly · Thu 6:00 PM AST", durationMin: 90,
    pricingMode: "per-session", rateTtd: 100, capacity: 15,
    enrollments: [], materialsCount: 22, notes: "", status: "completed",
    thumbnailGradient: "from-slate-500 to-zinc-500",
    visibility: "private", archived: true, videoProvider: "zoom",
    totalSessionsRun: 24, earningsTtd: 18600, avgAttendance: 84, retention: 72, rating: 4.7, reviewCount: 31,
  },
];

const now = Date.now();
export const PLACEHOLDER_SESSIONS: TutorSession[] = [
  // Upcoming (future)
  { id: "s1", lessonId: "l3", student: "Devon Charles", studentId: "u2", subject: "CSEC Physics", date: iso(4), durationMin: 60, type: "1-on-1", status: "upcoming", paymentStatus: "paid" },
  { id: "s2", lessonId: "l1", student: "Group · CSEC Maths (3)", subject: "CSEC Maths Crash Course", date: iso(26), durationMin: 90, type: "Group", status: "upcoming" },
  { id: "s3", lessonId: "l2", student: "Group · CAPE Pure (2)", subject: "CAPE Pure Maths", date: iso(50), durationMin: 120, type: "Group", status: "upcoming" },
  { id: "s4", lessonId: "l4", student: "Group · SBA Trial (1)", subject: "Mathematics SBA", date: iso(120), durationMin: 120, type: "Group", status: "upcoming" },
  // Past
  { id: "s5", lessonId: "l3", student: "Devon Charles", studentId: "u2", subject: "CSEC Physics", date: iso(-72), durationMin: 60, type: "1-on-1", status: "past", attendance: "attended", paymentStatus: "paid", reviewed: true },
  { id: "s6", lessonId: "l5", student: "Renée Phillip", studentId: "u5", subject: "English A · Diagnostic", date: iso(-24*15), durationMin: 60, type: "1-on-1", status: "past", attendance: "attended", paymentStatus: "paid", reviewed: false },
  { id: "s7", lessonId: "l1", student: "Aliyah Mohammed", studentId: "u1", subject: "CSEC Maths Crash Course", date: iso(-26), durationMin: 90, type: "Group", status: "past", attendance: "attended", paymentStatus: "paid", reviewed: true },
  { id: "s8", lessonId: "l1", student: "Sade Williams", studentId: "u4", subject: "CSEC Maths Crash Course", date: iso(-24*9), durationMin: 90, type: "Group", status: "past", attendance: "no-show", paymentStatus: "overdue", reviewed: false },
  // Pending (awaiting confirmation / payment)
  { id: "s9", student: "Trinity Hosein", subject: "CSEC Add. Maths", date: iso(48), durationMin: 60, type: "1-on-1", status: "pending", paymentStatus: "pending" },
  { id: "s10", student: "Marcus Ali", subject: "CAPE Pure Maths", date: iso(72), durationMin: 90, type: "1-on-1", status: "pending", paymentStatus: "pending" },
];

export const PLACEHOLDER_TRANSACTIONS: Transaction[] = [
  { id: "t1", date: iso(-26), studentId: "u1", studentName: "Aliyah Mohammed", lessonId: "l1", lessonName: "CSEC Maths Crash Course", type: "group-recurring", sessionNumber: 5, grossTtd: 120, feeTtd: 18, netTtd: 102, status: "paid" },
  { id: "t2", date: iso(-72), studentId: "u2", studentName: "Devon Charles", lessonId: "l3", lessonName: "Physics 1:1", type: "1on1-recurring", sessionNumber: 7, grossTtd: 200, feeTtd: 30, netTtd: 170, status: "paid" },
  { id: "t3", date: iso(-24*4), studentId: "u3", studentName: "Keshawn Boodoo", lessonId: "l2", lessonName: "CAPE Pure Maths", type: "group-recurring", sessionNumber: 3, grossTtd: 180, feeTtd: 27, netTtd: 153, status: "paid" },
  { id: "t4", date: iso(-24*9), studentId: "u4", studentName: "Sade Williams", lessonId: "l1", lessonName: "CSEC Maths Crash Course", type: "group-recurring", sessionNumber: 4, grossTtd: 120, feeTtd: 18, netTtd: 102, status: "failed" },
  { id: "t5", date: iso(-24*15), studentId: "u5", studentName: "Renée Phillip", lessonId: "l5", lessonName: "English A Diagnostic", type: "1on1-oneoff", grossTtd: 180, feeTtd: 27, netTtd: 153, status: "paid" },
  { id: "t6", date: iso(-24*20), studentId: "u1", studentName: "Aliyah Mohammed", lessonId: "l1", lessonName: "CSEC Maths Crash Course", type: "group-recurring", sessionNumber: 4, grossTtd: 120, feeTtd: 18, netTtd: 102, status: "paid" },
  { id: "t7", date: iso(-24*28), studentId: "u2", studentName: "Devon Charles", lessonId: "l3", lessonName: "Physics 1:1", type: "1on1-recurring", sessionNumber: 6, grossTtd: 200, feeTtd: 30, netTtd: 170, status: "refunded" },
];

export const PLACEHOLDER_PAYOUTS: Payout[] = [
  { id: "p0", date: iso(24*4), amount: 740, method: "WiPay · ••42", status: "Scheduled" },
  { id: "p1", date: iso(-24*10), amount: 1840, method: "WiPay · ••42", status: "Paid" },
  { id: "p2", date: iso(-24*24), amount: 2120, method: "WiPay · ••42", status: "Paid" },
  { id: "p3", date: iso(-24*38), amount: 1560, method: "WiPay · ••42", status: "Paid" },
];

export const PLACEHOLDER_NOTIFS: TutorNotif[] = [
  { id: "nleft1", type: "system", title: "Sade Williams left CSEC Maths Crash Course", body: "Remove them from your WhatsApp group and Google Classroom to revoke external access.", time: "20m ago", unread: true },
  { id: "nrq1", type: "booking", title: "Recurring 1:1 request · Trinity Hosein", body: "CSEC Add. Maths · Sat 10:00 AM AST · weekly. Tap to accept and start a Class.", time: "6h ago", unread: true },
  { id: "nrq2", type: "booking", title: "Recurring 1:1 request · Marcus Ali", body: "CAPE Pure Maths Unit 1 · Wed 6:00 PM AST · weekly.", time: "1d ago", unread: true },
  { id: "nrq3", type: "booking", title: "Recurring 1:1 request · Jada Pierre", body: "CSEC Physics · Sun afternoons.", time: "2d ago", unread: false },
  { id: "n1", type: "booking", title: "New booking from Trinity Hosein", body: "Requested CSEC Add. Maths · Sat 12:00 PM AST.", time: "10m ago", unread: true },
  { id: "n2", type: "payment", title: "Payment received · Aliyah M.", body: "TTD 120 for CSEC Maths Crash Course.", time: "1h ago", unread: true },
  { id: "n3", type: "review", title: "Aliyah Mohammed left a 5-star review", body: "“Patient and explains everything clearly.”", time: "Yesterday", unread: true },
  { id: "n4", type: "message", title: "Sade Williams sent a message", body: "Can we move Tuesday's class to 6 PM?", time: "Yesterday", unread: false },
  { id: "n5", type: "reminder", title: "Session in 30 minutes", body: "1:1 Physics with Devon Charles.", time: "2d ago", unread: false },
  { id: "n6", type: "system", title: "Profile is now public", body: "You're listed and visible to students.", time: "5d ago", unread: false },
];

export const PLACEHOLDER_ACTIVITY: ActivityItem[] = [
  { id: "a1", kind: "inquiry", text: "New inquiry from Renée P. about CSEC English A", at: "2h ago" },
  { id: "a2", kind: "review", text: "Aliyah M. left a 5-star review", at: "Yesterday" },
  { id: "a3", kind: "payout", text: "Payout of TTD 1,840 processed to WiPay", at: "3 days ago" },
  { id: "a4", kind: "booking", text: "Devon C. booked 90 mins for Saturday 4:00 PM", at: "5 days ago" },
];

export const SUBJECT_OPTIONS = [
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

// -------------------- Provider --------------------

type Ctx = {
  profile: TutorProfile;
  setProfile: React.Dispatch<React.SetStateAction<TutorProfile>>;
  patchProfile: (patch: Partial<TutorProfile>) => void;
  completion: {
    avatar: boolean; bio: boolean; subjects: boolean; availability: boolean; rate: boolean; videoProvider: boolean;
    listed: boolean; completed: number; total: number;
  };
};

const C = createContext<Ctx | null>(null);

export function TutorStoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<TutorProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch {}
  }, [profile]);

  const completion = useMemo(() => {
    const c = {
      avatar: !!profile.avatarUrl,
      bio: profile.bio.trim().length >= 150,
      subjects: profile.subjects.length > 0,
      availability: profile.availability.length > 0,
      rate: !!profile.hourlyRateTtd && profile.hourlyRateTtd > 0,
      videoProvider: !!profile.videoProvider,
    };
    const completed = Object.values(c).filter(Boolean).length;
    const total = 6;
    return { ...c, completed, total, listed: completed === total };
  }, [profile]);

  return (
    <C.Provider value={{ profile, setProfile, patchProfile: (p) => setProfile((cur) => ({ ...cur, ...p })), completion }}>
      {children}
    </C.Provider>
  );
}

export function useTutor() {
  const v = useContext(C);
  if (!v) throw new Error("useTutor must be used within TutorStoreProvider");
  return v;
}

export const LESSON_KIND_META: Record<LessonKind, { label: string; short: string; chip: string; dot: string }> = {
  "1on1-oneoff":     { label: "1:1 · One-off",        short: "1:1",   chip: "bg-sky text-ink",         dot: "bg-sky-500" },
  "1on1-recurring":  { label: "1:1 · Recurring",      short: "1:1↻",  chip: "bg-brand-soft text-brand-deep", dot: "bg-brand" },
  "group-oneoff":    { label: "Group · One-off",      short: "Group", chip: "bg-peach text-ink",       dot: "bg-amber-500" },
  "group-recurring": { label: "Group · Recurring",    short: "Group↻",chip: "bg-lavender text-ink",    dot: "bg-purple-500" },
};

// -------------------- New mock data for Class Hub / My Business --------------------

export const PLACEHOLDER_RECURRING_REQUESTS: RecurringRequest[] = [
  { id: "rq1", studentId: "u6", studentName: "Trinity Hosein", initials: "TH", subject: "CSEC Add. Maths", level: "Form 5", preferredTime: "Sat 10:00 AM AST · weekly", message: "Hi Sir, I'd love to do recurring 1:1s before my exam. I'm weak on calculus.", receivedAt: iso(-6) },
  { id: "rq2", studentId: "u7", studentName: "Marcus Ali", initials: "MA", subject: "CAPE Pure Maths · Unit 1", level: "Lower 6", preferredTime: "Wed 6:00 PM AST · weekly", message: "Looking for a long-term tutor through Unit 1. Budget flexible.", receivedAt: iso(-24) },
  { id: "rq3", studentId: "u8", studentName: "Jada Pierre", initials: "JP", subject: "CSEC Physics", level: "Form 5", preferredTime: "Sun afternoons", message: "Need help with lab reports and SBA.", receivedAt: iso(-48) },
];

// Suggested questions shown as helper text in the editor. The tutor writes
// ONE narrative report — these are just thinking prompts, not separate fields.
export const FEEDBACK_PROMPTS: { question: string }[] = [
  { question: "What did the student work on this month?" },
  { question: "Where did they shine? (a specific strength)" },
  { question: "Where are they still struggling?" },
  { question: "How was their engagement and attitude?" },
  { question: "What's your recommendation for next month?" },
];

export const PLACEHOLDER_FEEDBACK_DRAFTS: FeedbackDraft[] = [
  {
    id: "fb1", studentId: "u1", studentName: "Aliyah Mohammed", initials: "AM",
    lessonId: "l1", lessonName: "CSEC Maths Crash Course", month: "May 2026",
    status: "pending",
    stats: { attendance: "100%", sessionsAttended: 4, sessionsScheduled: 4 },
    body: "",
  },
  {
    id: "fb2", studentId: "u2", studentName: "Devon Charles", initials: "DC",
    lessonId: "l3", lessonName: "Physics 1:1", month: "May 2026",
    status: "pending",
    stats: { attendance: "75%", sessionsAttended: 3, sessionsScheduled: 4 },
    body: "",
  },
  {
    id: "fb3", studentId: "u4", studentName: "Sade Williams", initials: "SW",
    lessonId: "l1", lessonName: "CSEC Maths Crash Course", month: "May 2026",
    status: "pending",
    stats: { attendance: "50%", sessionsAttended: 2, sessionsScheduled: 4 },
    body: "",
  },
  {
    id: "fb4", studentId: "u3", studentName: "Keshawn Boodoo", initials: "KB",
    lessonId: "l2", lessonName: "CAPE Pure Maths · Unit 1", month: "May 2026",
    status: "approved",
    stats: { attendance: "100%", sessionsAttended: 4, sessionsScheduled: 4 },
    refinedByAi: true,
    body: "Keshawn continued through Unit 1 this month — differentiation, integration techniques, and a full diagnostic. He topped the cohort on the diagnostic (94%) and calculus is now genuinely a strength. He still rushes multi-step word problems and loses small marks on careless errors. Engagement was excellent throughout: always prepared, often asks ahead. Next month I'd like to begin informal Unit 2 preview work and aim for Grade I prep over the next term.",
  },
];

// Promotion explanations (used by Promotions UI)
export const PROMO_INFO: Record<PromotionKind, { title: string; blurb: string }> = {
  "early-bird":   { title: "Early-bird", blurb: "The first set number of students to join pay a reduced price. Once that cap is hit, the price returns to normal." },
  "time-limited": { title: "Time-limited", blurb: "Everyone who joins before the end date gets the discounted price. After the date, price reverts." },
  "open-ended":   { title: "Open-ended", blurb: "An ongoing discount with no end date. Stays active until you remove it manually." },
};

export const PLACEHOLDER_STREAM_POSTS: StreamPost[] = [
  { id: "sp1", kind: "announcement", title: "📌 Bring past-paper booklets to Saturday's session", body: "Make sure you have the 2019–2023 CSEC Maths booklet printed and on hand. We'll work through Paper 2 Q1–5 together.", at: "Pinned · 2 days ago", pinned: true },
  { id: "sp2", kind: "announcement", title: "Saturday session recap", body: "We covered simultaneous equations and word-problem translation. Next session: trig identities deep-dive — please review chapter 8 beforehand.", at: "Yesterday" },
  { id: "sp3", kind: "attachment", title: "Worksheet · Trig Identities Drill", body: "20 questions, answer key included. Due before next session.", at: "Yesterday", attachmentName: "trig-drill-w8.pdf" },
  { id: "sp4", kind: "link", title: "Useful video · Khan Academy Trig Identities", body: "10-minute primer before Saturday's class.", at: "3 days ago", linkUrl: "https://khanacademy.org/math/trigonometry" },
  { id: "sp5", kind: "announcement", title: "Welcome to the cohort!", body: "Looking forward to a great term. Bring your textbook and a positive attitude.", at: "1 week ago" },
];

// Payment grid helpers
export const PAYMENT_PERIODS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"] as const;
export type PaymentCellStatus = "paid" | "due" | "overdue" | "waived" | "n/a";
export function generatePaymentGrid(members: EnrolledStudent[]): Record<string, Record<string, PaymentCellStatus>> {
  const out: Record<string, Record<string, PaymentCellStatus>> = {};
  members.forEach((m, mi) => {
    out[m.studentId] = {};
    PAYMENT_PERIODS.forEach((p, pi) => {
      // Deterministic-ish placeholder distribution
      const seed = (mi * 7 + pi * 3) % 11;
      let s: PaymentCellStatus = "paid";
      if (m.paymentStatus === "overdue" && pi >= PAYMENT_PERIODS.length - 2) s = "overdue";
      else if (m.paymentStatus === "pending" && pi === PAYMENT_PERIODS.length - 1) s = "due";
      else if (pi === PAYMENT_PERIODS.length - 1 && seed > 7) s = "due";
      else if (seed === 0) s = "waived";
      else s = "paid";
      // future-ish gating
      if (pi >= PAYMENT_PERIODS.length) s = "n/a";
      out[m.studentId][p] = s;
    });
  });
  return out;
}

export const PAYMENT_STATUS_META: Record<PaymentCellStatus, { label: string; chip: string }> = {
  paid:    { label: "Paid",    chip: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  due:     { label: "Due",     chip: "bg-amber-100 text-amber-800 border-amber-200" },
  overdue: { label: "Overdue", chip: "bg-rose-100 text-rose-700 border-rose-200" },
  waived:  { label: "Waived",  chip: "bg-slate-100 text-slate-600 border-slate-200" },
  "n/a":   { label: "—",       chip: "bg-muted text-muted-foreground border-border" },
};

export const MEMBER_STATUS_META: Record<MemberStatus, { label: string; chip: string }> = {
  invited:   { label: "Invited",   chip: "bg-sky-100 text-sky-700 border-sky-200" },
  active:    { label: "Active",    chip: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  suspended: { label: "Suspended", chip: "bg-amber-100 text-amber-800 border-amber-200" },
  banned:    { label: "Banned",    chip: "bg-rose-100 text-rose-700 border-rose-200" },
  removed:   { label: "Removed",   chip: "bg-slate-100 text-slate-600 border-slate-200" },
};

