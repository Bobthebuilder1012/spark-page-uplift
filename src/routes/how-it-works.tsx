import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { MarketingShell } from "@/components/landing/MarketingShell";
import { SectionTabs } from "@/components/landing/SectionTabs";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — iTutor" },
      { name: "description", content: "Placeholder description for the How It Works page." },
    ],
  }),
  component: HowItWorksPage,
});

function Steps() {
  return (
    <div className="space-y-10">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="grid grid-cols-[auto_1fr] gap-6 sm:gap-10">
          <div className="text-5xl font-bold leading-none text-[#32CC6F] sm:text-6xl">
            {String(n).padStart(2, "0")}
          </div>
          <div>
            <h3 className="text-xl font-bold sm:text-2xl">Placeholder step title {n}</h3>
            <p className="mt-2 max-w-2xl text-[#555555]">
              Placeholder body text describing this step. Concise, action-oriented, no fluff.
            </p>
          </div>
        </div>
      ))}

      <div className="mt-12 max-w-2xl border-l-2 border-[#32CC6F] pl-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#32CC6F]">AI Tools</p>
        <ul className="mt-3 space-y-2 text-[#555555]">
          <li>Placeholder AI tool one</li>
          <li>Placeholder AI tool two</li>
          <li>Placeholder AI tool three</li>
        </ul>
      </div>
    </div>
  );
}

function HowItWorksPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Placeholder How It Works headline.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[#555555]">
          Placeholder subheadline that frames the three audiences below.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionTabs
          tabs={[
            { id: "students", label: "Students", content: <Steps /> },
            { id: "tutors", label: "Tutors", content: <Steps /> },
            { id: "parents", label: "Parents", content: <Steps /> },
          ]}
        />
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-3xl font-bold sm:text-4xl">How we compare</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-black/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5 text-black">
              <tr>
                <th className="px-5 py-4 font-semibold">Feature</th>
                <th className="px-5 py-4 font-semibold">iTutor</th>
                <th className="px-5 py-4 font-semibold">WhatsApp / Facebook</th>
                <th className="px-5 py-4 font-semibold">Generic platforms</th>
              </tr>
            </thead>
            <tbody className="text-[#555555]">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className={i % 2 ? "bg-black/[0.02]" : ""}>
                  <td className="px-5 py-4 text-black">Placeholder feature {i + 1}</td>
                  <td className="px-5 py-4"><Check className="h-5 w-5 text-[#32CC6F]" /></td>
                  <td className="px-5 py-4"><X className="h-5 w-5 text-black/30" /></td>
                  <td className="px-5 py-4">
                    {i % 2 ? <Check className="h-5 w-5 text-[#32CC6F]" /> : <X className="h-5 w-5 text-black/30" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-32">
        <div className="flex flex-wrap justify-center gap-3">
          {["I'm a Student", "I'm a Tutor", "I'm a Parent"].map((l) => (
            <button
              key={l}
              className="rounded-full border border-black/25 px-7 py-3.5 text-sm font-semibold text-black transition-colors hover:border-[#32CC6F] hover:text-[#32CC6F]"
            >
              {l}
            </button>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
