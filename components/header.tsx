import Link from "next/link";
import { ArrowRight, Settings } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";

export function Header() {
  return <header className="library-header">
    <div className="library-container header-inner">
      <Link href="/" className="library-brand" aria-label="Prompt Library home">
        <span className="brand-mark"><LogoMark size={38} /></span>
        <span><strong>Prompt Library</strong><small>A little inspiration. A better starting point.</small></span>
      </Link>
      <nav className="header-actions" aria-label="Main navigation">
        <Link href="/#search" className="pink-button search-link">Search prompts <ArrowRight size={16} /></Link>
        <Link href="/admin/login" className="settings-link" aria-label="Open Admin Panel" title="Admin Panel">
          <Settings size={18} />
        </Link>
      </nav>
    </div>
  </header>;
}
