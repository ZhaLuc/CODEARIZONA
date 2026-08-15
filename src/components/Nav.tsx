"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/lib/store";

const links = [
  { href: "/explore", label: "Map" },
  { href: "/requests", label: "Needs" },
  { href: "/bills", label: "Policy" },
  { href: "/trust", label: "Trust" },
];

export function Nav() {
  const path = usePathname();
  const { role, setRole } = useDemo();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-[color:var(--paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="display text-2xl leading-none">Meridian</span>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-soft">Arizona</span>
        </Link>
        <nav className="flex items-center gap-4 overflow-x-auto text-sm md:gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={path.startsWith(l.href) ? "text-ink" : "text-ink-soft hover:text-ink"}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRole(role === "teacher" ? "neighbor" : "teacher")}
            className="hidden rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft sm:block"
          >
            {role === "teacher" ? "Teacher demo" : "Neighbor demo"}
          </button>
          <Link
            href={role === "teacher" ? "/dashboard" : "/explore"}
            className="rounded-full bg-ink px-4 py-2 text-sm text-[color:var(--paper)]"
          >
            {role === "teacher" ? "Classroom desk" : "Open remaining needs"}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 text-sm text-ink-soft md:grid-cols-3">
        <div>
          <p className="display text-xl text-ink">Meridian</p>
          <p className="mt-2 max-w-sm">
            A remaining-need ledger for Arizona classrooms, with state policy sitting next to the items still open. Classroom records are demonstration data. Bill pages use official Arizona legislative sources.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-ink">Not this product</p>
          <p>No teacher home addresses. No student names. No political endorsements. No fake partnerships.</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-ink">Official doors</p>
          <a className="block underline decoration-line underline-offset-4" href="https://www.azleg.gov/findmylegislator/">
            Find your Arizona legislators
          </a>
          <a className="block underline decoration-line underline-offset-4" href="https://www.azleg.gov/">
            Arizona Legislature
          </a>
          <a className="block underline decoration-line underline-offset-4" href="https://www.azed.gov/">
            Arizona Department of Education
          </a>
        </div>
      </div>
    </footer>
  );
}
