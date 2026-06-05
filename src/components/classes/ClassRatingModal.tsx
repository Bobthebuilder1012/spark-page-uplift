import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, X } from "lucide-react";

export function ClassRatingModal({
  open,
  onClose,
  className,
  tutorName,
  tutorAvatar,
}: {
  open: boolean;
  onClose: () => void;
  className: string;
  tutorName: string;
  tutorAvatar?: string;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) {
      setRating(0);
      setHover(0);
      setComment("");
      setSubmitted(false);
    }
  }, [open]);

  useEffect(() => {
    if (submitted) {
      const t = setTimeout(onClose, 2000);
      return () => clearTimeout(t);
    }
  }, [submitted, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-[480px] rounded-t-2xl sm:rounded-2xl border border-[#1F1F1F] bg-[#111111] p-6 sm:p-7 text-white"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-[#A0A0A0] hover:bg-white/5 hover:text-white"
        >
          <X className="size-4" />
        </button>

        {!submitted ? (
          <>
            <div className="text-center">
              <div className="text-lg font-bold">{className}</div>
              <div className="text-xs uppercase tracking-wider text-[#A0A0A0] mt-1">Monthly Rating</div>
              <div className="mt-4 flex flex-col items-center gap-2">
                <div className="size-14 rounded-full bg-[#1F1F1F] overflow-hidden grid place-items-center text-sm font-bold text-white/80">
                  {tutorAvatar ? (
                    <img src={tutorAvatar} alt={tutorName} className="size-full object-cover" />
                  ) : (
                    tutorName.split(" ").map((s) => s[0]).slice(0, 2).join("")
                  )}
                </div>
                <div className="text-sm font-medium">{tutorName}</div>
              </div>
            </div>

            <div className="my-5 h-px bg-[#1F1F1F]" />

            <div className="space-y-3">
              <div className="text-sm font-medium">How was the class this month?</div>
              <div className="flex items-center justify-between px-2">
                {[1, 2, 3, 4, 5].map((i) => {
                  const active = (hover || rating) >= i;
                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 1.15 }}
                      animate={rating === i ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(i)}
                      aria-label={`${i} stars`}
                      className="p-1"
                    >
                      <Star
                        className={`size-10 transition-colors ${
                          active ? "fill-[#32CC6F] text-[#32CC6F]" : "text-white/30"
                        }`}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-sm font-medium">Leave a comment (optional)</label>
              <textarea
                rows={3}
                maxLength={500}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How has the class been this month?"
                className="w-full resize-none rounded-xl border border-[#1F1F1F] bg-black/40 p-3 text-sm text-white placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#32CC6F]/60"
              />
              <div className="text-right text-xs text-[#A0A0A0]">{comment.length} / 500</div>
            </div>

            <div className="mt-5 space-y-3">
              <button
                disabled={rating === 0}
                onClick={() => setSubmitted(true)}
                className="w-full rounded-full bg-[#32CC6F] px-4 py-3 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Rating
              </button>
              <button onClick={onClose} className="block w-full text-center text-sm text-[#A0A0A0] hover:text-white">
                Skip for now
              </button>
            </div>
          </>
        ) : (
          <AnimatePresence>
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
                className="mx-auto grid size-16 place-items-center rounded-full bg-[#32CC6F]/15"
              >
                <Check className="size-9 text-[#32CC6F]" strokeWidth={3} />
              </motion.div>
              <div className="mt-4 text-lg font-bold">Thanks for your rating!</div>
              <div className="mt-1 text-sm text-[#A0A0A0]">
                Your feedback helps improve the class.
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
