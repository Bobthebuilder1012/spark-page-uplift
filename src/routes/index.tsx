import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Testimonials } from "@/components/landing/Testimonials";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CtaBand } from "@/components/landing/CtaBand";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iTutor — Caribbean's No. 1 Tutoring Platform for SEA, CSEC & CAPE" },
      {
        name: "description",
        content:
          "Connect with verified Caribbean tutors for SEA, CSEC & CAPE. Personalised 1-on-1 sessions that turn struggles into strengths.",
      },
      { property: "og:title", content: "iTutor — Unlock Your Academic Potential" },
      { property: "og:description", content: "Verified Caribbean tutors. Real results. SEA, CSEC & CAPE preparation built around you." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Hero />
      <Stats />
      <Testimonials />
      <HowItWorks />
      <CtaBand />
      <Footer />
    </main>
  );
}
