import { createFileRoute } from "@tanstack/react-router";
import { StudentShell } from "@/components/student/StudentShell";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student dashboard — iTutor" },
      { name: "description", content: "Your iTutor student workspace: lessons, tutors, curriculum and bookings in one place." },
    ],
  }),
  component: StudentShell,
});
