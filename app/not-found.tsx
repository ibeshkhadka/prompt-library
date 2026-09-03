import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)] px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-[var(--ink)]/5 flex items-center justify-center mx-auto mb-4">
          <Search size={24} className="text-[var(--ink)]/30" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-[var(--ink)]/60 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)] px-5 py-3 text-sm font-black">
          Back to library
        </Link>
      </div>
    </div>
  );
}
