import { createFileRoute } from "@tanstack/react-router";
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

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function FaqPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Frequently asked questions
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[#A0A0A0]">
          Placeholder subheadline.{" "}
          <a href="mailto:support@myitutor.com" className="text-[#32CC6F] underline-offset-4 hover:underline">
            support@myitutor.com
          </a>
        </p>

        <nav className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <a
              key={c}
              href={`#${slug(c)}`}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:border-[#32CC6F] hover:text-[#32CC6F]"
            >
              {c}
            </a>
          ))}
        </nav>
      </section>

      <div className="mx-auto max-w-4xl px-6 pb-32">
        {categories.map((c) => (
          <section key={c} id={slug(c)} className="pt-24 first:pt-0">
            <h2 className="text-3xl font-bold sm:text-4xl">{c}</h2>
            <div className="mt-8 divide-y divide-white/10">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="py-8">
                  <h3 className="text-lg font-semibold text-white">
                    Placeholder question {i + 1} for {c.toLowerCase()}?
                  </h3>
                  <p className="mt-3 leading-relaxed text-[#A0A0A0]">
                    Placeholder answer paragraph. Full body copy, no accordion, always visible to readers and to search engines.
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </MarketingShell>
  );
}
