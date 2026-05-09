import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Bell, Lock, CreditCard, GraduationCap, ChevronRight, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/student/settings")({
  head: () => ({
    meta: [{ title: "Settings — iTutor Student" }],
  }),
  component: Settings,
});

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "academic", label: "Academic", icon: GraduationCap },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "billing", label: "Billing", icon: CreditCard },
];


function Settings() {
  const [section, setSection] = useState("profile");
  const [notif, setNotif] = useState({ lessons: true, reminders: true, marketing: false, sms: false });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Side nav */}
        <nav className="space-y-1">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition group",
                  active ? "bg-background border border-border text-ink" : "text-muted-foreground hover:bg-background"
                )}
              >
                <Icon className="size-4" />
                <span className="flex-1 text-left">{s.label}</span>
                <ChevronRight className={cn("size-3.5 transition", active && "text-brand-deep")} />
              </button>
            );
          })}
        </nav>

        {/* Panel */}
        <div className="rounded-2xl bg-background border border-border p-6 space-y-6">
          {section === "profile" && (
            <>
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <div className="relative">
                  <div className="size-20 rounded-full bg-gradient-to-br from-brand to-brand-deep grid place-items-center text-white text-2xl font-semibold">AM</div>
                  <button className="absolute -bottom-1 -right-1 size-7 rounded-full bg-background border border-border grid place-items-center hover:bg-muted">
                    <Camera className="size-3.5" />
                  </button>
                </div>
                <div>
                  <div className="font-semibold text-ink">Aliyah Mohammed</div>
                  <div className="text-sm text-muted-foreground">aliyah.m@email.com</div>
                </div>
              </div>
              <Field label="Full name" defaultValue="Aliyah Mohammed" />
              <Field label="Email" defaultValue="aliyah.m@email.com" type="email" />
              <Field label="Phone" defaultValue="+1 868 555 0142" />
              <SaveBar />
            </>
          )}

          {section === "academic" && (
            <>
              <Select label="Education level" options={["Primary (SEA)", "Form 1-3", "Form 4-5 (CSEC)", "Form 6 (CAPE)"]} value="Form 4-5 (CSEC)" />
              <Select label="School" options={["Naparima Girls' High", "St. Augustine Girls' High", "Bishop Anstey", "Other"]} value="Naparima Girls' High" />
              <div>
                <label className="text-sm font-medium text-ink mb-2 block">Subjects you study</label>
                <div className="flex flex-wrap gap-2">
                  {["Mathematics", "English A", "English B", "Physics", "Chemistry", "Biology", "Spanish", "POB"].map((s, i) => (
                    <button key={s} className={cn("px-3 py-1.5 rounded-full text-sm font-medium border", i < 4 ? "bg-brand-soft text-forest border-brand" : "bg-background text-muted-foreground border-border hover:border-ink/30")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <SaveBar />
            </>
          )}

          {section === "notifications" && (
            <>
              {[
                { key: "lessons", label: "Lesson reminders", desc: "Notify me 30 min before each lesson" },
                { key: "reminders", label: "Homework reminders", desc: "Daily check-ins for assignments" },
                { key: "marketing", label: "Tips & promotions", desc: "Study tips, offers, new tutors" },
                { key: "sms", label: "SMS alerts", desc: "Critical reminders via text message" },
              ].map((n) => (
                <div key={n.key} className="flex items-start justify-between gap-4 py-1">
                  <div>
                    <div className="font-medium text-ink text-sm">{n.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{n.desc}</div>
                  </div>
                  <Switch checked={notif[n.key as keyof typeof notif]} onCheckedChange={(v) => setNotif({ ...notif, [n.key]: v })} />
                </div>
              ))}
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
                    <div className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security</div>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-forest">Enable</button>
                </div>
              </div>
              <SaveBar label="Update password" />
            </>
          )}

          {section === "billing" && (
            <>
              <div className="rounded-2xl bg-mint p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current plan</div>
                  <div className="font-semibold text-ink mt-1">Pay-as-you-go</div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep">Upgrade</button>
              </div>
              <div>
                <div className="text-sm font-medium text-ink mb-3">Payment methods</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                    <div className="w-10 h-7 rounded bg-gradient-to-br from-ink to-forest grid place-items-center text-white text-[10px] font-bold">VISA</div>
                    <div className="flex-1 text-sm">•••• 4242 <span className="text-muted-foreground">· exp 09/27</span></div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-soft text-forest font-semibold">Default</span>
                  </div>
                  <button className="w-full p-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-brand hover:text-brand-deep">+ Add payment method</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", defaultValue }: { label: string; type?: string; defaultValue?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink mb-1.5 block">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
      />
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
