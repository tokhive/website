import { useTranslations } from "next-intl";
import { LogoMark, Wordmark } from "@/components/Logo";
import { Link } from "@/i18n/navigation";
import { FOOTER_COLUMNS, LINKS } from "@/lib/links";

export function Footer({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("Footer");
  return (
    <footer className={`site-footer border-t border-line ${compact ? "footer-compact" : ""}`}>
      <div className="footer-grid mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-8 p-12 text-sm max-sm:px-5">
        <div className="footer-brand flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <LogoMark size={22} />
            <Wordmark className="text-[17px]" />
          </div>
          <span className="hidden text-muted md:block">© 2026 TokHive, Inc.</span>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading} className="flex flex-col gap-2.5">
            <span className="font-mono text-xs tracking-[0.08em] text-muted">{t(col.heading)}</span>
            {col.links.map((l) => {
              const label = l.literal ? l.label : t(l.label as Exclude<typeof l.label, "hello@tokhive.ai">);
              return l.external ? (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-link-footer">
                  {label}
                </a>
              ) : (
                <Link key={l.href} href={l.href} className="text-link-footer">
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
        <span className="col-span-2 text-xs text-muted-2 md:hidden">© 2026 TokHive, Inc.</span>
      </div>
      {compact && (
        <div className="site-container compact-footer flex items-center justify-between gap-4 py-8 text-xs text-muted-2 md:hidden">
          <span>© 2026 TokHive, Inc.</span>
          <span className="flex gap-2">
            <Link href={LINKS.terms}>{t("termsShort")}</Link>
            <span>·</span>
            <Link href={LINKS.privacy}>{t("privacyShort")}</Link>
            <span>·</span>
            <Link href={LINKS.aup}>{t("aupShort")}</Link>
          </span>
        </div>
      )}
    </footer>
  );
}
