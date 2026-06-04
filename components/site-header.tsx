'use client';

import Link from "next/link";
import { Menu, X } from "lucide-react";
import logo from "@/public/assets/paint-shield-logo.jpeg";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#tiers", label: "Products" },
  { href: "/#gallery", label: "Vlogs" },
  { href: "/warranty", label: "Warranty" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
         <Link href="/" className="flex items-center gap-3 group">
  {/* logo ko logo.src se replace kiya */}
  <img src={logo.src} alt="Paint Shield" className="h-10 w-10 object-contain" />
  <span className="font-display text-base tracking-[0.22em] uppercase">
    Paint<span className="ml-1 text-gold">Shield</span>
  </span>
</Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="/#tiers" className="hover:text-foreground transition">PPF</a>
            <a href="/#gallery" className="hover:text-foreground transition">Studio</a>
            <Link href="/admin" className="hover:text-foreground transition">Admin</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/warranty"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2 text-xs uppercase tracking-[0.18em] font-medium hover:bg-gold hover:text-ink transition-colors"
            >
              Check Warranty
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="md:hidden h-10 w-10 grid place-items-center rounded-full border border-border hover:border-gold hover:text-gold transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <aside
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-card border-l border-border shadow-luxe flex flex-col transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 h-16 border-b border-border">
            <span className="font-display text-base tracking-[0.22em] uppercase">Paint<span className="ml-1 text-gold">Shield</span></span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="h-10 w-10 grid place-items-center rounded-full hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl py-4 border-b border-border/60 hover:text-gold transition-colors"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="font-display text-2xl py-4 border-b border-border/60 hover:text-gold transition-colors"
            >
              Admin
            </Link>
          </nav>
          <div className="p-6 border-t border-border">
            <Link
              href="/warranty"
              onClick={() => setOpen(false)}
              className="w-full inline-flex justify-center items-center rounded-full bg-gradient-gold text-ink px-6 py-3 text-sm font-medium tracking-wide shadow-gold"
            >
              Check Warranty
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}