import { useState } from "react";
import { ChevronDown, ChevronRight, Facebook, Instagram, Linkedin } from "lucide-react";
import { Logo } from "./Logo";

const offers = [
  { title: "CSEC Subjects", body: "Secondary exams, core & elective subjects" },
  { title: "CAPE Subjects", body: "Sixth form units & advanced programmes" },
  { title: "Exam Preparation", body: "Past papers, SBAs & exam strategy" },
  { title: "Popular Topics", body: "Communities, lessons & study help" },
];

const faqs = [
  { q: "What is iTutor?", a: "iTutor is a Caribbean-built platform that connects students with verified 1-on-1 tutors for SEA, CSEC, and CAPE preparation." },
  { q: "Who are the iTutors?", a: "All tutors are verified Caribbean educators — qualified teachers, top-graded graduates, and subject specialists vetted by our team." },
  { q: "Is iTutor safe for students?", a: "Yes. Sessions run on Google Meet or Zoom, all tutors are background-checked, and parents can join or review every session." },
  { q: "Is it aligned with CSEC/CAPE?", a: "Every tutor follows the latest CSEC and CAPE syllabuses, with past-paper practice built into every learning track." },
  { q: "How does booking work?", a: "Browse tutors, pick a time that suits you, and confirm — you'll get a calendar invite with the meeting link instantly." },
];

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-white"
      >
        <span className="font-semibold text-white">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-white/60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid overflow-hidden text-sm text-white/70 transition-all duration-300 ${
          open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">{a}</div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer id="faq" className="px-3 pb-6 pt-10 sm:px-6">
      <div
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-14 text-white sm:px-10 sm:py-16"
        style={{ background: "linear-gradient(180deg, oklch(0.26 0.04 155) 0%, oklch(0.18 0.03 155) 100%)" }}
      >
        <div className="pointer-events-none absolute left-1/3 top-0 h-72 w-72 -translate-y-1/3 rounded-full bg-brand/30 blur-3xl" />

        <div className="relative grid gap-12 lg:grid-cols-3">
          {/* Company */}
          <div>
            <Logo light className="mb-6" />
            <h3 className="text-xl font-bold">Company</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li className="text-white/60">Contact: <span className="text-white">support@myitutor.com</span></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms &amp; Conditions</a></li>
            </ul>

            <div className="mt-8">
              <p className="mb-3 font-semibold">Follow Us</p>
              <div className="flex gap-2">
                {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-brand"
                    aria-label="Social link"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Offers */}
          <div>
            <h3 className="text-xl font-bold">Everything We Offer</h3>
            <ul className="mt-5 divide-y divide-white/10">
              {offers.map((o) => (
                <li key={o.title}>
                  <a href="#" className="group flex items-start justify-between gap-3 py-3 transition-colors hover:text-white">
                    <div>
                      <p className="font-semibold text-white">{o.title}</p>
                      <p className="text-sm text-white/60">{o.body}</p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
            <div className="mt-5">
              {faqs.map((f) => (
                <Faq key={f.q} {...f} />
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row">
          <p>© iTutor. Nora Digital, Ltd.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Help</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
