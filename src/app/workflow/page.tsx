"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader, GlassCard } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useSchool } from "@/components/SchoolProvider";
import {
  socialAccounts, contentIdeas, approvals, calendarItems, leads,
  analytics, monthlyRevenue,
} from "@/lib/data/seed";
import { formatNumber, formatINR, cn } from "@/lib/utils";

interface Stage {
  n: number;
  label: string;
  sub: string;
  href: string;
  icon: string;
  accent: string;
  count: string;
  countLabel: string;
}

export default function WorkflowPage() {
  const { activeSchool } = useSchool();
  const scope = <T extends { schoolId?: string }>(arr: T[]) =>
    activeSchool === "all" ? arr : arr.filter((x) => x.schoolId === activeSchool);

  const accounts = activeSchool === "all" ? socialAccounts : socialAccounts.filter((a) => a.schoolId === activeSchool);
  const ideas = scope(contentIdeas);
  const apr = scope(approvals);
  const cal = scope(calendarItems);
  const lds = scope(leads);
  const ana = activeSchool === "all" ? analytics : analytics.filter((a) => a.schoolId === activeSchool);
  const totalFollowers = ana.reduce((s, a) => s + a.followers, 0);

  const stages: Stage[] = [
    { n: 1, label: "Connect accounts", sub: "Instagram · YouTube · Facebook", href: "/schools", icon: "Share2", accent: "#3563ff", count: `${accounts.length}`, countLabel: "accounts" },
    { n: 2, label: "AI trend ideas", sub: "Trend Finder agent", href: "/ai-agents", icon: "TrendingUp", accent: "#a855f7", count: `${ideas.length}`, countLabel: "ideas in bank" },
    { n: 3, label: "Script · caption · thumbnail", sub: "Poster & Reel Studio", href: "/poster-studio", icon: "Image", accent: "#ec4899", count: "1-click", countLabel: "design pack" },
    { n: 4, label: "Approval", sub: "Admin reviews everything", href: "/approvals", icon: "CheckCircle2", accent: "#f59e0b", count: `${apr.filter((a) => a.approvalStatus === "waiting_for_approval").length}`, countLabel: "pending" },
    { n: 5, label: "Content calendar", sub: "Plan & schedule", href: "/calendar", icon: "CalendarDays", accent: "#06b6d4", count: `${cal.length}`, countLabel: "planned" },
    { n: 6, label: "Manual posting", sub: "Approved + PIN, never auto", href: "/approvals", icon: "Send", accent: "#22c55e", count: `${apr.filter((a) => a.approvalStatus === "approved").length}`, countLabel: "ready to post" },
    { n: 7, label: "Analytics tracking", sub: "Reach, engagement, growth", href: "/analytics", icon: "BarChart3", accent: "#14b8a6", count: formatNumber(totalFollowers), countLabel: "followers" },
    { n: 8, label: "Admissions leads", sub: "Capture & follow up", href: "/leads", icon: "Users", accent: "#8b5cf6", count: `${lds.length}`, countLabel: "leads" },
    { n: 9, label: "Revenue & monetization", sub: "Earnings + channel growth", href: "/monetization", icon: "Wallet", accent: "#ef4444", count: formatINR(monthlyRevenue.estimatedRevenue + monthlyRevenue.sponsorIncome), countLabel: "this month" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Workflow" subtitle="Your end-to-end pipeline — from idea to admission. Tap any stage to jump in." />

      <div className="flex items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs text-emerald-200">
        <Icon name="ShieldCheck" className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Safe by design: the app plans, generates, and tracks — it never auto-likes, auto-comments, auto-follows, or posts without admin approval. Posting stays manual (or PIN-gated).</p>
      </div>

      {/* Pipeline */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stages.map((st, i) => (
          <motion.div
            key={st.n}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative"
          >
            <Link href={st.href}>
              <GlassCard className="group h-full">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-black text-white" style={{ background: st.accent }}>
                    {st.n}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon name={st.icon} className="h-4 w-4" style={{ color: st.accent }} />
                      <h3 className="truncate font-semibold">{st.label}</h3>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted">{st.sub}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xl font-bold" style={{ color: st.accent }}>{st.count}</p>
                    <p className="text-[10px] text-muted">{st.countLabel}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-muted transition group-hover:text-brand-400">
                    Open <Icon name="ChevronRight" className="h-3 w-3" />
                  </span>
                </div>
                {/* connector arrow to next */}
                {i < stages.length - 1 && (
                  <span className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-muted lg:grid">
                    <Icon name="ChevronRight" className="h-3.5 w-3.5" />
                  </span>
                )}
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Linear summary strip */}
      <GlassCard hover={false}>
        <h3 className="mb-3 text-sm font-semibold">The flow at a glance</h3>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-xs">
          {stages.map((st, i) => (
            <span key={st.n} className="flex items-center gap-1">
              <Link href={st.href} className={cn("rounded-full px-2.5 py-1 font-medium hover:brightness-110")} style={{ background: `${st.accent}22`, color: st.accent }}>
                {st.label}
              </Link>
              {i < stages.length - 1 && <Icon name="ChevronRight" className="h-3 w-3 text-muted" />}
            </span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
