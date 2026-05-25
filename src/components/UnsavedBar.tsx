import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export function UnsavedBar({
  dirty,
  onSave,
  onDiscard,
  saveLabel = "Save changes",
  message = "You have unsaved changes",
}: {
  dirty: boolean;
  onSave: () => void;
  onDiscard: () => void;
  saveLabel?: string;
  message?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-4 z-30 mx-auto max-w-3xl mt-6 transition-all",
        dirty ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none",
      )}
    >
      <div className="rounded-2xl border border-amber-200 bg-amber-50/95 backdrop-blur shadow-pop px-4 py-3 flex items-center gap-3">
        <AlertCircle className="size-4 text-amber-700 shrink-0" />
        <div className="text-sm font-semibold text-amber-900 flex-1">{message}</div>
        <button
          type="button"
          onClick={onDiscard}
          className="px-3 py-1.5 rounded-lg text-sm font-semibold text-amber-900 hover:bg-amber-100"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-1.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-deep"
        >
          {saveLabel}
        </button>
      </div>
    </div>
  );
}
