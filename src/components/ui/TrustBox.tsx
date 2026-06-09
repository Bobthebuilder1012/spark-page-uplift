import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrustBox({
  title,
  body,
  className,
}: {
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-trust-bg border border-brand/20 p-4 flex gap-3 items-start",
        className,
      )}
    >
      <BadgeCheck className="size-5 text-brand-deep shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-trust-text">{title}</div>
        <p className="text-xs text-trust-text/80 mt-0.5 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
