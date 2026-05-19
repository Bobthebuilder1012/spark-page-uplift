import { createFileRoute } from "@tanstack/react-router";
import { ParentShell } from "@/components/parent/ParentShell";

export const Route = createFileRoute("/parent")({
  component: ParentShell,
});
