import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Calculator, Lock, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/student/curriculum")({
  head: () => ({
    meta: [{ title: "Curriculum & tools — iTutor Student" }],
  }),
  component: Curriculum,
});

const UNITS = [
  { title: "Number theory", progress: 100, lessons: 8, status: "done" },
  { title: "Algebra", progress: 100, lessons: 12, status: "done" },
  { title: "Functions", progress: 65, lessons: 10, status: "active" },
  { title: "Trigonometry", progress: 0, lessons: 9, status: "locked" },
  { title: "Calculus", progress: 0, lessons: 14, status: "locked" },
];

const TOOLS = [
  { name: "Past papers", desc: "10+ years of CSEC & CAPE papers", icon: FileText, tint: "bg-sky/40" },
  { name: "Practice quiz", desc: "Adaptive questions, instant feedback", icon: Sparkles, tint: "bg-coral-soft" },
  { name: "Calculator", desc: "Scientific & graphing", icon: Calculator, tint: "bg-lavender/60" },
  { name: "Formula sheet", desc: "Quick reference for every subject", icon: BookOpen, tint: "bg-brand-soft" },
];

function Curriculum() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Curriculum & tools</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your progress and access study resources</p>
      </div>

      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="bg-background border border-border p-1 h-11 rounded-2xl">
          <TabsTrigger value="curriculum" className="rounded-xl px-4 data-[state=active]:bg-brand-soft data-[state=active]:text-forest">Curriculum</TabsTrigger>
          <TabsTrigger value="tools" className="rounded-xl px-4 data-[state=active]:bg-brand-soft data-[state=active]:text-forest">Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="mt-6 space-y-6">
          {/* Subject picker */}
          <div className="flex gap-2 overflow-x-auto">
            {["Mathematics", "Physics", "English Lit", "Chemistry"].map((s, i) => (
              <button
                key={s}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border ${i === 0 ? "bg-ink text-white border-ink" : "bg-background border-border text-muted-foreground"}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Path */}
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border" />
            <div className="space-y-3">
              {UNITS.map((u, i) => (
                <motion.div
                  key={u.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex items-center gap-4 pl-1"
                >
                  <div className={`relative z-10 size-12 rounded-2xl grid place-items-center font-bold text-sm ${
                    u.status === "done" ? "bg-brand text-white" :
                    u.status === "active" ? "bg-coral text-white ring-4 ring-coral-soft" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {u.status === "done" ? <CheckCircle2 className="size-5" /> :
                     u.status === "locked" ? <Lock className="size-4" /> : i + 1}
                  </div>
                  <div className={`flex-1 rounded-2xl border p-4 ${u.status === "locked" ? "bg-muted/40 border-border opacity-60" : "bg-background border-border"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-ink">{u.title}</div>
                        <div className="text-xs text-muted-foreground">{u.lessons} lessons</div>
                      </div>
                      {u.status === "active" && (
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep">
                          <PlayCircle className="size-4" /> Continue
                        </button>
                      )}
                      {u.status === "done" && (
                        <span className="text-xs font-semibold text-brand-deep">100%</span>
                      )}
                    </div>
                    {u.progress > 0 && u.progress < 100 && (
                      <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand to-brand-deep rounded-full" style={{ width: `${u.progress}%` }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="mt-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {TOOLS.map((t) => (
              <button key={t.name} className="text-left rounded-3xl bg-background border border-border p-5 hover:shadow-card hover:-translate-y-0.5 transition">
                <div className={`size-12 rounded-2xl ${t.tint} grid place-items-center mb-3`}>
                  <t.icon className="size-5 text-forest" />
                </div>
                <div className="font-semibold text-ink">{t.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{t.desc}</div>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
