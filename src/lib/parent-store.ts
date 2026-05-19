// Parent dashboard mock data — UI only, no backend.

export type PaymentStatus = "paid" | "pending-consent" | "overdue" | "refunded";
export type EnrollmentStatus = "active" | "awaiting-consent" | "awaiting-approval" | "cancelled";

export type ChildEnrollment = {
  classId: string;
  classTitle: string;
  classEmoji: string;
  tutorName: string;
  subject: string;
  level: string;
  schedule: string;       // "Mondays · 5:00–7:00 PM"
  price: number;          // TTD per period
  billing: "per-month" | "per-session" | "prepaid";
  status: EnrollmentStatus;
  paidThrough?: string;   // e.g. "30 June 2026"
  nextSession?: string;   // e.g. "Mon 26 May · 5:00 PM"
  enrolledSince: string;  // "March 2026"
};

export type FeedbackReport = {
  id: string;
  childId: string;
  classId: string;
  classTitle: string;
  tutorName: string;
  month: string;          // "May 2026"
  deliveredAt: string;    // ISO
  stats: {
    attendance: string;            // "100%"
    sessionsAttended: number;
    sessionsScheduled: number;
    enrollmentLength: string;      // "3 months"
  };
  body: string;
};

export type Child = {
  id: string;
  name: string;
  initials: string;
  hue: number;
  ageLabel: string;       // "Form 5 · 16 yrs"
  school?: string;
  enrollments: ChildEnrollment[];
  feedback: FeedbackReport[];
};

export type PaymentEntry = {
  id: string;
  date: string;                  // "12 May 2026"
  childName: string;
  classTitle: string;
  kind: "consent" | "renewal" | "refund" | "one-off";
  amount: number;                // positive; refunds shown with negative tone
  status: PaymentStatus;
  method: string;                // "Visa •• 4242"
  note?: string;
};

/* -------------------- Mock children -------------------- */

export const CHILDREN: Child[] = [
  {
    id: "aliyah",
    name: "Aliyah Mohammed",
    initials: "AM",
    hue: 145,
    ageLabel: "Form 5 · 16 yrs",
    school: "Bishop Anstey High",
    enrollments: [
      {
        classId: "csec-maths-mastery",
        classTitle: "CSEC Maths Mastery",
        classEmoji: "📐",
        tutorName: "Mr. Ramdeen",
        subject: "Mathematics", level: "CSEC",
        schedule: "Mondays · 5:00–7:00 PM AST",
        price: 220, billing: "per-month",
        status: "active",
        paidThrough: "30 June 2026",
        nextSession: "Mon 26 May · 5:00 PM",
        enrolledSince: "March 2026",
      },
      {
        classId: "essay-lab",
        classTitle: "Essay Lab",
        classEmoji: "📚",
        tutorName: "Mr. Joseph",
        subject: "English Lit", level: "CSEC",
        schedule: "Tuesdays · 6:00–7:30 PM AST",
        price: 160, billing: "per-month",
        status: "awaiting-approval",
        nextSession: "—",
        enrolledSince: "Requested May 2026",
      },
    ],
    feedback: [
      {
        id: "fb1",
        childId: "aliyah",
        classId: "csec-maths-mastery",
        classTitle: "CSEC Maths Mastery",
        tutorName: "Mr. Ramdeen",
        month: "May 2026",
        deliveredAt: "2026-05-30T14:00:00Z",
        stats: { attendance: "100%", sessionsAttended: 4, sessionsScheduled: 4, enrollmentLength: "3 months" },
        body: "Aliyah continued through the algebra-to-calculus arc this month, with strong work on simultaneous equations and quadratics. She topped the class on the diagnostic and her confidence is clearly building — she's now the first to volunteer for the harder questions. The one area to keep watching is multi-step word problems, where she's still rushing the setup and losing a mark or two. Next month we'll do two timed Paper 2 mocks and revisit trig identities ahead of the exam. Overall: an excellent month.",
      },
      {
        id: "fb2",
        childId: "aliyah",
        classId: "csec-maths-mastery",
        classTitle: "CSEC Maths Mastery",
        tutorName: "Mr. Ramdeen",
        month: "April 2026",
        deliveredAt: "2026-04-30T14:00:00Z",
        stats: { attendance: "100%", sessionsAttended: 4, sessionsScheduled: 4, enrollmentLength: "2 months" },
        body: "A strong month. Aliyah completed every piece of homework and asked excellent clarifying questions in class. Trig is now genuinely solid. Recommended focus for May: word-problem translation and Paper 2 timing.",
      },
      {
        id: "fb3",
        childId: "aliyah",
        classId: "csec-maths-mastery",
        classTitle: "CSEC Maths Mastery",
        tutorName: "Mr. Ramdeen",
        month: "March 2026",
        deliveredAt: "2026-03-31T14:00:00Z",
        stats: { attendance: "75%", sessionsAttended: 3, sessionsScheduled: 4, enrollmentLength: "1 month" },
        body: "Settled in well after a slightly nervy first week. Engagement picked up sharply by week 3 and she's now contributing freely in class. Missed one session due to school commitments — caught up via the recording.",
      },
    ],
  },
  {
    id: "devon",
    name: "Devon Charles",
    initials: "DC",
    hue: 220,
    ageLabel: "Form 3 · 13 yrs",
    school: "Fatima College",
    enrollments: [
      {
        classId: "physics-power-hour",
        classTitle: "Physics Power Hour",
        classEmoji: "⚛️",
        tutorName: "Mr. Ramdeen",
        subject: "Physics", level: "CSEC",
        schedule: "Wednesdays · 4:00–6:00 PM AST",
        price: 160, billing: "per-month",
        status: "active",
        paidThrough: "30 June 2026",
        nextSession: "Wed 28 May · 4:00 PM",
        enrolledSince: "February 2026",
      },
    ],
    feedback: [],
  },
];

/* -------------------- Mock payment history -------------------- */

export const PAYMENT_HISTORY: PaymentEntry[] = [
  { id: "p1", date: "1 June 2026",  childName: "Aliyah Mohammed", classTitle: "CSEC Maths Mastery", kind: "renewal", amount: 220, status: "paid", method: "Visa •• 4242" },
  { id: "p2", date: "1 June 2026",  childName: "Devon Charles",   classTitle: "Physics Power Hour", kind: "renewal", amount: 160, status: "paid", method: "Visa •• 4242" },
  { id: "p3", date: "18 May 2026",  childName: "Aliyah Mohammed", classTitle: "Essay Lab",           kind: "consent",  amount: 0,   status: "pending-consent", method: "—", note: "Awaiting tutor approval before first charge" },
  { id: "p4", date: "1 May 2026",   childName: "Aliyah Mohammed", classTitle: "CSEC Maths Mastery", kind: "renewal", amount: 220, status: "paid", method: "Visa •• 4242" },
  { id: "p5", date: "1 May 2026",   childName: "Devon Charles",   classTitle: "Physics Power Hour", kind: "renewal", amount: 160, status: "paid", method: "Visa •• 4242" },
  { id: "p6", date: "12 April 2026", childName: "Aliyah Mohammed", classTitle: "SEA Sprint Friday",  kind: "refund",  amount: -140, status: "refunded", method: "Visa •• 4242", note: "Refunded after unenrollment within first week" },
  { id: "p7", date: "1 April 2026", childName: "Aliyah Mohammed", classTitle: "CSEC Maths Mastery", kind: "renewal", amount: 220, status: "paid", method: "Visa •• 4242" },
  { id: "p8", date: "1 March 2026", childName: "Aliyah Mohammed", classTitle: "CSEC Maths Mastery", kind: "consent",  amount: 220, status: "paid", method: "Visa •• 4242", note: "Initial consent + first-month charge" },
  { id: "p9", date: "1 February 2026", childName: "Devon Charles", classTitle: "Physics Power Hour", kind: "consent",  amount: 160, status: "paid", method: "Visa •• 4242", note: "Initial consent + first-month charge" },
];

export function findChild(id: string): Child | undefined {
  return CHILDREN.find((c) => c.id === id);
}

export function paymentStatusForChild(child: Child): "all-paid" | "overdue" | "pending" {
  if (child.enrollments.some((e) => e.status === "awaiting-consent")) return "pending";
  if (child.enrollments.some((e) => e.status === "awaiting-approval")) return "pending";
  return "all-paid";
}
