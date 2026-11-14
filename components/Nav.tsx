"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LogoLink } from "@/components/Logo";
import { Link, usePathname } from "@/i18n/navigation";
import { LANGUAGE_TAGS, localizedPath, type Locale } from "@/i18n/routing";
import { LINKS, type NavLink } from "@/lib/links";

type NavKey = "models" | "network" | "providers" | "security" | "docs" | "github";

const NAV: NavLink<NavKey>[] = [
  { label: "models", href: "/models" },
  { label: "network", href: "/network" },
  { label: "providers", href: "/providers" },
  { label: "security", href: "/security" },
  { label: "docs", href: LINKS.docs, external: true },
  { label: "github", href: LINKS.github, external: true },
];

function NavItem({ link, active, onClick }: { link: NavLink<NavKey>; active: boolean; onClick?: () => void }) {
  const t = useTranslations("Nav");
  const cls = active ? "text-volt" : "";
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={cls} onClick={onClick}>
        {t(link.label)}
      </a>
    );
  }
  return (
    <Link href={link.href} className={cls} aria-current={active ? "page" : undefined} onClick={onClick}>
      {t(link.label)}
    </Link>
  );
}

/** Links to this page in the other language. Each locale has its own root layout, so this is a full page load. */
function LanguageSwitch({ className = "" }: { className?: string }) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const other: Locale = locale === "en" ? "zh" : "en";
  return (
    <a
      href={localizedPath(pathname, other)}
      hrefLang={LANGUAGE_TAGS[other]}
      lang={LANGUAGE_TAGS[other]}
      aria-label={`${t("language")}: ${t("switchLanguage")}`}
      className={`flex items-center gap-1.5 ${className}`}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1.5 8h13M8 1.5c1.8 1.9 2.7 4 2.7 6.5S9.8 12.6 8 14.5C6.2 12.6 5.3 10.5 5.3 8S6.2 3.4 8 1.5Z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      {t("switchLanguage")}
    </a>
  );
}

export function Nav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        root.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  return (
    <nav ref={root} aria-label={t("label")} className="site-nav relative z-20 flex h-[72px] items-center gap-10">
      <LogoLink />
      <div className="desktop-nav ml-auto hidden items-center gap-7 text-sm text-text-2 md:flex">
        {NAV.map((l) => (
          <NavItem key={l.label} link={l} active={pathname === l.href} />
        ))}
        <LanguageSwitch />
        <a href={LINKS.signIn} className="btn-ghost">
          {t("signIn")}
        </a>
      </div>
      <button
        type="button"
        className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-chip-border text-paper md:hidden"
        aria-label={open ? t("closeMenu") : t("openMenu")}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          {open ? (
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" />
          ) : (
            <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" />
          )}
        </svg>
      </button>
      {open && (
        <div
          id="mobile-navigation"
          className="mobile-nav absolute top-[64px] right-0 left-0 z-30 flex flex-col border-y border-line bg-bg px-0 pt-2 pb-6 text-xl font-semibold md:hidden"
        >
          {NAV.map((l) => (
            <NavItem key={l.label} link={l} active={pathname === l.href} onClick={() => setOpen(false)} />
          ))}
          <LanguageSwitch />
          <div className="mt-5 grid grid-cols-2 gap-2.5 text-center text-[15px]">
            <a href={LINKS.signIn} className="btn-ghost">
              {t("signIn")}
            </a>
            <a href={LINKS.getApiKey} className="btn-primary">
              {t("getApiKey")}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
