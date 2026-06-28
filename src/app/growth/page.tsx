"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard, PageHeader, StatCard, Button } from "@/components/ui";
import { Icon } from "@/components/Icon";
import {
  schools, analytics, leads, SCHOOL_A, SCHOOL_B,
  computeSchoolScores, bestContentForSchool,
} from "@/lib/data/seed";
import { generateAccountGrowthPlan, type GeneratedGrowthPlan } from "@/lib/ai/generateAccountGrowthPlan";
import { formatNumber, platformColor, platformLabel, copyToClipboard, downloadText, cn } from "@/lib/utils";

const tierOf = (id: string): "established" | "growing" => (id === SCHOOL_A ? "established" : "growing");

function Ring({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative grid h-16 w-16 place-items-center">
        <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${value} 100`} />
        </svg>
        <span className="absolute text-sm font-bold">{value}</span>
      </div>
      <p className="mt-1 text-center text-[10px] text-muted">{label}</p>
    </div>
  );
}

export default function GrowthPage() {
  const [view, setView] = useState<string>(SCHOOL_A);

  return (
    <div className="space-y-6">
      <PageHeader title="Account Growth Studio" subtitle="Separate growth dashboard & AI agent for each school, plus head-to-head comparison." />

      <div className="flex flex-wrap gap-2">
        {schools.map((s) => (
          <button key={s.id} onClick={() => setView(s.id)} className={cn("rounded-xl px-3 py-1.5 text-xs font-medium", view === s.id ? "btn-primary" : "glass")}>
            {s.name.split(" ")[1]} · {s.branch}
          </button>
        ))}
        <button onClick={() => setView("compare")} className={cn("rounded-xl px-3 py-1.5 text-xs font-medium", view === "compare" ? "btn-primary" : "glass")}>
          ⚔️ Compare
        </button>
      </div>

      {view === "compare" ? <Comparison /> : <SchoolGrowth key={view} schoolId={view} />}
    </div>
  );
}

/* ----------------------------- per-school dashboard + agent ------------- */
function SchoolGrowth({ schoolId }: { schoolId: string }) {
  const school = schools.find((s) => s.id === schoolId)!;
  const scores = computeSchoolScores(schoolId);
  const followers = school.followers.instagram;
  const target = school.targetFollowers ?? followers * 2;
  const required = Math.max(0, target - followers);
  const tier = tierOf(schoolId);

  const [plan, setPlan] = useState<GeneratedGrowthPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState("");

  const run = async () => {
    setLoading(true);
    const p = await generateAccountGrowthPlan({
      schoolName: school.name, branch: school.branch, followers, targetFollowers: target, tier,
      admissionCTA: school.admissionCTA ?? "Contact us for admissions.",
    });
    await new Promise((r) => setTimeout(r, 350));
    setPlan(p);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      {/* Dashboard cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Current followers" value={formatNumber(followers)} sub={`${platformLabel("instagram")} · ${tier}`} icon={<Icon name="Instagram" className="h-5 w-5" />} accent={school.brandColors.primary} />
        <StatCard label="Target followers" value={formatNumber(target)} accent="#22c55e" icon={<Icon name="TrendingUp" className="h-5 w-5" />} />
        <StatCard label="Required growth" value={"+" + formatNumber(required)} sub={school.monthlyGrowthTarget} accent="#f59e0b" icon={<Icon name="UserPlus" className="h-5 w-5" />} />
      </div>

      <GlassCard hover={false}>
        <h3 className="mb-3 text-sm font-semibold">Account scores</h3>
        <div className="flex flex-wrap items-center justify-around gap-4">
          <Ring value={scores.contentConsistency} label="Content consistency" color="#3563ff" />
          <Ring value={scores.leadGeneration} label="Lead generation" color="#22c55e" />
          <Ring value={scores.accountHealth} label="Account health" color="#a855f7" />
        </div>
      </GlassCard>

      {/* Account Growth Agent */}
      <GlassCard hover={false}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${school.brandColors.primary}22`, color: school.brandColors.primary }}><Icon name="Bot" className="h-5 w-5" /></div>
            <div>
              <h3 className="font-semibold">Account Growth Agent — {school.branch}</h3>
              <p className="text-[11px] text-muted">{tier === "established" ? "Premium branding & admissions focus" : "Fast follower growth & local reach focus"}</p>
            </div>
          </div>
          <Button onClick={run} disabled={loading}><Icon name="Sparkles" className="h-4 w-4" /> {loading ? "Generating…" : "Generate growth plan"}</Button>
        </div>

        {plan && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Mini label="Best posting time" value={plan.bestPostingTime} />
              <Mini label="Growth target" value={plan.growthTarget} />
              <Mini label="Admission CTA" value={plan.admissionCTA} />
            </div>

            <Panel title="7-day content plan">
              <div className="space-y-1.5">
                {plan.sevenDayPlan.map((d) => (
                  <div key={d.day} className="flex items-center gap-2 rounded-lg glass p-2 text-xs">
                    <span className="w-9 font-bold">{d.day}</span>
                    <span className="h-2 w-2 rounded-full" style={{ background: platformColor(d.platform) }} />
                    <span className="flex-1">{d.idea}</span>
                    <span className="text-muted">{d.type}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="30-day content plan">
              <div className="grid gap-2 sm:grid-cols-2">
                {plan.thirtyDayPlan.map((w) => (
                  <div key={w.week} className="rounded-lg glass p-2.5">
                    <p className="text-xs font-semibold">{w.week} — <span className="text-brand-400">{w.theme}</span></p>
                    <ul className="mt-1 space-y-0.5 text-[11px] text-muted">{w.posts.map((p) => <li key={p}>• {p}</li>)}</ul>
                  </div>
                ))}
              </div>
            </Panel>

            <div className="grid gap-3 lg:grid-cols-2">
              <CopyPanel title="Daily reel idea" text={plan.dailyReelIdea} />
              <CopyPanel title="Voiceover" text={plan.voiceover} />
              <CopyPanel title="Caption" text={plan.caption} />
              <CopyPanel title="Hashtags" text={plan.hashtags.join(" ")} />
            </div>

            <Panel title="Shot list">
              <ol className="list-decimal space-y-0.5 pl-5 text-xs text-muted">{plan.shotList.map((s) => <li key={s}>{s}</li>)}</ol>
            </Panel>

            <div className="flex flex-wrap gap-2">
              <Button variant="soft" onClick={() => { setSaved("calendar"); setTimeout(() => setSaved(""), 1500); }}><Icon name="CalendarDays" className="h-4 w-4" /> {saved === "calendar" ? "Saved ✓" : "Save to calendar"}</Button>
              <Button variant="soft" onClick={() => { setSaved("approval"); setTimeout(() => setSaved(""), 1500); }}><Icon name="CheckCircle2" className="h-4 w-4" /> {saved === "approval" ? "Sent ✓" : "Mark for approval"}</Button>
              <Button variant="soft" onClick={() => downloadText(`${school.branch}-growth-plan.txt`, JSON.stringify(plan, null, 2))}><Icon name="Download" className="h-4 w-4" /> Export</Button>
            </div>
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}

/* ----------------------------- comparison ------------------------------- */
function Comparison() {
  const a = schools[0], b = schools[1];
  const metric = (id: string, fn: (rows: typeof analytics) => number) => fn(analytics.filter((x) => x.schoolId === id));
  const igFollowers = (id: string) => metric(id, (r) => r.find((x) => x.platform === "instagram")?.followers ?? 0);
  const reach = (id: string) => metric(id, (r) => r.reduce((s, x) => s + x.reach, 0));
  const eng = (id: string) => { const r = analytics.filter((x) => x.schoolId === id); return Math.round((r.reduce((s, x) => s + x.engagement, 0) / (r.length || 1)) * 10) / 10; };
  const leadCount = (id: string) => leads.filter((l) => l.schoolId === id).length;
  const enquiries = (id: string) => leads.filter((l) => l.schoolId === id && l.status !== "not_interested").length;
  const weekly = (id: string) => computeSchoolScores(id).weeklyGrowthPct;

  const rows = [
    { label: "Instagram followers", a: formatNumber(igFollowers(a.id)), b: formatNumber(igFollowers(b.id)) },
    { label: "Total reach", a: formatNumber(reach(a.id)), b: formatNumber(reach(b.id)) },
    { label: "Avg engagement", a: eng(a.id) + "%", b: eng(b.id) + "%" },
    { label: "Leads", a: String(leadCount(a.id)), b: String(leadCount(b.id)) },
    { label: "Admission enquiries", a: String(enquiries(a.id)), b: String(enquiries(b.id)) },
    { label: "Weekly growth", a: weekly(a.id) + "%", b: weekly(b.id) + "%" },
    { label: "Best performing content", a: bestContentForSchool(a.id)?.title ?? "—", b: bestContentForSchool(b.id)?.title ?? "—" },
  ];

  return (
    <GlassCard hover={false} className="overflow-x-auto">
      <h3 className="mb-3 font-semibold">Sri Narayana vs Sri Adarshavani</h3>
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th className="pb-2">Metric</th>
            <th className="pb-2" style={{ color: a.brandColors.primary }}>{a.name} ({a.branch})</th>
            <th className="pb-2" style={{ color: b.brandColors.primary }}>{b.name} ({b.branch})</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-white/5">
              <td className="py-2.5 text-muted">{r.label}</td>
              <td className="py-2.5 font-medium">{r.a}</td>
              <td className="py-2.5 font-medium">{r.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-muted">Narayana is the established account (premium branding, target 10K). Adarshavani is the growing account (daily reels, target 2K). Give Adarshavani more daily volume; give Narayana higher production value.</p>
    </GlassCard>
  );
}

/* ----------------------------- small helpers ---------------------------- */
function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl glass p-2.5">
      <p className="text-[10px] uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-[13px] font-semibold">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl glass p-3">
      <h4 className="mb-2 text-sm font-semibold">{title}</h4>
      {children}
    </div>
  );
}

function CopyPanel({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl glass p-3">
      <div className="mb-1 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        <button onClick={async () => { await copyToClipboard(text); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="rounded-lg p-1.5 hover:bg-white/10"><Icon name="Copy" className="h-3.5 w-3.5" /></button>
      </div>
      <pre className="whitespace-pre-wrap break-words font-sans text-[12px] text-muted">{text}</pre>
      {copied && <span className="text-[10px] text-emerald-400">Copied!</span>}
    </div>
  );
}
