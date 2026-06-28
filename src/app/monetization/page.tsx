"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassCard, PageHeader, StatCard, Button, Field, Select } from "@/components/ui";
import { Icon } from "@/components/Icon";
import {
  youtubeTracker, instagramTracker, facebookTracker, businessEarnings,
  sponsors as seedSponsors, monthlyRevenue, schools,
} from "@/lib/data/seed";
import { generateSponsorPitch, type GeneratedSponsorPitch } from "@/lib/ai/generateSponsorPitch";
import { formatINR, formatNumber, platformColor, platformLabel, copyToClipboard, downloadText, prettyLabel } from "@/lib/utils";
import type { Sponsor, SponsorStatus } from "@/lib/types";

function Progress({ value, target, accent }: { value: number; target: number; accent: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted">{formatNumber(value)} / {formatNumber(target)}</span>
        <span className="font-semibold" style={{ color: accent }}>{pct}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: accent }} />
      </div>
    </div>
  );
}

export default function MonetizationPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Monetization & Growth" subtitle="Track channel eligibility, growth targets, school earnings and sponsors — all in one place." />

      <RevenueReport />

      <div className="grid gap-4 lg:grid-cols-3">
        <YouTubeTracker />
        <InstagramTracker />
        <FacebookTracker />
      </div>

      <BusinessEarnings />
      <SponsorManager />
      <SponsorPitchGenerator />
    </div>
  );
}

/* ----------------------------- 7. Monthly Revenue Report (top summary) --- */
function RevenueReport() {
  const m = monthlyRevenue;
  const maxRev = Math.max(...m.revenueByPlatform.map((r) => r.value));
  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Icon name="BarChart3" className="h-5 w-5 text-brand-400" /> Monthly Revenue Report — {m.month}</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total leads" value={m.totalLeads} icon={<Icon name="Users" className="h-5 w-5" />} />
        <StatCard label="Converted admissions" value={m.convertedAdmissions} accent="#22c55e" icon={<Icon name="UserPlus" className="h-5 w-5" />} />
        <StatCard label="Estimated revenue" value={formatINR(m.estimatedRevenue)} accent="#a855f7" icon={<Icon name="Wallet" className="h-5 w-5" />} />
        <StatCard label="Sponsor income" value={formatINR(m.sponsorIncome)} accent="#f59e0b" icon={<Icon name="Sparkles" className="h-5 w-5" />} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassCard hover={false} className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Revenue by platform</h3>
          <div className="space-y-3">
            {m.revenueByPlatform.map((r) => (
              <div key={r.platform} className="flex items-center gap-3">
                <Icon name={platformLabel(r.platform)} className="h-4 w-4" style={{ color: platformColor(r.platform) }} />
                <span className="w-20 text-xs">{platformLabel(r.platform)}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${(r.value / maxRev) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="h-full rounded-full" style={{ background: platformColor(r.platform) }} />
                </div>
                <span className="w-20 text-right text-xs text-muted">{formatINR(r.value)}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard hover={false}>
          <h3 className="mb-2 text-sm font-semibold">AI summary</h3>
          <p className="text-xs text-muted">YouTube: {m.youtubeProgress}.</p>
          <p className="mt-2 rounded-xl border border-brand-500/30 bg-brand-500/10 p-2.5 text-xs">
            🏆 Best platform for revenue: <strong>{m.bestPlatformForRevenue}</strong>
          </p>
          <Button variant="soft" className="mt-3 w-full" onClick={() => downloadText("revenue-report.txt", JSON.stringify(m, null, 2))}>
            <Icon name="Download" className="h-4 w-4" /> Export report
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}

/* ----------------------------- 1. YouTube Monetization Tracker ----------- */
function YouTubeTracker() {
  const y = youtubeTracker;
  const eligible = Math.round((Math.min(1, y.subscribers / y.subscribersTarget) * 0.5 + Math.min(1, y.publicWatchHours / y.watchHoursTarget) * 0.5) * 100);
  return (
    <GlassCard hover={false}>
      <div className="mb-3 flex items-center gap-2"><Icon name="Youtube" className="h-5 w-5 text-red-500" /><h3 className="font-semibold">YouTube Monetization</h3></div>
      <div className="grid grid-cols-2 gap-2 text-center">
        {[
          { l: "Subscribers", v: formatNumber(y.subscribers) },
          { l: "Watch hours", v: formatNumber(y.publicWatchHours) },
          { l: "Shorts views", v: formatNumber(y.shortsViews) },
          { l: "Uploads", v: y.uploads },
        ].map((s) => (
          <div key={s.l} className="rounded-xl glass p-2"><p className="text-lg font-bold">{s.v}</p><p className="text-[10px] text-muted">{s.l}</p></div>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        <div><p className="mb-1 text-xs font-medium">Subscribers → 1,000</p><Progress value={y.subscribers} target={y.subscribersTarget} accent="#ef4444" /></div>
        <div><p className="mb-1 text-xs font-medium">Public watch hours → 4,000</p><Progress value={y.publicWatchHours} target={y.watchHoursTarget} accent="#f59e0b" /></div>
      </div>
      <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 p-2.5 text-xs">
        <p className="font-semibold">Eligibility: {eligible}% to YouTube Partner Program</p>
        <p className="mt-1 text-muted">🎯 Next target: {y.nextTarget}</p>
      </div>
      <div className="mt-3">
        <p className="mb-1 text-xs font-semibold">Weekly action plan</p>
        <ul className="space-y-1 text-[11px] text-muted">{y.weeklyActions.map((a) => <li key={a}>• {a}</li>)}</ul>
      </div>
    </GlassCard>
  );
}

/* ----------------------------- 2. Instagram Growth Tracker --------------- */
function InstagramTracker() {
  const i = instagramTracker;
  return (
    <GlassCard hover={false}>
      <div className="mb-3 flex items-center gap-2"><Icon name="Instagram" className="h-5 w-5 text-pink-500" /><h3 className="font-semibold">Instagram Growth</h3></div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { l: "Followers", v: formatNumber(i.followers) },
          { l: "Reel views", v: formatNumber(i.reelViews) },
          { l: "Engagement", v: i.engagementRate + "%" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl glass p-2"><p className="text-base font-bold">{s.v}</p><p className="text-[10px] text-muted">{s.l}</p></div>
        ))}
      </div>
      <div className="mt-4">
        <p className="mb-1 text-xs font-medium">Growth to 10K followers</p>
        <Progress value={i.followers} target={i.followersTarget} accent="#ec4899" />
        <p className="mt-1 text-[11px] text-emerald-400">+{i.weeklyGrowth} followers this week</p>
      </div>
      <div className="mt-4 rounded-xl border border-pink-500/25 bg-pink-500/10 p-2.5 text-xs">
        <p className="font-semibold">⭐ Best reel</p>
        <p className="mt-0.5 text-muted">{i.bestReel.title}</p>
        <p className="text-[11px] text-muted">{formatNumber(i.bestReel.views)} views · {formatNumber(i.bestReel.likes)} likes</p>
      </div>
      <div className="mt-3">
        <p className="mb-1 text-xs font-semibold">Growth actions</p>
        <ul className="space-y-1 text-[11px] text-muted">{i.growthActions.map((a) => <li key={a}>• {a}</li>)}</ul>
      </div>
    </GlassCard>
  );
}

/* ----------------------------- 3. Facebook Monetization Tracker ---------- */
function FacebookTracker() {
  const f = facebookTracker;
  return (
    <GlassCard hover={false}>
      <div className="mb-3 flex items-center gap-2"><Icon name="Facebook" className="h-5 w-5 text-blue-500" /><h3 className="font-semibold">Facebook Monetization</h3></div>
      <div className="grid grid-cols-2 gap-2 text-center">
        {[
          { l: "Followers", v: formatNumber(f.followers) },
          { l: "Page reach", v: formatNumber(f.pageReach) },
          { l: "Reels views", v: formatNumber(f.reelsViews) },
          { l: "Engagement", v: f.engagementRate + "%" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl glass p-2"><p className="text-base font-bold">{s.v}</p><p className="text-[10px] text-muted">{s.l}</p></div>
        ))}
      </div>
      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold">Eligibility checklist</p>
        <div className="space-y-1.5">
          {f.checklist.map((c) => (
            <div key={c.item} className="flex items-center gap-2 text-xs">
              <Icon name="CheckCircle2" className={`h-4 w-4 shrink-0 ${c.done ? "text-emerald-400" : "text-muted opacity-40"}`} />
              <span className={c.done ? "" : "text-muted"}>{c.item}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

/* ----------------------------- 4. School Business Earnings --------------- */
function BusinessEarnings() {
  const total = businessEarnings.reduce((s, e) => s + e.thisMonth, 0);
  const lastTotal = businessEarnings.reduce((s, e) => s + e.lastMonth, 0);
  const growth = lastTotal ? Math.round(((total - lastTotal) / lastTotal) * 100) : 100;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><Icon name="Wallet" className="h-5 w-5 text-emerald-400" /> School Business Earnings</h2>
        <span className="text-sm text-muted">Total this month: <strong className="text-emerald-400">{formatINR(total)}</strong> ({growth >= 0 ? "+" : ""}{growth}%)</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {businessEarnings.map((e) => {
          const up = e.thisMonth >= e.lastMonth;
          return (
            <GlassCard key={e.source}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/15 text-emerald-400"><Icon name={e.icon} className="h-4 w-4" /></div>
                  <h3 className="text-sm font-semibold">{e.source}</h3>
                </div>
              </div>
              <p className="mt-3 text-xl font-bold">{formatINR(e.thisMonth)}</p>
              <p className={`text-[11px] ${up ? "text-emerald-400" : "text-red-400"}`}>
                {up ? "▲" : "▼"} vs {formatINR(e.lastMonth)} last month
              </p>
              <p className="mt-1 text-[11px] text-muted">{e.note}</p>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------- 5. Sponsor Manager ------------------------ */
const SPONSOR_STATUSES: SponsorStatus[] = ["prospect", "contacted", "negotiating", "active", "completed", "declined"];
const emptySponsor = (): Sponsor => ({ id: "", name: "", businessType: "", contactNumber: "", packageAmount: 0, startDate: "", endDate: "", deliverables: "", status: "prospect" });

function SponsorManager() {
  const [list, setList] = useState<Sponsor[]>(seedSponsors);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Sponsor>(emptySponsor());

  const totalActive = list.filter((s) => s.status === "active").reduce((s, x) => s + x.packageAmount, 0);

  const save = () => {
    if (!draft.name.trim()) return;
    setList((prev) => [{ ...draft, id: `sp_${Date.now()}` }, ...prev]);
    setDraft(emptySponsor());
    setAdding(false);
  };
  const setStatus = (id: string, status: SponsorStatus) => setList((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><Icon name="Sparkles" className="h-5 w-5 text-amber-400" /> Sponsor Manager</h2>
        <Button onClick={() => setAdding((v) => !v)}><Icon name={adding ? "X" : "Plus"} className="h-4 w-4" /> {adding ? "Cancel" : "Add sponsor"}</Button>
      </div>
      <p className="mb-3 text-sm text-muted">Active sponsorship value: <strong className="text-emerald-400">{formatINR(totalActive)}</strong></p>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
            <GlassCard hover={false}>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Field label="Sponsor name"><input className="w-full px-3 py-2 text-sm" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
                <Field label="Business type"><input className="w-full px-3 py-2 text-sm" value={draft.businessType} onChange={(e) => setDraft({ ...draft, businessType: e.target.value })} /></Field>
                <Field label="Contact number"><input className="w-full px-3 py-2 text-sm" value={draft.contactNumber} onChange={(e) => setDraft({ ...draft, contactNumber: e.target.value })} /></Field>
                <Field label="Package amount (₹)"><input type="number" className="w-full px-3 py-2 text-sm" value={draft.packageAmount || ""} onChange={(e) => setDraft({ ...draft, packageAmount: Number(e.target.value) })} /></Field>
                <Field label="Start date"><input type="date" className="w-full px-3 py-2 text-sm" value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} /></Field>
                <Field label="End date"><input type="date" className="w-full px-3 py-2 text-sm" value={draft.endDate} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} /></Field>
                <Field label="Status"><Select value={draft.status} onChange={(v) => setDraft({ ...draft, status: v as SponsorStatus })} options={SPONSOR_STATUSES.map((s) => ({ value: s, label: prettyLabel(s) }))} /></Field>
                <div className="col-span-2 lg:col-span-4"><Field label="Deliverables"><input className="w-full px-3 py-2 text-sm" placeholder="e.g. Banner + 2 reel shoutouts" value={draft.deliverables} onChange={(e) => setDraft({ ...draft, deliverables: e.target.value })} /></Field></div>
              </div>
              <Button onClick={save} className="mt-3"><Icon name="CheckCircle2" className="h-4 w-4" /> Save sponsor</Button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard hover={false} className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="pb-2">Sponsor</th><th className="pb-2">Type</th><th className="pb-2">Contact</th><th className="pb-2">Package</th><th className="pb-2">Period</th><th className="pb-2">Deliverables</th><th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-t border-white/5 align-top">
                <td className="py-2.5 font-medium">{s.name}</td>
                <td className="py-2.5 text-muted">{s.businessType}</td>
                <td className="py-2.5 text-muted">{s.contactNumber}</td>
                <td className="py-2.5">{formatINR(s.packageAmount)}</td>
                <td className="py-2.5 text-[11px] text-muted">{s.startDate || "—"}<br />{s.endDate || ""}</td>
                <td className="py-2.5 max-w-[180px] text-[11px] text-muted">{s.deliverables}</td>
                <td className="py-2.5">
                  <select value={s.status} onChange={(e) => setStatus(s.id, e.target.value as SponsorStatus)} className="px-2 py-1 text-xs">
                    {SPONSOR_STATUSES.map((st) => <option key={st} value={st} className="bg-slate-900">{prettyLabel(st)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}

/* ----------------------------- 6. AI Sponsor Pitch Generator ------------- */
function SponsorPitchGenerator() {
  const [schoolId, setSchoolId] = useState(schools[0].id);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Stationery shop");
  const [eventOrVideo, setEventOrVideo] = useState("Annual Day 2026");
  const [pkg, setPkg] = useState("Banner + 2 reel shoutouts");
  const [result, setResult] = useState<GeneratedSponsorPitch | null>(null);
  const [loading, setLoading] = useState(false);

  const school = schools.find((s) => s.id === schoolId)!;
  const audience = `${formatNumber(school.followers.instagram + school.followers.facebook)}+ local parents on Instagram & Facebook`;

  const run = async () => {
    setLoading(true);
    const r = await generateSponsorPitch({ schoolName: `${school.name} (${school.branch})`, businessName, businessType, eventOrVideo, package: pkg, audience });
    await new Promise((res) => setTimeout(res, 300));
    setResult(r);
    setLoading(false);
  };

  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Icon name="Bot" className="h-5 w-5 text-brand-400" /> AI Sponsor Pitch Generator</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard hover={false}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="School"><Select value={schoolId} onChange={setSchoolId} options={schools.map((s) => ({ value: s.id, label: s.branch }))} /></Field>
            <Field label="Business name"><input className="w-full px-3 py-2 text-sm" placeholder="e.g. Sri Lakshmi Stationery" value={businessName} onChange={(e) => setBusinessName(e.target.value)} /></Field>
            <Field label="Business type"><input className="w-full px-3 py-2 text-sm" value={businessType} onChange={(e) => setBusinessType(e.target.value)} /></Field>
            <Field label="Event / video"><input className="w-full px-3 py-2 text-sm" value={eventOrVideo} onChange={(e) => setEventOrVideo(e.target.value)} /></Field>
            <div className="col-span-2"><Field label="Sponsorship package"><input className="w-full px-3 py-2 text-sm" value={pkg} onChange={(e) => setPkg(e.target.value)} /></Field></div>
          </div>
          <Button onClick={run} disabled={loading} className="mt-4 w-full"><Icon name="Sparkles" className="h-4 w-4" /> {loading ? "Generating…" : "Generate sponsor pitch"}</Button>
          <p className="mt-2 text-[11px] text-muted">Generates a brand-safe outreach message. Review before sending — the app never sends messages automatically.</p>
        </GlassCard>

        <div className="space-y-3">
          {result ? (
            <>
              <PitchBlock title="WhatsApp pitch" text={result.whatsappPitch} />
              <PitchBlock title="Email pitch" text={result.emailPitch} />
              <PitchBlock title="Call opening" text={result.callOpening} />
              <GlassCard hover={false}>
                <h4 className="mb-2 text-sm font-semibold">Suggested packages</h4>
                <div className="space-y-1.5">
                  {result.packageOptions.map((p) => (
                    <div key={p.tier} className="flex items-center justify-between rounded-xl glass p-2 text-xs">
                      <span className="font-semibold">{p.tier} · {p.price}</span>
                      <span className="text-muted">{p.includes}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          ) : (
            <GlassCard hover={false} className="grid min-h-[200px] place-items-center text-center text-sm text-muted">
              <div><Icon name="Bot" className="mx-auto mb-2 h-8 w-8 opacity-50" />Fill in the details and generate a sponsor pitch.</div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

function PitchBlock({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <GlassCard hover={false}>
      <div className="mb-1 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        <div className="flex gap-1">
          <button onClick={async () => { await copyToClipboard(text); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="rounded-lg p-1.5 hover:bg-white/10"><Icon name="Copy" className="h-3.5 w-3.5" /></button>
          <button onClick={() => downloadText(`${title.replace(/\s+/g, "-")}.txt`, text)} className="rounded-lg p-1.5 hover:bg-white/10"><Icon name="Download" className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <pre className="whitespace-pre-wrap break-words font-sans text-[12px] text-muted">{text}</pre>
      {copied && <span className="text-[10px] text-emerald-400">Copied!</span>}
    </GlassCard>
  );
}
