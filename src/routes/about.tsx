import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell } from "@/components/landing/MarketingShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — iTutor" },
      { name: "description", content: "Placeholder description for the About page." },
      { property: "og:title", content: "About — iTutor" },
      { property: "og:description", content: "Placeholder description for the About page." },
    ],
  }),
  component: AboutPage,
});

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`mx-auto w-full max-w-6xl px-6 ${className}`}>{children}</section>;
}

function AboutPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <Section className="py-24 sm:py-32">
        <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Placeholder headline that spans two or three lines and sets the tone for everything that follows.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-[#A0A0A0]">
          Placeholder subheadline paragraph. One sentence that frames the company's purpose without trying to do too much.
        </p>
      </Section>

      {/* Origin story */}
      <section className="bg-[#0D0D0D] py-24 border-y border-white/5">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-20">
          <p className="text-3xl font-semibold leading-tight sm:text-4xl">
            "Placeholder pull-quote about why iTutor exists. Two short sentences. Maximum weight."
          </p>
          <div className="space-y-4 text-[#A0A0A0]">
            <p>Placeholder origin paragraph one — context and the spark.</p>
            <p>Placeholder origin paragraph two — what changed, and what we built in response.</p>
          </div>
        </div>
      </section>

      {/* What iTutor is */}
      <Section className="py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">What iTutor is</h2>
          <div className="space-y-5 text-[#A0A0A0]">
            <p>Placeholder paragraph one describing the platform plainly.</p>
            <p>Placeholder paragraph two on who it's for.</p>
            <p>Placeholder paragraph three on how it differs from generic platforms.</p>
            <p>Placeholder paragraph four on the bigger ambition.</p>
          </div>
        </div>
      </Section>

      {/* Mission statement */}
      <section className="py-32 text-center">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Placeholder mission statement rendered in very large display text — one sentence, generous space.
          </p>
        </div>
      </section>

      {/* AI + humans */}
      <section className="bg-[#0D0D0D] py-24 border-y border-white/5">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-4 text-[#A0A0A0]">
            <p>Placeholder paragraph on how AI fits into the experience.</p>
            <p>Placeholder paragraph on what stays human.</p>
          </div>
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Placeholder section label about AI and the people behind every session.
          </h2>
        </div>
      </section>

      {/* Tutor philosophy */}
      <Section className="py-24">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl">Our tutor philosophy</h2>
          <div className="mt-6 space-y-4 pl-6 border-l border-white/10 text-[#A0A0A0]">
            <p>Placeholder paragraph one on how tutors are selected.</p>
            <p>Placeholder paragraph two on what we expect of them.</p>
            <p>Placeholder paragraph three on what students and parents can expect in return.</p>
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section className="pb-24">
        <div className="grid gap-5 sm:grid-cols-3">
          {["Form 4", "Form 5", "L6/U6"].map((label) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-[#0D0D0D] p-8"
            >
              <div className="text-5xl font-bold text-[#32CC6F]">{label}</div>
              <p className="mt-3 text-sm text-[#A0A0A0]">Placeholder short descriptor line.</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section className="pb-24">
        <h2 className="text-3xl font-bold sm:text-4xl">The team</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-[#0D0D0D] p-6">
              <div className="aspect-square w-full rounded-xl bg-white/5" />
              <p className="mt-4 text-lg font-semibold">Placeholder Name</p>
              <p className="text-sm text-[#32CC6F]">Placeholder role</p>
              <p className="mt-2 text-sm text-[#A0A0A0]">One-line descriptor placeholder.</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Closing CTA */}
      <section className="pb-32 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button className="rounded-full bg-[#32CC6F] px-7 py-3.5 text-base font-semibold text-black transition-transform hover:scale-[1.03]">
              Find a Tutor
            </button>
            <button className="rounded-full border border-white/25 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/5">
              Join as a Tutor
            </button>
          </div>
          <p className="mt-6 text-sm italic text-[#A0A0A0]">
            Press &amp; investor enquiries: placeholder@myitutor.com
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
