import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, ChevronDown, Search } from "lucide-react";
import { MarketingShell } from "@/components/landing/MarketingShell";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Centre — iTutor" },
      { name: "description", content: "Placeholder description for the Help page." },
    ],
  }),
  component: HelpPage,
});

const categories = [
  "Getting started",
  "Account & profile",
  "Booking & sessions",
  "Payments & billing",
  "For parents",
  "For tutors",
  "Technical issues",
  "Safety & trust",
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function Article({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-[#32CC6F]"
      >
        <span className="font-medium text-black">{title}</span>
        <ChevronDown className={`h-4 w-4 text-black/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pb-6 text-[#555555] leading-relaxed">
          <p>Placeholder article body. Full content lives here. Multiple paragraphs supported.</p>
          <p className="mt-3">Placeholder follow-up paragraph for additional context.</p>
        </div>
      )}
    </div>
  );
}

function HelpPage() {
  return (
    <MarketingShell>
      {/* Hero with search */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
        <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          How can we help?
        </h1>
        <div className="mx-auto mt-10 flex max-w-2xl items-center gap-3 rounded-full border border-black/15 bg-[#F5F5F5] px-5 py-4">
          <Search className="h-5 w-5 text-black/50" />
          <input
            type="search"
            placeholder="Search for answers..."
            className="w-full bg-transparent text-base text-black placeholder:text-black/40 focus:outline-none"
          />
        </div>
      </section>

      {/* Category grid */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <a
              key={c}
              href={`#${slug(c)}`}
              className="group flex items-start justify-between gap-3 rounded-2xl border border-black/10 bg-[#F5F5F5] p-6 transition-colors hover:border-[#32CC6F]"
            >
              <div>
                <p className="font-semibold text-black">{c}</p>
                <p className="mt-1 text-sm text-[#555555]">Placeholder short descriptor.</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-black/40 transition-transform group-hover:translate-x-1 group-hover:text-[#32CC6F]" />
            </a>
          ))}
        </div>
      </section>

      {/* Category sections */}
      <div className="mx-auto max-w-4xl px-6 pb-24">
        {categories.map((c) => (
          <section key={c} id={slug(c)} className="pt-16 first:pt-0">
            <h2 className="text-2xl font-bold sm:text-3xl">{c}</h2>
            <div className="mt-6">
              {[0, 1, 2, 3].map((i) => (
                <Article key={i} title={`Placeholder article ${i + 1} for ${c}`} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Still need help */}
      <section className="border-t border-black/5 bg-[#F5F5F5] py-20 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Still need help?</h2>
        <p className="mt-3 text-[#555555]">Placeholder supporting line.</p>
        <a
          href="mailto:support@myitutor.com"
          className="mt-6 inline-block text-lg font-semibold text-[#32CC6F] hover:underline"
        >
          support@myitutor.com
        </a>
      </section>
    </MarketingShell>
  );
}
