import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";
import { FOOTER_COLUMNS } from "@/lib/links";

export function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={`site-footer border-t border-line ${compact ? "footer-compact" : ""}`}>
      <div className="footer-grid mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-8 p-12 text-sm max-sm:px-5">
        <div className="footer-brand flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <LogoMark size={22} />
            <Wordmark className="text-[17px]" />
          </div>
          <span className="hidden text-muted md:block">© 2026 TokHive</span>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading} className="flex flex-col gap-2.5">
            <span className="font-mono text-xs tracking-[0.08em] text-muted">{col.heading}</span>
            {col.links.map((l) =>
              l.external ? (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="text-link-footer">
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} href={l.href} className="text-link-footer">
                  {l.label}
                </Link>
              ),
            )}
          </div>
        ))}
        <span className="col-span-2 text-xs text-muted-2 md:hidden">© 2026 TokHive</span>
      </div>
      {compact && (
        <div className="site-container compact-footer flex items-center justify-between gap-4 py-8 text-xs text-muted-2 md:hidden">
          <span>© 2026 TokHive</span>
          <span className="flex gap-2">
            <a href="#">Terms</a>
            <span>·</span>
            <a href="#">Privacy</a>
            <span>·</span>
            <a href="#">AUP</a>
          </span>
        </div>
      )}
    </footer>
  );
}
