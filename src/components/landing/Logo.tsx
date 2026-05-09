import logoUrl from "@/assets/itutor-logo.png";

export function Logo({ className = "", size = 32 }: { className?: string; light?: boolean; size?: number }) {
  return (
    <img
      src={logoUrl}
      alt="itutor"
      width={size * 4}
      height={size}
      style={{ height: size, width: "auto" }}
      className={`block object-contain ${className}`}
    />
  );
}
