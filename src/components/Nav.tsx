"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/lib/store";

const links = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/bills", label: "Policy" },
  { href: "/activity", label: "My activity" },
];

export function Nav() {
  const path = usePathname();
  const { user } = useApp();
  const [open, setOpen] = useState(false);

  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className="site-header">
      <div className="shell flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="display text-2xl leading-none">Meridian</span>
          <span className="hidden text-[11px] uppercase tracking-[0.2em] text-ink-faint sm:inline">Arizona</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={active(l.href) ? "text-ink" : "text-ink-soft hover:text-ink"}
              aria-current={active(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link href="/account" className="btn btn-secondary !min-h-10 !px-4 text-sm">
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link href="/signin" className="btn btn-primary !min-h-10 !px-4 text-sm">
              Sign in
            </Link>
          )}
          <button
            className="btn btn-ghost !min-h-10 !px-3 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="border-t border-line px-5 py-3 md:hidden" aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-base"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { resetSession, events } = useApp();
  return (
    <footer className="mt-16 border-t border-line">
      <div className="shell grid gap-8 py-10 text-sm text-ink-soft md:grid-cols-3">
        <div>
          <p className="display text-xl text-ink">Meridian</p>
          <p className="mt-2 max-w-sm">
            See what is still missing. Verify what actually arrived. Close the gap.
          </p>
        </div>
        <div className="space-y-2">
          <Link className="block hover:text-ink" href="/about">About</Link>
          <Link className="block hover:text-ink" href="/privacy">Privacy</Link>
          <Link className="block hover:text-ink" href="/terms">Terms</Link>
          <Link className="block hover:text-ink" href="/contact">Contact</Link>
        </div>
        <div className="space-y-2">
          <a className="block hover:text-ink" href="https://www.azleg.gov/findmylegislator/">Find your Arizona legislators</a>
          <a className="block hover:text-ink" href="https://www.azleg.gov/">Arizona Legislature</a>
          <a className="block hover:text-ink" href="https://www.azed.gov/">Arizona Department of Education</a>
          {events.length > 0 && (
            <button type="button" className="mt-3 text-left text-ink-faint hover:text-ink" onClick={resetSession}>
              Reset session
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
