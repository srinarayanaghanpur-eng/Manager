"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard, StatCard, StatusBadge, PageHeader } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useSchool } from "@/components/SchoolProvider";
import {
  analytics, approvals, calendarItems, contentIdeas, leads, schools,
} from "@/lib/data/seed";
import { formatNumber, platformColor, platformLabel } from "@/lib/utils";

export default function DashboardPage() {
  const { activeSchool } = useSchool();
  const inScope = <T extends { schoolId?: string }>(arr: T[]) =>
    activeSchool === "all" ? arr : arr.filter((x) => x.schoolId === activeSchool);

  const ideas = inScope(contentIdeas);
  const cal = inScope(calendarItems);
  const apr = inScope(approvals);
  const lds = inScope(leads);
  const ana = activeSchool === "all" ? analytics : analytics.filter((a) => a.schoolId === activeSchool);

  const pendingApprovals = apr.filter((a) => a.approvalStatus === "waiting_for_approval").length;
  const published = apr.filter((a) => a.approvalStatus === "published").length;
  const best = [...ideas].sort((a, b) => b.reachScore - a.reachScore)[0];
  const todayTasks = cal.slice(0, 4);
  const weeklyScore = Math.min(100, 55 + ideas.length * 3 + published * 5);

  const platforms = ["instagram", "youtube", "facebook"] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="AI social media command center for both schools."
        action={
          <Link href="/ai-agents" className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold">
            <Icon name="Sparkles" className="h-4 w-4" /> Run an AI Agent
          </Link>
        }
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Posts Planned" value={cal.length} icon={<Icon name="CalendarDays" className="h-5 w-5" />} />
        <StatCard label="Published Manually" value={published} accent="#a855f7" icon={<Icon name="CheckCircle2" className="h-5 w-5" />} />
        <StatCard label="Pending Approvals" value={pendingApprovals} accent="#f59e0b" icon={<Icon name="Clock" className="h-5 w-5" />} />
        <StatCard label="Admission Leads" value={lds.length} accent="#22c55e" icon={<Icon name="UserPlus" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Platform performance cards */}
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            {platforms.map((p) => {
              const rows = ana.filter((a) => a.platform === p);
              const followers = rows.reduce((s, r) => s + r.followers, 0);
              const reach = rows.reduce((s, r) => s + r.reach, 0);
              return (
                <GlassCard key={p}>
                  <div className="flex items-center gap-2">
                    <Icon name={platformLabel(p)} className="h-5 w-5" style={{ color: platformColor(p) }} />
                    <span className="text-sm font-semibold">{platformLabel(p)}</span>
                  </div>
                  <p className="mt-3 text-2xl font-bold">{formatNumber(followers)}</p>
                  <p className="text-xs text-muted">followers</p>
                  <p className="mt-2 text-xs text-emerald-400">Reach {formatNumber(reach)} this week</p>
                </GlassCard>
              );
            })}
          </div>

          {/* Follower growth */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Follower Growth — both schools</h3>
              <Link href="/analytics" className="text-xs text-brand-400 hover:underline">View analytics →</Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {schools
                .filter((s) => activeSchool === "all" || s.id === activeSchool)
                .map((s) => {
                  const ig = analytics.find((a) => a.schoolId === s.id && a.platform === "instagram");
                  const hist = ig?.followerHistory ?? [];
                  const max = Math.max(...hist.map((h) => h.value), 1);
                  return (
                    <div key={s.id}>
                      <p className="mb-2 text-xs font-medium">{s.name}</p>
                      <div className="flex h-24 items-end gap-1.5">
                        {hist.map((h) => (
                          <div key={h.week} className="flex flex-1 flex-col items-center gap-1">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${(h.value / max) * 100}%` }}
                              transition={{ duration: 0.6 }}
                              className="w-full rounded-t-md"
                              style={{ background: `linear-gradient(180deg, ${s.brandColors.primary}, ${s.brandColors.secondary})`, minHeight: 6 }}
                            />
                            <span className="text-[9px] text-muted">{h.week}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {formatNumber(hist[0]?.value ?? 0)} → {formatNumber(hist[hist.length - 1]?.value ?? 0)} IG followers
                      </p>
                    </div>
                  );
                })}
            </div>
          </GlassCard>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Weekly Content Score</h3>
              <span className="text-xs text-muted">this week</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative grid h-20 w-20 place-items-center">
                <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#g)" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${weeklyScore} 100`} />
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3563ff" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-lg font-bold">{weeklyScore}</span>
              </div>
              <p className="text-xs text-muted">
                Based on planned posts, approvals and publishing consistency. Keep posting to push it higher.
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="mb-3 font-semibold">Today&apos;s Content Tasks</h3>
            <div className="space-y-2">
              {todayTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-xl glass p-2.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: platformColor(t.platform) }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="text-[11px] text-muted">{platformLabel(t.platform)} · {t.assignedTo}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
            <Link href="/calendar" className="mt-3 block text-center text-xs text-brand-400 hover:underline">
              Open calendar →
            </Link>
          </GlassCard>

          {best && (
            <GlassCard>
              <div className="flex items-center gap-2">
                <Icon name="Star" className="h-4 w-4 text-amber-400" />
                <h3 className="font-semibold">Best Performing Idea</h3>
              </div>
              <p className="mt-2 text-sm font-medium">{best.title}</p>
              <p className="mt-1 text-xs text-muted">{best.whyItWorks}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-emerald-400">Reach score {best.reachScore}</span>
                <span className="text-muted">{platformLabel(best.bestPlatform)}</span>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
