"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassCard, PageHeader, Button, StatusBadge, Select } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useSchool } from "@/components/SchoolProvider";
import { leads as seed, schools } from "@/lib/data/seed";
import { generateLeadFollowup, type GeneratedLeadFollowup } from "@/lib/ai/generateLeadFollowup";
import { copyToClipboard, platformLabel, prettyLabel } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/lib/types";

const STATUSES: LeadStatus[] = ["new", "contacted", "visited", "joined", "not_interested"];

export default function LeadsPage() {
  const { activeSchool } = useSchool();
  const [items, setItems] = useState<Lead[]>(seed);
  const [active, setActive] = useState<Lead | null>(null);
  const [followup, setFollowup] = useState<GeneratedLeadFollowup | null>(null);
  const [loading, setLoading] = useState(false);

  const visible = items.filter((l) => activeSchool === "all" || l.schoolId === activeSchool);
  const setStatus = (id: string, status: LeadStatus) =>
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));

  const openFollowup = async (lead: Lead) => {
    setActive(lead);
    setFollowup(null);
    setLoading(true);
    const s = schools.find((x) => x.id === lead.schoolId)!;
    const r = await generateLeadFollowup(lead, s.name);
    await new Promise((res) => setTimeout(res, 300));
    setFollowup(r);
    setLoading(false);
  };

  const counts = STATUSES.map((s) => ({ s, n: visible.filter((l) => l.status === s).length }));

  return (
    <div className="space-y-6">
      <PageHeader title="Admissions Lead Tracker" subtitle="Enquiries from social media. AI drafts the follow-up — you send it." action={<Button><Icon name="Plus" className="h-4 w-4" /> Add lead</Button>} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {counts.map(({ s, n }) => (
          <GlassCard key={s} className="text-center"><p className="text-2xl font-bold">{n}</p><p className="text-[11px] text-muted">{prettyLabel(s)}</p></GlassCard>
        ))}
      </div>

      <GlassCard hover={false} className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="pb-2">Parent / Student</th>
              <th className="pb-2">Phone</th>
              <th className="pb-2">Class</th>
              <th className="pb-2">Source</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Follow-up</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((l) => (
              <tr key={l.id} className="border-t border-white/5">
                <td className="py-2.5">
                  <p className="font-medium">{l.parentName}</p>
                  <p className="text-[11px] text-muted">{l.studentName}</p>
                </td>
                <td className="py-2.5 text-muted">{l.phone}</td>
                <td className="py-2.5">{l.classInterested}</td>
                <td className="py-2.5"><span className="inline-flex items-center gap-1 text-xs"><Icon name={platformLabel(l.source)} className="h-3.5 w-3.5" /> {platformLabel(l.source)}</span></td>
                <td className="py-2.5">
                  <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value as LeadStatus)} className="px-2 py-1 text-xs">
                    {STATUSES.map((s) => <option key={s} value={s} className="bg-slate-900">{prettyLabel(s)}</option>)}
                  </select>
                </td>
                <td className="py-2.5 text-muted">{l.followUpDate ?? "—"}</td>
                <td className="py-2.5">
                  <Button variant="soft" onClick={() => openFollowup(l)}><Icon name="MessageCircle" className="h-3.5 w-3.5" /> AI follow-up</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      <AnimatePresence>
        {active && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)} />
            <motion.div className="glass-strong fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-3xl p-5 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[460px] sm:max-h-full sm:rounded-l-3xl"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-bold">Follow-up for {active.parentName}</h2>
                  <p className="text-xs text-muted">{active.studentName} · {active.classInterested}</p>
                </div>
                <button onClick={() => setActive(null)} className="rounded-lg p-2 hover:bg-white/10"><Icon name="X" className="h-4 w-4" /></button>
              </div>
              {loading && <p className="text-sm text-muted">Generating…</p>}
              {followup && (
                <div className="space-y-3">
                  <FU title="WhatsApp message" text={followup.whatsappMessage} />
                  <FU title="Call script" text={followup.callScript} />
                  <FU title="Admission reminder" text={followup.admissionReminder} />
                  <FU title="Parent trust message" text={followup.parentTrustMessage} />
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FU({ title, text }: { title: string; text: string }) {
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
