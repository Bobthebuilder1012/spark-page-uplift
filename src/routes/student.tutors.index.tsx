import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Star, Heart, MapPin, Sparkles, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";

const searchSchema = z.object({ q: fallback(z.string(), "").default("") });

export const Route = createFileRoute("/student/tutors/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [{ title: "Find tutors — iTutor Student" }],
  }),
  component: FindTutors,
});

const TUTORS = [
  { id: "ramdeen", name: "Mr. Ramdeen", subject: "Mathematics", level: "CSEC · CAPE", rating: 4.9, reviews: 128, price: 120, nextSlot: "Today 6:00 PM", tags: ["Top rated", "10+ years"], color: "from-brand to-brand-deep" },
  { id: "singh", name: "Ms. Singh", subject: "Physics", level: "CSEC · CAPE", rating: 4.8, reviews: 94, price: 110, nextSlot: "Tomorrow 4:00 PM", tags: ["UWI grad"], color: "from-sky to-lavender" },
  { id: "joseph", name: "Mr. Joseph", subject: "English Lit", level: "CSEC", rating: 4.95, reviews: 211, price: 100, nextSlot: "Today 8:00 PM", tags: ["Top rated"], color: "from-coral to-peach" },
  { id: "ali", name: "Ms. Ali", subject: "Biology", level: "CSEC · CAPE", rating: 4.7, reviews: 67, price: 115, nextSlot: "Wed 5:00 PM", tags: ["New"], color: "from-lavender to-brand-soft" },
  { id: "thomas", name: "Mr. Thomas", subject: "Chemistry", level: "CAPE", rating: 4.85, reviews: 142, price: 130, nextSlot: "Tomorrow 7:00 PM", tags: ["PhD"], color: "from-brand-deep to-forest" },
  { id: "khan", name: "Ms. Khan", subject: "SEA Prep", level: "Primary", rating: 4.92, reviews: 178, price: 80, nextSlot: "Today 5:30 PM", tags: ["Top rated", "5+ years"], color: "from-peach to-coral" },
];

const CHIPS = ["All", "Maths", "English", "Physics", "Chemistry", "Biology", "SEA"];

function FindTutors() {
  const [active, setActive] = useState("All");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const list = active === "All" ? TUTORS : TUTORS.filter((t) => t.subject.toLowerCase().includes(active.toLowerCase()) || (active === "SEA" && t.subject === "SEA Prep"));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">Find your tutor</h1>
        <p className="text-sm text-muted-foreground mt-1">{TUTORS.length} verified Caribbean tutors available</p>
      </div>

      {/* Search bar */}
      <div className="rounded-2xl bg-background border border-border p-2 flex items-center gap-2 shadow-sm">
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="Search by subject, name, or topic…"
            className="flex-1 bg-transparent outline-none text-sm py-2"
          />
        </div>
        <button className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-xl">
          <SlidersHorizontal className="size-4" /> Filters
        </button>
        <button className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep transition">
          Search
        </button>
      </div>

      {/* Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border",
              active === c
                ? "bg-ink text-white border-ink"
                : "bg-background text-muted-foreground border-border hover:border-ink/30"
            )}
          >
            {c}
          </button>
        ))}
        <div className="ml-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-coral-soft text-coral whitespace-nowrap">
          <Sparkles className="size-3.5" /> Available this week
        </div>
      </div>

      {/* Tutor grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((t) => (
          <Link
            key={t.id}
            to="/student/tutors/$id"
            params={{ id: t.id }}
            className="group rounded-3xl bg-background border border-border overflow-hidden hover:shadow-card transition-all hover:-translate-y-0.5"
          >
            <div className={`relative h-32 bg-gradient-to-br ${t.color} flex items-end p-4`}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSaved((s) => {
                    const n = new Set(s);
                    n.has(t.id) ? n.delete(t.id) : n.add(t.id);
                    return n;
                  });
                }}
                className="absolute top-3 right-3 size-8 rounded-full bg-white/90 backdrop-blur grid place-items-center hover:bg-white"
              >
                <Heart className={cn("size-4", saved.has(t.id) ? "fill-coral text-coral" : "text-ink")} />
              </button>
              <div className="size-16 rounded-2xl bg-white grid place-items-center text-xl font-bold text-forest shadow-md">
                {t.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
              </div>
              {t.tags.includes("Top rated") && (
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-forest uppercase tracking-wider">★ Top rated</span>
              )}
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-ink">{t.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="size-3.5 fill-coral text-coral" />
                    <span className="font-semibold">{t.rating}</span>
                    <span className="text-muted-foreground text-xs">({t.reviews})</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{t.subject} · {t.level}</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-brand-deep font-medium">
                <MapPin className="size-3.5" /> Next: {t.nextSlot}
              </div>
              <div className="flex items-end justify-between pt-2 border-t border-border">
                <div>
                  <span className="text-lg font-bold text-ink">TT${t.price}</span>
                  <span className="text-xs text-muted-foreground">/hr</span>
                </div>
                <span className="text-xs font-semibold text-brand-deep group-hover:underline">View profile →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
