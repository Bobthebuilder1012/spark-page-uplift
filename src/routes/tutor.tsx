import { createFileRoute } from "@tanstack/react-router";
import { TutorShell } from "@/components/tutor/TutorShell";

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "Tutor workspace — iTutor" },
      { name: "description", content: "Manage your iTutor profile, lessons, sessions, students and earnings." },
    ],
  }),
  component: TutorShell,
});
