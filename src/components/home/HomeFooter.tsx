import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import { Logo } from "@/components/landing/Logo";

const columns: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "Marketplace",
    links: [
      { label: "Find a Class", to: "/classes" },
      { label: "Explore Teachers", to: "/student/tutors" },
      { label: "How It Works", to: "/how-it-works" },
    ],
  },
  {
    heading: "People",
    links: [
      { label: "For Students", to: "/student" },
      { label: "For Parents", to: "/parent" },
      { label: "For Teachers", to: "/tutor/get-listed" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Help", to: "/help" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", to: "/terms" },
      { label: "Privacy", to: "/privacy" },
    ],
  },
];

export function HomeFooter() {
  return (
    <footer className="bg-ink text-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div>
            <Logo size={28} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-background/60">
              Every Caribbean student should have access to a great teacher.
            </p>
            <a
              href="mailto:support@myitutor.com"
              className="mt-6 inline-flex items-center gap-2 text-sm text-background/80 transition-colors hover:text-background"
            >
              <Mail className="h-4 w-4 text-brand" />
              support@myitutor.com
            </a>
            <div className="mt-6 flex gap-2">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Linkedin, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-full bg-background/8 text-background/75 transition-colors hover:bg-brand hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-background/45">
                  {col.heading}
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-background/75 transition-colors hover:text-background"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-background/12 pt-6 text-sm text-background/50">
          <p>
            © {new Date().getFullYear()} iTutor — Astronova Technologies Ltd. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
