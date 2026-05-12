import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Bell, Lock, Wallet, GraduationCap, ChevronRight, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useTutor } from "@/lib/tutor-store";

export const Route = createFileRoute("/tutor/settings")({
  head: () => ({ meta: [{ title: "Settings — iTutor Tutor" }] }),
  component: Settings,
});

const SECTIONS = [
  { id: "profile", label: "Account", icon: User },
  { id: "teaching", label: "Teaching", icon: GraduationCap },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "payouts", label: "Payouts", icon: Wallet },
];

function Settings() {
  const { profile } = useTutor();
  const [section, setSection] = useState("profile");
  const [notif, setNotif] = useState({
    bookings: true, sessionReminders: true, payments: true,
    messages: true, reviews: true, platform: false, sms: true, push: true,
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account, teaching, and payouts</p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition group",
                  active ? "bg-background border border-border text-ink" : "text-muted-foreground hover:bg-background")}>
                <Icon className="size-4" />
                <span className="flex-1 text-left">{s.label}</span>
                <ChevronRight className={cn("size-3.5 transition", active && "text-brand-deep")} />
              </button>
            );
          })}
        </nav>

        <div className="rounded-2xl bg-background border border-border p-6 space-y-6">
          {section === "profile" && (
            <>
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <div className="relative">
                  <div className="size-20 rounded-full bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-white text-2xl font-semibold">{profile.initials}</div>
                  <button className="absolute -bottom-1 -right-1 size-7 rounded-full bg-background border border-border grid place-items-center hover:bg-muted">
                    <Camera className="size-3.5" />
                  </button>
                </div>
                <div>
                  <div className="font-semibold text-ink">{profile.name}</div>
                  <div className="text-sm text-muted-foreground">{profile.email}</div>
                </div>
              </div>
              <Field label="Display name" defaultValue={profile.name} />
              <Field label="Email" defaultValue={profile.email} type="email" />
              <Field label="Phone" defaultValue={profile.phone} />
              <SaveBar />
            </>
          )}

          {section === "teaching" && (
            <>
              <Field label="Hourly rate (TTD)" type="number" defaultValue={String(profile.hourlyRateTtd ?? "")} />
              <Select label="Default session length" options={["30 min", "45 min", "60 min", "90 min", "120 min"]} value="60 min" />
              <Select label="Booking window" options={["12 hours notice", "24 hours notice", "48 hours notice", "72 hours notice"]} value="24 hours notice" />
              <div>
                <label className="text-sm font-medium text-ink mb-2 block">Subjects teaching</label>
                <p className="text-xs text-muted-foreground mb-2">The subjects you currently offer to students.</p>
                <div className="flex flex-wrap gap-2">
                  {["CSEC Mathematics", "CSEC Physics", "CSEC Chemistry", "CAPE Pure Maths", "CAPE Physics Unit 1", "Add. Maths"].map((s, i) => (
                    <button key={s} className={cn("px-3 py-1.5 rounded-full text-sm font-medium border",
                      i < 3 ? "bg-brand-soft text-forest border-brand" : "bg-background text-muted-foreground border-border hover:border-ink/30")}>{s}</button>
                  ))}
                  <button className="px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-border text-muted-foreground hover:border-brand hover:text-brand-deep">+ Add subject</button>
                </div>
              </div>
              <SaveBar />
            </>
          )}

          {section === "notifications" && (
            <>
              <SectionHead title="Categories" desc="Choose what to be notified about" />
              {[
                { key: "bookings", label: "New bookings", desc: "When a student requests a new lesson" },
                { key: "sessionReminders", label: "Session reminders", desc: "30 minutes before each session" },
                { key: "payments", label: "Payment received", desc: "When you're paid for a session" },
                { key: "messages", label: "Student messages", desc: "Direct messages from students" },
                { key: "reviews", label: "New reviews", desc: "When students leave reviews" },
                { key: "platform", label: "Platform updates", desc: "Product news and tips" },
              ].map((n) => (
                <ToggleRow key={n.key} label={n.label} desc={n.desc} checked={notif[n.key as keyof typeof notif]} onChange={(v) => setNotif({ ...notif, [n.key]: v })} />
              ))}
              <div className="pt-4 border-t border-border">
                <SectionHead title="Channels" desc="How you want to receive notifications" />
                <ToggleRow label="Email" desc="Sent to your registered email" checked={true} onChange={() => {}} />
                <ToggleRow label="SMS" desc="Critical alerts via text" checked={notif.sms} onChange={(v) => setNotif({ ...notif, sms: v })} />
                <ToggleRow label="Push notifications" desc="Mobile/desktop browser push" checked={notif.push} onChange={(v) => setNotif({ ...notif, push: v })} />
              </div>
            </>
          )}

          {section === "security" && (
            <>
              <Field label="Current password" type="password" defaultValue="••••••••" />
              <Field label="New password" type="password" defaultValue="" />
              <Field label="Confirm new password" type="password" defaultValue="" />
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-ink text-sm">Two-factor authentication</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security to your account.</div>
                  </div>
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-peach text-ink">Coming soon</span>
                </div>
              </div>
              <SaveBar label="Update password" />
            </>
          )}

          {section === "payouts" && (
            <>
              <div className="rounded-2xl bg-mint p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Connected bank account</div>
                  <div className="font-semibold text-ink mt-1">Republic Bank · ending ••42</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Payouts deposit directly into this account.</div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep">Manage</button>
              </div>
              <Select label="Payout frequency" options={["Weekly (Friday)", "Bi-weekly", "Monthly"]} value="Bi-weekly" />
              <Field label="Minimum payout (TTD)" type="number" defaultValue="200" />
              <div>
                <div className="text-sm font-medium text-ink mb-3">Tax information</div>
                <button className="w-full p-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-brand hover:text-brand-deep">+ Upload BIR documents</button>
              </div>
              <SaveBar />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div>
        <div className="font-medium text-ink text-sm">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
function SectionHead({ title, desc }: { title: string; desc: string }) {
  return <div className="mb-1"><div className="text-sm font-semibold text-ink">{title}</div><div className="text-xs text-muted-foreground">{desc}</div></div>;
}
function Field({ label, type = "text", defaultValue }: { label: string; type?: string; defaultValue?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink mb-1.5 block">{label}</label>
      <input type={type} defaultValue={defaultValue}
        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" />
    </div>
  );
}
function Select({ label, options, value }: { label: string; options: string[]; value: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink mb-1.5 block">{label}</label>
      <select defaultValue={value} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function SaveBar({ label = "Save changes" }: { label?: string }) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t border-border">
      <button className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted">Cancel</button>
      <button className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep">{label}</button>
    </div>
  );
}
