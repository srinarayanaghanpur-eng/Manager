"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard, PageHeader, StatCard, Button } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useSchool } from "@/components/SchoolProvider";
import { analytics, schools, SCHOOL_A, SCHOOL_B } from "@/lib/data/seed";
import { generateAnalyticsInsight, type GeneratedAnalyticsInsight } from "@/lib/ai/generateAnalyticsInsight";
import { formatNumber, platformColor, platformLabel } from "@/lib/utils";

export default function AnalyticsPage() {
  const { activeSchool } = useSchool();
  const [insight, setInsight] = useState<GeneratedAnalyticsInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const rows = activeSchool === "all" ? analytics : analytics.filter((a) => a.schoolId === activeSchool);
  const sum = (k: keyof (typeof analytics)[number]) => rows.reduce((s, r) => s + (r[k] as number), 0);

  const topPosts = [
    { title: "Admissions Open 2026 🎓", platform: "instagram", views: 6200, likes: 412 },
    { title: "A Day at School (tour)", platform: "youtube", views: 11200, likes: 540 },
    { title: "Teacher tips Short", platform: "youtube", views: 5100, likes: 280 },
    { title: "Parent must-know carousel", platform: "facebook", views: 1900, likes: 210 },
    { title: "Independence Day reel", platform: "instagram", views: 3600, likes: 388 },
  ].sort((a, b) => b.views - a.views);

  const runInsight = async () => {
    setLoading(true);
    const names = { [SCHOOL_A]: schools[0].name, [SCHOOL_B]: schools[1].name };
    const r = await generateAnalyticsInsight(analytics, names);
    await new Promise((res) => setTimeout(res, 300));
    setInsight(r);
    setLoading(false);
  };

  useEffect(() => { runInsight(); }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Mock analytics now — swap to live APIs via the adapters later." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Followers" value={formatNumber(sum("followers"))} icon={<Icon name="Users" className="h-5 w-5" />} />
        <StatCard label="Reach" value={formatNumber(sum("reach"))} accent="#a855f7" icon={<Icon name="Eye" className="h-5 w-5" />} />
        <StatCard label="Views" value={formatNumber(sum("views"))} accent="#06b6d4" icon={<Icon name="Eye" className="h-5 w-5" />} />
        <StatCard label="Watch hours" value={formatNumber(sum("watchTimeHours"))} accent="#22c55e" icon={<Icon name="Clock" className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Likes" value={formatNumber(sum("likes"))} icon={<Icon name="Heart" className="h-5 w-5" />} />
        <StatCard label="Comments" value={formatNumber(sum("comments"))} accent="#f59e0b" icon={<Icon name="MessageCircle" className="h-5 w-5" />} />
        <StatCard label="Shares" value={formatNumber(sum("shares"))} accent="#ec4899" icon={<Icon name="Share2" className="h-5 w-5" />} />
        <StatCard label="Saves" value={formatNumber(sum("saves"))} accent="#14b8a6" icon={<Icon name="Bookmark" className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Per-platform breakdown */}
        <GlassCard hover={false} className="lg:col-span-2">
          <h3 className="mb-3 font-semibold">Per-platform performance</h3>
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.schoolId + r.platform} className="flex items-center gap-3">
                <Icon name={platformLabel(r.platform)} className="h-4 w-4" style={{ color: platformColor(r.platform) }} />
                <span className="w-24 truncate text-xs">{platformLabel(r.platform)}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, r.engagement * 12)}%` }} transition={{ duration: 0.7 }} className="h-full rounded-full" style={{ background: platformColor(r.platform) }} />
                </div>
                <span className="w-28 text-right text-[11px] text-muted">{r.engagement}% eng · {r.bestPostingTime}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Growth comparison */}
        <GlassCard hover={false}>
          <h3 className="mb-3 font-semibold">School growth comparison</h3>
          {schools.map((s) => {
            const ig = analytics.find((a) => a.schoolId === s.id && a.platform === "instagram")!;
            const start = ig.followerHistory[0].value;
            const end = ig.followerHistory[ig.followerHistory.length - 1].value;
            const pct = Math.round(((end - start) / start) * 100);
            return (
              <div key={s.id} className="mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate font-medium">{s.branch}</span>
                  <span className="text-emerald-400">+{pct}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct * 4)}%`, background: `linear-gradient(90deg, ${s.brandColors.primary}, ${s.brandColors.secondary})` }} />
                </div>
                <p className="mt-1 text-[10px] text-muted">{formatNumber(start)} → {formatNumber(end)} IG followers</p>
              </div>
            );
          })}
        </GlassCard>
      </div>

      {/* Top posts */}
      <GlassCard hover={false}>
        <h3 className="mb-3 font-semibold">Top 5 posts</h3>
        <div className="space-y-2">
          {topPosts.map((p, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl glass p-2.5">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500/30 text-xs font-bold">{i + 1}</span>
              <Icon name={platformLabel(p.platform)} className="h-4 w-4" style={{ color: platformColor(p.platform) }} />
              <span className="min-w-0 flex-1 truncate text-sm">{p.title}</span>
              <span className="text-xs text-muted">{formatNumber(p.views)} views · {p.likes} ❤</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* AI analysis */}
      <GlassCard hover={false}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">🤖 AI Weekly Analysis</h3>
          <Button variant="soft" onClick={runInsight} disabled={loading}><Icon name="Sparkles" className="h-4 w-4" /> {loading ? "Analyzing…" : "Refresh"}</Button>
        </div>
        {insight && (
          <div className="grid gap-4 md:grid-cols-2">
            <Insight title="✅ What worked" items={insight.whatWorked} color="#22c55e" />
            <Insight title="⚠️ What failed" items={insight.whatFailed} color="#f59e0b" />
            <Insight title="📅 Post next week" items={insight.postNextWeek} color="#3563ff" />
            <Insight title="🛠️ Improvement plan" items={insight.improvementPlan} color="#a855f7" />
            <div className="md:col-span-2 rounded-xl border border-brand-500/30 bg-brand-500/10 p-3 text-sm">
              <strong>Needs attention:</strong> {insight.schoolNeedingAttention}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function Insight({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div className="rounded-xl glass p-3">
      <p className="mb-2 text-sm font-semibold" style={{ color }}>{title}</p>
      <ul className="space-y-1 text-xs text-muted">
        {items.map((it, i) => <li key={i}>• {it}</li>)}
      </ul>
    </div>
  );
}
