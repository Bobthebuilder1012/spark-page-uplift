import { createFileRoute, redirect } from "@tanstack/react-router";

// Booking lives on the tutor profile now — this route just redirects there.
export const Route = createFileRoute("/student/tutors/$id/book")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/student/tutors/$id",
      params: { id: params.id },
      hash: "book",
    });
  },
  component: () => null,
});
