"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassCard, PageHeader, Button, StatusBadge, ConsentWarning } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useSchool } from "@/components/SchoolProvider";
import { approvals as seed, schools, currentUser } from "@/lib/data/seed";
import { platformLabel } from "@/lib/utils";
import { autoPublish } from "@/lib/adapters/publish";
import type { ApprovalItem, ApprovalStatus } from "@/lib/types";

const TABS: { key: ApprovalStatus | "all"; label: string }[] = [
  { key: "waiting_for_approval", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "published", label: "Published" },
  { key: "all", label: "All" },
];

export default function ApprovalsPage() {
  const { activeSchool } = useSchool();
  const [items, setItems] = useState<ApprovalItem[]>(seed);
  const [tab, setTab] = useState<ApprovalStatus | "all">("waiting_for_approval");
  const isAdmin = currentUser.role === "super_admin";

  // Auto-post (PIN-gated) state
  const [pinItem, setPinItem] = useState<ApprovalItem | null>(null);
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [posting, setPosting] = useState(false);

  const submitPin = async () => {
    if (!pinItem) return;
    setPosting(true);
    const res = await autoPublish(pinItem, pin);
    setPosting(false);
    setPinMsg({ ok: res.ok, text: res.message });
    if (res.ok) {
      setStatus(pinItem.id, "published", { publishedLink: res.link });
      setTimeout(() => closePin(), 1200);
    }
  };
  const closePin = () => { setPinItem(null); setPin(""); setPinMsg(null); };

  const visible = items.filter(
    (i) =>
      (activeSchool === "all" || i.schoolId === activeSchool) &&
      (tab === "all" || i.approvalStatus === tab)
  );

  const setStatus = (id: string, approvalStatus: ApprovalStatus, extra: Partial<ApprovalItem> = {}) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, approvalStatus, reviewer: currentUser.name, ...extra } : i)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approval Workflow"
        subtitle="No content is post-ready without admin approval. Publishing is always manual."
      />

      {!isAdmin && (
        <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-xs text-amber-300">
          You are signed in as {currentUser.role.replace("_", " ")}. Only Super Admins can approve or reject.
        </div>
      )}

      <div className="flex items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs text-emerald-200">
        <Icon name="ShieldCheck" className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Auto-post is locked behind admin approval <strong>and</strong> a PIN. A post only goes out when the content is Approved, the correct PIN is entered, and the platform&apos;s official API is connected. The app never likes, comments, follows, or posts unapproved content.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const count = items.filter((i) => t.key === "all" || i.approvalStatus === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium ${tab === t.key ? "btn-primary" : "glass"}`}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((i) => {
          const s = schools.find((x) => x.id === i.schoolId);
          return (
            <motion.div key={i.id} layout>
              <GlassCard hover={false}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{i.title}</h3>
                    <p className="text-[11px] text-muted">{s?.branch} · {platformLabel(i.platform)} · by {i.submittedBy}</p>
                  </div>
                  <StatusBadge status={i.approvalStatus} />
                </div>

                <p className="mt-3 rounded-xl glass p-3 text-sm">{i.caption}</p>

                {i.comment && <p className="mt-2 text-xs text-red-300">Reviewer note: {i.comment}</p>}
                {i.publishedLink && (
                  <p className="mt-2 text-xs text-brand-400">Published: {i.publishedLink}</p>
                )}

                {i.title.toLowerCase().includes("achievement") && (
                  <div className="mt-3"><ConsentWarning>This post features a student — confirm signed parent consent before approving.</ConsentWarning></div>
                )}

                {isAdmin && i.approvalStatus !== "published" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {i.approvalStatus !== "approved" && (
                      <Button onClick={() => setStatus(i.id, "approved")}><Icon name="CheckCircle2" className="h-4 w-4" /> Approve</Button>
                    )}
                    <Button variant="soft" onClick={() => {
                      const c = window.prompt("Reason for rejection / requested change:");
                      if (c !== null) setStatus(i.id, "rejected", { comment: c || "Changes requested." });
                    }}>
                      <Icon name="X" className="h-4 w-4" /> Reject / Request changes
                    </Button>
                    {i.approvalStatus === "approved" && (
                      <>
                        <Button variant="soft" onClick={() => {
                          const link = window.prompt("Paste the published post link:");
                          if (link) setStatus(i.id, "published", { publishedLink: link });
                        }}>
                          <Icon name="ChevronRight" className="h-4 w-4" /> Mark as Published
                        </Button>
                        {i.platform !== "whatsapp" && (
                          <Button onClick={() => { setPinMsg(null); setPin(""); setPinItem(i); }}>
                            <Icon name="ShieldCheck" className="h-4 w-4" /> Auto-post (PIN)
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
        {visible.length === 0 && <p className="text-sm text-muted">Nothing here in this tab.</p>}
      </div>

      {/* PIN-gated auto-post modal */}
      <AnimatePresence>
        {pinItem && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closePin} />
            <motion.div
              className="glass-strong fixed left-1/2 top-1/2 z-50 w-[92%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/15 text-emerald-400"><Icon name="ShieldCheck" className="h-5 w-5" /></div>
                <div>
                  <h2 className="font-bold">Admin auto-post</h2>
                  <p className="text-[11px] text-muted">{pinItem.title} · {platformLabel(pinItem.platform)}</p>
                </div>
              </div>
              <p className="mb-3 text-xs text-muted">Enter the admin PIN to authorise posting this approved content to the school&apos;s {platformLabel(pinItem.platform)} account.</p>
              <input
                type="password"
                inputMode="numeric"
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitPin()}
                placeholder="••••"
                className="w-full px-3 py-2 text-center text-lg tracking-[0.5em]"
              />
              {pinMsg && (
                <p className={`mt-3 rounded-xl p-2.5 text-xs ${pinMsg.ok ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-200"}`}>{pinMsg.text}</p>
              )}
              <div className="mt-4 flex gap-2">
                <Button variant="soft" className="flex-1" onClick={closePin}>Cancel</Button>
                <Button className="flex-1" disabled={posting || pin.length === 0} onClick={submitPin}>
                  <Icon name="ShieldCheck" className="h-4 w-4" /> {posting ? "Checking…" : "Authorise & post"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
