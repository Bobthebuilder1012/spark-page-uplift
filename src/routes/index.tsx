import { createFileRoute } from "@tanstack/react-router";
import { HomeNav } from "@/components/home/HomeNav";
import { HeroSearch } from "@/components/home/HeroSearch";
import { SubjectDiscovery } from "@/components/home/SubjectDiscovery";
import { MarketplaceIntro } from "@/components/home/MarketplaceIntro";
import { FeaturedTeachers } from "@/components/home/FeaturedTeachers";
import { HowItWorksFlow } from "@/components/home/HowItWorksFlow";
import { ClassFormats } from "@/components/home/ClassFormats";
import { BuiltHere } from "@/components/home/BuiltHere";
import { ForTeachers } from "@/components/home/ForTeachers";
import { FinalDiscovery } from "@/components/home/FinalDiscovery";
import { HomeFooter } from "@/components/home/HomeFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iTutor — Find Caribbean Teachers & Classes for SEA, CSEC and CAPE" },
      {
        name: "description",
        content:
          "iTutor is the marketplace where Caribbean parents and students discover teachers, compare active classes and register for the class that fits them.",
      },
      { property: "og:title", content: "iTutor — There's a teacher for the way you learn" },
      {
        property: "og:description",
        content:
          "Discover Caribbean teachers and classes for SEA, CSEC and CAPE — all in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <main>
        <HeroSearch />
        <SubjectDiscovery />
        <MarketplaceIntro />
        <FeaturedTeachers />
        <HowItWorksFlow />
        <ClassFormats />
        <BuiltHere />
        <ForTeachers />
        <FinalDiscovery />
      </main>
      <HomeFooter />
    </div>
  );
}
