import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tutor/settings")({
  component: SettingsPage,
});

const SECTIONS = [
  { title: "Account", items: ["Display name", "Email address", "Password"] },
  { title: "Notifications", items: ["Email notifications", "SMS reminders", "New booking alerts"] },
  { title: "Payouts", items: ["Bank account", "Payout schedule", "Tax information"] },
  { title: "Security", items: ["Two-factor authentication", "Active sessions", "Login history"] },
];

function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Account, notifications, payouts and security.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <section key={s.title} className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold text-ink">{s.title}</h2>
            <ul className="mt-3 divide-y divide-border">
              {s.items.map((it) => (
                <li key={it} className="py-2.5 flex items-center justify-between text-sm">
                  <span className="text-ink">{it}</span>
                  <button className="text-xs font-semibold text-brand-deep hover:underline">Edit</button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {/* TODO(cursor): wire each setting to backend; gate sensitive actions behind auth re-confirm. */}
    </div>
  );
}
