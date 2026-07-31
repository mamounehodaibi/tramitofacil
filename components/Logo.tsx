const Mark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
    <path
      d="M 125.3 30.5 A 74 74 0 1 1 87.2 27.1"
      fill="none"
      stroke="var(--ink)"
      strokeWidth="1.5"
    />
    <circle cx="87.2" cy="27.1" r="4.5" fill="var(--stamp)" />
    <path
      d="M78 114 L94 130 L126 92"
      fill="none"
      stroke="var(--ink)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Logo({
  variant = "full",
  className = "",
}: {
  /** "mark" = icon only. "full" = icon + wordmark, sized for a nav/footer bar. */
  variant?: "mark" | "full";
  className?: string;
}) {
  if (variant === "mark") {
    return <Mark className={className || "h-8 w-8"} />;
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Mark className="h-7 w-7 shrink-0" />
      <span className="font-display text-lg font-semibold text-ink">
        Tramito<span className="text-stamp">Fácil</span>
      </span>
    </span>
  );
}
