import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { MarketingShell } from "@/components/landing/MarketingShell";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — iTutor" },
      { name: "description", content: "Placeholder description for the FAQ page." },
    ],
  }),
  component: FaqPage,
});

const categories = [
  "Getting started",
  "Booking sessions",
  "Tutors",
  "Payments",
  "Parents",
  "Safety",
  "Technical",
  "Account",
];

const allQuestions: Record<string, string[]> = {};
categories.forEach((c) => {
  allQuestions[c] = Array.from({ length: 4 }, (_, i) => `Placeholder question ${i + 1} for ${c.toLowerCase()}?`);
});

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function FaqPage() {
  const [query, setQuery] = useState("");
  const lower = query.trim().toLowerCase();

  const filteredCategories = lower
    ? categories.filter((c) => {
        const qs = allQuestions[c];
        return (
          c.toLowerCase().includes(lower) ||
          qs.some((q) => q.toLowerCase().includes(lower))
        );
      })
    : categories;

  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Frequently asked questions
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[#555555]">
          Placeholder subheadline.{" "}
          <a href="mailto:support@myitutor.com" className="text-[#32CC6F] underline-offset-4 hover:underline">
            support@myitutor.com
          </a>
        </p>

        {/* Search bar */}
        <div className="mx-auto mt-10 flex max-w-2xl items-center gap-3 rounded-full border border-black/15 bg-[#F5F5F5] px-5 py-4">
          <Search className="h-5 w-5 text-black/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full bg-transparent text-base text-black placeholder:text-black/40 focus:outline-none"
          />
        </div>

        <nav className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <a
              key={c}
              href={`#${slug(c)}`}
              className="rounded-full border border-black/15 px-4 py-2 text-sm text-black/80 transition-colors hover:border-[#32CC6F] hover:text-[#32CC6F]"
            >
              {c}
            </a>
          ))}
        </nav>
      </section>

      <div className="mx-auto max-w-4xl px-6 pb-32">
        {filteredCategories.length === 0 && (
          <p className="py-12 text-center text-[#555555]">No questions match your search.</p>
        )}
        {filteredCategories.map((c) => {
          const qs = allQuestions[c].filter((q) => !lower || q.toLowerCase().includes(lower));
          if (lower && qs.length === 0) return null;
          return (
            <section key={c} id={slug(c)} className="pt-24 first:pt-0">
              <h2 className="text-3xl font-bold sm:text-4xl">{c}</h2>
              <div className="mt-8 divide-y divide-black/10">
                {qs.map((q, i) => (
                  <div key={i} className="py-8">
                    <h3 className="text-lg font-semibold text-black">{q}</h3>
                    <p className="mt-3 leading-relaxed text-[#555555]">
                      Placeholder answer paragraph. Full body copy, no accordion, always visible to readers and to search engines.
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </MarketingShell>
  );
}
