import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell } from "@/components/landing/MarketingShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — iTutor" },
      { name: "description", content: "Placeholder description for the Privacy page." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Privacy Policy</h1>
        <p className="mt-4 text-[#A0A0A0]">Data controller: Astronova Technologies Ltd.</p>
        <p className="mt-1 text-sm text-white/50">Last updated: [date placeholder]</p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-32">
        <div className="space-y-12">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <p className="text-xs uppercase tracking-wider text-white/40">Section {i + 1}</p>
              <h3 className="mt-2 text-2xl font-bold text-white">Placeholder section heading</h3>
              <p className="mt-4 leading-relaxed text-[#A0A0A0]">
                Placeholder paragraph body. Claude Code will replace this with the real privacy policy copy.
              </p>
              <p className="mt-3 leading-relaxed text-[#A0A0A0]">
                Placeholder follow-up paragraph for additional detail.
              </p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
