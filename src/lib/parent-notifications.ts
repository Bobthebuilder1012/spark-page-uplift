// Parent notifications — UI-only mock data.

export type ParentNotifType =
  | "consent-request"   // child started a join, parent needs to consent + pay
  | "payment"           // a charge succeeded
  | "renewal-reminder"  // upcoming auto-renewal
  | "feedback"          // new monthly feedback report
  | "suspended";        // child suspended from a class

export type ParentNotif = {
  id: string;
  type: ParentNotifType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  href?: string;
};

export const PARENT_NOTIFS: ParentNotif[] = [
  { id: "n1", type: "consent-request", title: "Aliyah requested to join Essay Lab", body: "Mr. Joseph's class — TT$160/month. Review and approve to confirm her seat.", time: "10m ago", unread: true, href: "/parent/billing" },
  { id: "n2", type: "feedback", title: "May feedback report ready", body: "Mr. Ramdeen sent Aliyah's monthly report for CSEC Maths Mastery.", time: "2h ago", unread: true, href: "/parent/children" },
  { id: "n3", type: "renewal-reminder", title: "Renewal in 3 days", body: "CSEC Maths Mastery will auto-renew on 1 June for TT$220.", time: "Yesterday", unread: true, href: "/parent/billing" },
  { id: "n4", type: "payment", title: "Payment received — TT$160", body: "Physics Power Hour renewal for Devon Charles.", time: "2d ago", unread: false, href: "/parent/billing" },
  { id: "n5", type: "suspended", title: "Devon was marked absent 3× in a row", body: "Ms. Khan has paused Devon's enrollment in SEA Sprint Friday. Reach out to discuss.", time: "5d ago", unread: false, href: "/parent/children" },
  { id: "n6", type: "payment", title: "Refund processed — TT$140", body: "SEA Sprint Friday — refunded within first-week guarantee.", time: "1w ago", unread: false, href: "/parent/billing" },
];
