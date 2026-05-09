export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
        <circle cx="9" cy="9" r="4.5" fill="oklch(0.74 0.19 145)" />
        <rect x="13" y="6" width="6" height="22" rx="3" transform="rotate(20 16 17)" fill="oklch(0.74 0.19 145)" />
      </svg>
      <span className={`text-xl font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`} style={{ fontFamily: "var(--font-display)" }}>
        itutor
      </span>
    </div>
  );
}
