"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoLink } from "@/components/Logo";
import { LINKS, type NavLink } from "@/lib/links";

const NAV: NavLink[] = [
  { label: "Models", href: "/models" },
  { label: "Network", href: "/network" },
  { label: "Providers", href: "/providers" },
  { label: "Security", href: "/security" },
  { label: "Docs ↗", href: LINKS.docs, external: true },
  { label: "GitHub", href: LINKS.github, external: true },
];

function NavItem({ link, active, onClick }: { link: NavLink; active: boolean; onClick?: () => void }) {
  const cls = active ? "text-volt" : "";
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={cls} onClick={onClick}>
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={cls} aria-current={active ? "page" : undefined} onClick={onClick}>
      {link.label}
    </Link>
  );
}

export function Nav() {
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
    <nav ref={root} aria-label="Main navigation" className="site-nav relative z-20 flex h-[72px] items-center gap-10">
      <LogoLink />
      <div className="desktop-nav ml-auto hidden items-center gap-7 text-sm text-text-2 md:flex">
        {NAV.map((l) => (
          <NavItem key={l.label} link={l} active={pathname === l.href} />
        ))}
        <a href={LINKS.signIn} className="btn-ghost">
          Sign in
        </a>
      </div>
      <button
        type="button"
        className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-chip-border text-paper md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
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
          <div className="mt-5 grid grid-cols-2 gap-2.5 text-center text-[15px]">
            <a href={LINKS.signIn} className="btn-ghost">
              Sign in
            </a>
            <a href={LINKS.getApiKey} className="btn-primary">
              Get API key
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
