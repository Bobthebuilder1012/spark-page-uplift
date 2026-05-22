import { useState } from "react";
import { toast } from "sonner";
import { StarInput } from "./StarInput";

type Props = {
  tutorName: string;
  tutorHue: number;
  subject: string;
  sessionDate: string;
  onSubmit: (rating: number, comment: string) => void;
};

function Avatar({ name, hue, size = 80 }: { name: string; hue: number; size?: number }) {
  const initials = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="rounded-full inline-flex items-center justify-center font-bold"
      style={{ width: size, height: size, background: `oklch(0.85 0.1 ${hue})`, color: `oklch(0.28 0.07 ${hue})`, fontSize: size * 0.38 }}
    >{initials}</div>
  );
}

/**
 * Full-screen lockout modal that blocks the app until the student rates the
 * 1-on-1 session that just ended. No close, no skip, no dismiss.
 */
export function RatingLockoutModal({ tutorName, tutorHue, subject, sessionDate, onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submit = () => {
    if (rating < 1) return;
    onSubmit(rating, comment);
    toast.success("Thanks — rating submitted");
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl bg-background shadow-pop p-6 sm:p-8 text-center">
        <div className="flex justify-center"><Avatar name={tutorName} hue={tutorHue} size={80} /></div>
        <div className="mt-4">
          <div className="text-base font-bold text-ink">{tutorName}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{subject} · {sessionDate}</div>
        </div>

        <h2 className="mt-6 text-2xl font-bold text-ink">How was your session?</h2>

        <div className="mt-5 flex justify-center">
          <StarInput value={rating} onChange={setRating} size={48} />
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us more (optional)"
          rows={3}
          maxLength={500}
          className="mt-5 w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-brand"
        />

        <button
          onClick={submit}
          disabled={rating < 1}
          className="mt-5 w-full py-3 rounded-2xl bg-brand text-white font-bold hover:bg-brand-deep disabled:opacity-50"
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
}
