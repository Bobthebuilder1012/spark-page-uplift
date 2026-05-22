import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { REPORT_REASONS, type ReportReason } from "@/lib/ratings-store";

export function ReportModal({ onClose }: { onClose: () => void }) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState("");

  const submit = () => {
    if (!reason) return;
    onClose();
    toast.success("Report received. Thank you.");
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-background shadow-pop p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-ink">Report this comment</h2>
            <p className="text-sm text-muted-foreground mt-1">Help us keep iTutor a safe space. Reports are reviewed by our team.</p>
          </div>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-full hover:bg-muted" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {REPORT_REASONS.map((r) => (
            <label key={r.value} className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted">
              <input
                type="radio"
                name="reason"
                value={r.value}
                checked={reason === r.value}
                onChange={() => setReason(r.value)}
                className="accent-brand"
              />
              <span className="text-sm text-ink">{r.label}</span>
            </label>
          ))}
        </div>

        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Tell us more (optional)"
          rows={3}
          maxLength={500}
          className="mt-4 w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-brand"
        />

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted">Cancel</button>
          <button
            onClick={submit}
            disabled={!reason}
            className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-deep disabled:opacity-50"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
