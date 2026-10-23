"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoLink } from "@/components/Logo";
import { LINKS, type NavLink } from "@/lib/links";

const NAV: NavLink[] = [
  { label: "Models", href: "/models" },
  { label: "Network", href: "/network" },
  { label: "Docs ↗", href: LINKS.docs, external: true },
  { label: "Blog ↗", href: LINKS.blog, external: true },
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

  return (
    <nav className="relative flex h-[72px] items-center gap-10">
      <LogoLink />
      <div className="ml-auto hidden items-center gap-7 text-sm text-text-2 md:flex">
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
        <div className="absolute top-[64px] right-0 left-0 z-30 flex flex-col gap-4 rounded-card border border-line bg-surface p-6 text-[15px] text-text-2 md:hidden">
          {NAV.map((l) => (
            <NavItem key={l.label} link={l} active={pathname === l.href} onClick={() => setOpen(false)} />
          ))}
          <a href={LINKS.signIn} className="btn-ghost self-start">
            Sign in
          </a>
        </div>
      )}
    </nav>
  );
}
