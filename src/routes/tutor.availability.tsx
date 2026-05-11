import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tutor/availability")({
  component: AvailabilityPage,
});

function AvailabilityPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Availability</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your weekly availability for student bookings.</p>
      </header>
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Availability is edited from the Get-listed page so it stays in sync with profile completion.
        </p>
        <Link to="/tutor/get-listed" className="mt-4 inline-flex px-5 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand/90">
          Edit availability
        </Link>
        {/* TODO(cursor): break out availability editor as a standalone component shared by both pages. */}
      </div>
    </div>
  );
}
