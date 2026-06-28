"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navItems, bottomNav } from "./nav";
import { Icon } from "./Icon";
import { useTheme } from "./ThemeProvider";
import { useSchool, schools } from "./SchoolProvider";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/data/seed";

function SchoolSwitcher() {
  const { activeSchool, setActiveSchool } = useSchool();
  return (
    <select
      value={activeSchool}
      onChange={(e) => setActiveSchool(e.target.value)}
      className="px-3 py-2 text-xs font-medium outline-none"
    >
      <option value="all" className="bg-slate-900 text-white">All Schools</option>
      {schools.map((s) => (
        <option key={s.id} value={s.id} className="bg-slate-900 text-white">
          {s.name} — {s.branch}
        </option>
      ))}
    </select>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="glass-strong fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 p-4 lg:flex">
        <Link href="/" className="mb-6 flex items-center gap-2 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl btn-primary">
            <Icon name="Sparkles" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">EduSocial</p>
            <p className="text-[10px] text-muted">AI Manager</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active ? "text-white" : "text-muted hover:text-white hover:bg-white/5"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-xl btn-primary opacity-90"
                  />
                )}
                <Icon name={item.icon} className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 flex items-center gap-2 rounded-xl glass p-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">
            {currentUser.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{currentUser.name}</p>
            <p className="truncate text-[10px] text-muted">Super Admin</p>
          </div>
          <button onClick={toggle} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Toggle theme">
            <Icon name={theme === "dark" ? "Sun" : "Moon"} className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="glass-strong sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-lg btn-primary">
              <Icon name="Sparkles" className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold gradient-text">EduSocial</span>
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted lg:flex">
            <Icon name="ShieldCheck" className="h-4 w-4 text-emerald-400" />
            Safe mode: nothing auto-posts. Admin approval required.
          </div>
          <div className="flex items-center gap-2">
            <SchoolSwitcher />
            <button onClick={toggle} className="rounded-lg glass p-2 lg:hidden" aria-label="Toggle theme">
              <Icon name={theme === "dark" ? "Sun" : "Moon"} className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="px-4 pb-28 pt-6 sm:px-6 lg:pb-10">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="glass-strong fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-white/10 px-2 py-2 lg:hidden">
        {bottomNav.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition",
                active ? "text-brand-400" : "text-muted"
              )}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
