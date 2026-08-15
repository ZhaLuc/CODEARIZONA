"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/lib/store";

const links = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/bills", label: "Policy" },
  { href: "/activity", label: "My activity" },
];

export function Nav() {
  const path = usePathname();
  const { user, resetSession } = useApp();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onResize);
    return () => mq.removeEventListener("change", onResize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.dataset.menu = "open";
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      delete document.body.dataset.menu;
    };
  }, [open]);

  const menu = (
    <div className="fixed inset-0 z-[60]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-[color:var(--text)]/40"
        aria-label="Close menu"
        onClick={() => {
          setOpen(false);
          buttonRef.current?.focus();
        }}
      />
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto border-b border-line bg-surface px-5 pb-8 pt-20 shadow-[var(--shadow-2)]"
      >
        <nav aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block border-b border-line py-4 text-xl"
              aria-current={active(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <Link href={user ? "/account" : "/signin"} className="mt-4 block py-4 text-xl">
            {user ? "Account" : "Sign in"}
          </Link>
          <button
            type="button"
            className="mt-2 block py-4 text-xl"
            onClick={() => {
              resetSession();
              setOpen(false);
            }}
          >
            Reset session
          </button>
        </nav>
        <button
          type="button"
          className="btn btn-secondary mt-2 w-full"
          onClick={() => {
            setOpen(false);
            buttonRef.current?.focus();
          }}
        >
          Close menu
        </button>
      </div>
    </div>
  );

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
          <button type="button" className="hidden text-xs text-ink-faint hover:text-ink sm:inline" onClick={resetSession}>
            Reset
          </button>
          <button
            ref={buttonRef}
            type="button"
            className="btn btn-ghost !min-h-10 !px-3 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {mounted && open ? createPortal(menu, document.body) : null}
    </header>
  );
}

export function Footer() {
  const { resetSession } = useApp();
  return (
    <footer className="mt-16 border-t border-line">
      <div className="shell grid gap-8 py-10 text-sm text-ink-soft md:grid-cols-3">
        <div>
          <p className="display text-xl text-ink">Meridian</p>
          <p className="mt-2 max-w-sm">See what is still missing. Verify what actually arrived. Close the gap.</p>
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
          <button type="button" className="mt-3 block text-left hover:text-ink" onClick={resetSession}>
            Reset session
          </button>
        </div>
      </div>
    </footer>
  );
}
