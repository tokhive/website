import Link from "next/link";

/** Hex mark. The stripes use the page background so they read as cut-outs. */
export function LogoMark({ size = 28, cutout = "#0A0B0C" }: { size?: number; cutout?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,6 88.1,28 88.1,72 50,94 11.9,72 11.9,28" fill="#C8F031" />
      <rect x="11.9" y="36.5" width="76.2" height="9" fill={cutout} />
      <rect x="11.9" y="54.5" width="76.2" height="9" fill={cutout} />
    </svg>
  );
}

export function Wordmark({ className = "text-[20px]" }: { className?: string }) {
  return (
    <span className={`tracking-[-0.02em] ${className}`}>
      <span className="font-light">Tok</span>
      <span className="font-bold">Hive</span>
    </span>
  );
}

export function LogoLink() {
  return (
    <Link href="/" aria-label="TokHive home" className="flex items-center gap-2.5">
      <LogoMark />
      <Wordmark />
    </Link>
  );
}
