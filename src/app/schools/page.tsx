"use client";

import { useState } from "react";
import { GlassCard, PageHeader, Button, Field } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { schools as seedSchools } from "@/lib/data/seed";
import type { School } from "@/lib/types";
import { formatNumber, platformLabel } from "@/lib/utils";

export default function SchoolsPage() {
  const [list, setList] = useState<School[]>(seedSchools);
  const [editing, setEditing] = useState<string | null>(null);

  const update = (id: string, patch: Partial<School>) =>
    setList((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div className="space-y-6">
      <PageHeader title="School Account Manager" subtitle="Manage both school brand profiles and social links." />

      <div className="grid gap-6 lg:grid-cols-2">
        {list.map((s) => {
          const isEditing = editing === s.id;
          return (
            <GlassCard key={s.id} hover={false}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-14 w-14 place-items-center rounded-2xl text-lg font-bold text-white overflow-hidden"
                    style={s.logoUrl ? {} : { background: `linear-gradient(135deg, ${s.brandColors.primary}, ${s.brandColors.secondary})` }}
                  >
                    {s.logoUrl ? (
                      <img src={s.logoUrl} alt={s.name} className="h-full w-full object-contain" />
                    ) : (
                      s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold leading-tight">{s.name}</h3>
                    <p className="text-xs text-muted">📍 {s.branch}</p>
                  </div>
                </div>
                <Button variant="soft" onClick={() => setEditing(isEditing ? null : s.id)}>
                  {isEditing ? "Done" : "Edit"}
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {(["instagram", "facebook", "youtube"] as const).map((p) => (
                  <div key={p} className="rounded-xl glass p-2">
                    <Icon name={platformLabel(p)} className="mx-auto h-4 w-4" />
                    <p className="mt-1 text-sm font-bold">{formatNumber(s.followers[p])}</p>
                    <p className="text-[10px] text-muted">{platformLabel(p)}</p>
                  </div>
                ))}
              </div>

              {!isEditing ? (
                <div className="mt-4 space-y-3 text-sm">
                  <Row icon="Phone" text={s.contactNumber} />
                  <Row icon="School" text={s.address} />

                  {/* Growth strategy snapshot */}
                  <div className="grid grid-cols-2 gap-2">
                    <Mini label="Current followers" value={formatNumber(s.followers.instagram) + " IG"} />
                    <Mini label="Target followers" value={s.targetFollowers ? formatNumber(s.targetFollowers) : "—"} />
                    <Mini label="Monthly growth" value={s.monthlyGrowthTarget ?? "—"} />
                    <Mini label="Posting frequency" value={s.postingFrequency ?? "—"} />
                    <Mini label="Best content" value={s.bestContentType ?? "—"} />
                    <Mini label="Brand tone" value={s.contentTone.replace("_", " ")} />
                  </div>

                  {s.admissionCTA && (
                    <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-2.5 text-xs">
                      <span className="font-semibold">Admission CTA: </span>{s.admissionCTA}
                    </div>
                  )}
                  {s.contentStrategy && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Content strategy</p>
                      <p className="mt-1 text-[13px] text-muted">{s.contentStrategy}</p>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <LinkChip icon="Instagram" label="Instagram" href={s.instagram} />
                    <LinkChip icon="Youtube" label="YouTube" href={s.youtube} />
                    <LinkChip icon="Facebook" label="Facebook" href={s.facebook} />
                    <LinkChip icon="MessageCircle" label="WhatsApp" href={s.whatsapp} />
                    <LinkChip icon="ChevronRight" label="Website" href={s.website} />
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Field label="School name">
                    <input className="w-full px-3 py-2 text-sm" value={s.name} onChange={(e) => update(s.id, { name: e.target.value })} />
                  </Field>
                  <Field label="Branch / location">
                    <input className="w-full px-3 py-2 text-sm" value={s.branch} onChange={(e) => update(s.id, { branch: e.target.value })} />
                  </Field>
                  <Field label="Contact number">
                    <input className="w-full px-3 py-2 text-sm" value={s.contactNumber} onChange={(e) => update(s.id, { contactNumber: e.target.value })} />
                  </Field>
                  <Field label="Website">
                    <input className="w-full px-3 py-2 text-sm" value={s.website ?? ""} onChange={(e) => update(s.id, { website: e.target.value })} />
                  </Field>
                  <Field label="Address">
                    <input className="w-full px-3 py-2 text-sm" value={s.address} onChange={(e) => update(s.id, { address: e.target.value })} />
                  </Field>
                  <Field label="Target audience">
                    <input className="w-full px-3 py-2 text-sm" value={s.targetAudience} onChange={(e) => update(s.id, { targetAudience: e.target.value })} />
                  </Field>
                  <Field label="Instagram link">
                    <input className="w-full px-3 py-2 text-sm" value={s.instagram ?? ""} onChange={(e) => update(s.id, { instagram: e.target.value })} />
                  </Field>
                  <Field label="Facebook link">
                    <input className="w-full px-3 py-2 text-sm" value={s.facebook ?? ""} onChange={(e) => update(s.id, { facebook: e.target.value })} />
                  </Field>
                  <Field label="YouTube link">
                    <input className="w-full px-3 py-2 text-sm" value={s.youtube ?? ""} onChange={(e) => update(s.id, { youtube: e.target.value })} />
                  </Field>
                  <Field label="WhatsApp enquiry link">
                    <input className="w-full px-3 py-2 text-sm" value={s.whatsapp ?? ""} onChange={(e) => update(s.id, { whatsapp: e.target.value })} />
                  </Field>
                  <Field label="Target followers">
                    <input type="number" className="w-full px-3 py-2 text-sm" value={s.targetFollowers ?? ""} onChange={(e) => update(s.id, { targetFollowers: Number(e.target.value) })} />
                  </Field>
                  <Field label="Monthly growth target">
                    <input className="w-full px-3 py-2 text-sm" value={s.monthlyGrowthTarget ?? ""} onChange={(e) => update(s.id, { monthlyGrowthTarget: e.target.value })} />
                  </Field>
                  <Field label="Best content type">
                    <input className="w-full px-3 py-2 text-sm" value={s.bestContentType ?? ""} onChange={(e) => update(s.id, { bestContentType: e.target.value })} />
                  </Field>
                  <Field label="Posting frequency">
                    <input className="w-full px-3 py-2 text-sm" value={s.postingFrequency ?? ""} onChange={(e) => update(s.id, { postingFrequency: e.target.value })} />
                  </Field>
                  <Field label="Admission CTA">
                    <input className="w-full px-3 py-2 text-sm" value={s.admissionCTA ?? ""} onChange={(e) => update(s.id, { admissionCTA: e.target.value })} />
                  </Field>
                  <div className="col-span-2">
                    <Field label="Content strategy">
                      <textarea rows={3} className="w-full px-3 py-2 text-sm" value={s.contentStrategy ?? ""} onChange={(e) => update(s.id, { contentStrategy: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Primary brand color">
                    <input type="color" className="h-9 w-full" value={s.brandColors.primary} onChange={(e) => update(s.id, { brandColors: { ...s.brandColors, primary: e.target.value } })} />
                  </Field>
                  <Field label="Secondary brand color">
                    <input type="color" className="h-9 w-full" value={s.brandColors.secondary} onChange={(e) => update(s.id, { brandColors: { ...s.brandColors, secondary: e.target.value } })} />
                  </Field>
                  <Field label="Logo upload">
                    <input type="file" accept="image/*" className="w-full px-3 py-1.5 text-xs" />
                  </Field>
                  <div className="col-span-2 text-[11px] text-muted">
                    Note: edits are in-memory in this demo. Connect Firestore + Storage to persist (see README).
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

function Row({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-muted">
      <Icon name={icon} className="h-4 w-4 shrink-0" />
      <span className="truncate text-[13px]">{text}</span>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl glass p-2">
      <p className="text-[10px] uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-[13px] font-semibold capitalize">{value}</p>
    </div>
  );
}

function LinkChip({ icon, label, href }: { icon: string; label: string; href?: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-xs hover:brightness-110">
      <Icon name={icon} className="h-3.5 w-3.5" /> {label}
    </a>
  );
}
