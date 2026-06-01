import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell } from "@/components/landing/MarketingShell";
import { SectionTabs } from "@/components/landing/SectionTabs";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — iTutor" },
      { name: "description", content: "Placeholder description for the Terms page." },
    ],
  }),
  component: TermsPage,
});

function Sections() {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <p className="text-xs uppercase tracking-wider text-white/40">Section {i + 1}</p>
          <h3 className="mt-2 text-2xl font-bold text-white">Placeholder section heading</h3>
          <p className="mt-4 leading-relaxed text-[#A0A0A0]">
            Placeholder paragraph body for this section. Generous line height for legal readability. Claude Code will replace this with real terms copy.
          </p>
          <p className="mt-3 leading-relaxed text-[#A0A0A0]">
            Placeholder follow-up paragraph with additional clauses or details as needed.
          </p>
        </div>
      ))}
    </div>
  );
}

function TermsPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Terms of Service</h1>
        <p className="mt-4 text-[#A0A0A0]">Operated by Astronova Technologies Ltd.</p>
        <p className="mt-1 text-sm text-white/50">Last updated: [date placeholder]</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-32">
        <SectionTabs
          tabs={[
            { id: "students", label: "Students", content: <Sections /> },
            { id: "parents", label: "Parents & Guardians", content: <Sections /> },
            { id: "tutors", label: "Tutors", content: <Sections /> },
          ]}
        />
      </section>
    </MarketingShell>
  );
}
