"use client";
import Link from "next/link";
import { useState } from "react";

export function MobileNav({ links, phone }: { links: { href: string; label: string }[]; phone?: string | null }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        aria-label="Menu"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-current/20"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="2">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full border-t border-slate-200 bg-white text-slate-900 shadow-lg">
          <nav className="flex flex-col p-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-base font-medium hover:bg-slate-100">
                {l.label}
              </Link>
            ))}
            {phone && (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="r btn-primary m-2 px-4 py-3 text-center font-semibold">
                Appeler : {phone}
              </a>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
