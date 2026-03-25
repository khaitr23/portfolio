import { isAuthenticated, login, logout, loadContent } from "./actions";
import AdminEditor from "./AdminEditor";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const authed = await isAuthenticated();
  const params = await searchParams;

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#050a0e] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="text-emerald-500 text-xs font-mono tracking-widest uppercase mb-3 text-center">
            Admin
          </p>
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Portfolio CMS
          </h1>
          <form action={login} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                autoFocus
                className="w-full bg-white/5 border border-emerald-500/20 rounded-lg px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all"
                placeholder="Enter admin password"
              />
            </div>
            {params.error && (
              <p className="text-red-400 text-xs font-mono">
                Incorrect password.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all duration-200"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  const content = await loadContent();

  return (
    <div className="min-h-screen bg-[#050a0e]">
      {/* Admin Nav */}
      <nav className="sticky top-0 z-50 bg-[#050a0e]/90 backdrop-blur-xl border-b border-emerald-500/10">
        <div className="max-w-5xl mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-emerald-500 font-mono text-sm font-bold">
              KT
            </span>
            <span className="text-slate-600 text-xs font-mono">/</span>
            <span className="text-slate-400 text-xs font-mono">cms</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-xs text-slate-500 hover:text-emerald-400 font-mono transition-colors"
            >
              ↗ View site
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="text-xs text-slate-500 hover:text-red-400 font-mono transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <AdminEditor initialContent={content} />
    </div>
  );
}
