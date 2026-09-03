"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, Sparkles } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--cream)]/95 backdrop-blur-sm border-b-2 border-[var(--ink)]/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Mosaic home">
            <div className="w-8 h-8 rounded-lg bg-[var(--ink)] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles size={18} className="text-[var(--mint)]" />
            </div>
            <span className="text-xl font-bold tracking-tight">Mosaic</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4" aria-label="Main navigation">
            <Link href="/" className="rounded-full border-2 border-[var(--ink)] px-4 py-2 text-xs font-black">
              Library
            </Link>
            <Link href="/admin/login" className="rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)] px-4 py-2 text-xs font-black">
              Admin
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-full border-2 border-[var(--ink)] p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-[var(--ink)]/10 pt-3 flex flex-col gap-2" aria-label="Mobile navigation">
            <Link href="/" className="rounded-full border-2 border-[var(--ink)] px-4 py-2 text-xs font-black text-center" onClick={() => setMobileMenuOpen(false)}>
              Library
            </Link>
            <Link href="/admin/login" className="rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)] px-4 py-2 text-xs font-black text-center" onClick={() => setMobileMenuOpen(false)}>
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
