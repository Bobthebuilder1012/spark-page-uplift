import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { ClassesShell } from "@/components/classes/ClassesShell";
import { StarRating } from "@/components/classes/StarRating";

export const Route = createFileRoute("/classes/manage")({
  head: () => ({ meta: [{ title: "My Classes — iTutor" }] }),
  component: ManageClassesPage,
});

type MyClass = {
  id: string;
  name: string;
  subject: string;
  students: number;
  rating: number;
  ratingCount: number;
  revenueTTD: number;
  status: "Active" | "Archived";
};

const MY_CLASSES: MyClass[] = [
  { id: "c1", name: "CSEC Mathematics — Algebra & Functions", subject: "Mathematics", students: 12, rating: 4.8, ratingCount: 24, revenueTTD: 4200, status: "Active" },
  { id: "c2", name: "Mathematics — Geometry & Trigonometry", subject: "Mathematics", students: 9, rating: 4.7, ratingCount: 16, revenueTTD: 3150, status: "Active" },
  { id: "c3", name: "CXC Add Maths Prep", subject: "Mathematics", students: 0, rating: 0, ratingCount: 0, revenueTTD: 0, status: "Archived" },
];

function ManageClassesPage() {
  return (
    <ClassesShell>
      <header className="mb-8 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Classes</h1>
          <p className="mt-2 text-[#A0A0A0]">Manage your recurring group classes</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-[#32CC6F] px-5 py-2.5 text-sm font-semibold text-[#32CC6F] hover:bg-[#32CC6F]/10">
          <Plus className="size-4" /> Create Class
        </button>
      </header>

      {MY_CLASSES.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-[#1F1F1F] bg-[#111111] py-20 text-center">
          <div className="text-lg font-semibold">You haven't created any classes yet</div>
          <button className="mt-4 rounded-full bg-[#32CC6F] px-5 py-2.5 text-sm font-bold text-black hover:brightness-110">
            Create your first class
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {MY_CLASSES.map((c) => <ManageCard key={c.id} c={c} />)}
        </div>
      )}
    </ClassesShell>
  );
}

function ManageCard({ c }: { c: MyClass }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative rounded-2xl border border-[#1F1F1F] bg-[#111111] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-white">{c.name}</h3>
            <span className="rounded-full bg-[#1F1F1F] px-2.5 py-0.5 text-[11px] font-medium text-[#A0A0A0]">{c.subject}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                c.status === "Active" ? "bg-[#32CC6F]/15 text-[#32CC6F]" : "bg-white/10 text-[#A0A0A0]"
              }`}
            >
              {c.status}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#A0A0A0]">
            <span><span className="font-semibold text-white">{c.students}</span> students</span>
            <StarRating value={c.rating || 0} count={c.ratingCount} />
            <span>
              Monthly revenue:{" "}
              <span className="font-semibold text-white">TTD ${c.revenueTTD.toLocaleString()}</span>
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid size-9 place-items-center rounded-full text-[#A0A0A0] hover:bg-white/5 hover:text-white"
          >
            <MoreHorizontal className="size-5" />
          </button>
          {open && (
            <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#111111] shadow-xl">
              {["Edit", "Archive", "View Stream"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setOpen(false)}
                  className="block w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/5"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
