"use client";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-500/10 py-8">
      <div className="max-w-6xl mx-auto px-8 md:px-12 flex items-center justify-between flex-wrap gap-4">
        <span className="text-slate-600 text-xs font-mono">
          © 2026 Keegan Tran
        </span>
        <span className="text-slate-700 text-xs font-mono">
          Built with Next.js · Framer Motion · Tailwind CSS
        </span>
      </div>
    </footer>
  );
}
