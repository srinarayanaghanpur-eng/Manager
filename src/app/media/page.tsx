"use client";

import { useState } from "react";
import { GlassCard, PageHeader, Button, StatusBadge, ConsentWarning } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useSchool } from "@/components/SchoolProvider";
import { mediaItems as seed, schools } from "@/lib/data/seed";
import type { MediaItem } from "@/lib/types";

const typeIcon: Record<string, string> = { photo: "Images", video: "Clapperboard", logo: "Sparkles", poster: "Image" };

export default function MediaPage() {
  const { activeSchool } = useSchool();
  const [items] = useState<MediaItem[]>(seed);
  const [typeFilter, setTypeFilter] = useState("all");

  const visible = items.filter(
    (i) => (activeSchool === "all" || i.schoolId === activeSchool) && (typeFilter === "all" || i.type === typeFilter)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        subtitle="Upload and tag photos, videos, logos & posters. Consent is tracked per file."
        action={<Button><Icon name="Plus" className="h-4 w-4" /> Upload media</Button>}
      />

      <ConsentWarning />

      <div className="flex flex-wrap gap-2">
        {["all", "photo", "video", "logo", "poster"].map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)} className={`rounded-xl px-3 py-1.5 text-xs font-medium capitalize ${typeFilter === t ? "btn-primary" : "glass"}`}>{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((i) => {
          const s = schools.find((x) => x.id === i.schoolId);
          return (
            <GlassCard key={i.id}>
              <div className="grid h-28 place-items-center rounded-xl bg-gradient-to-br from-brand-500/30 to-accent-500/30">
                <Icon name={typeIcon[i.type] ?? "Image"} className="h-8 w-8 opacity-80" />
              </div>
              <p className="mt-2 truncate text-sm font-medium">{i.name}</p>
              <p className="text-[11px] text-muted">{s?.branch} · {i.eventName ?? "General"}{i.className ? ` · ${i.className}` : ""}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {i.tags.map((t) => <span key={t} className="rounded-full glass px-2 py-0.5 text-[10px]">#{t}</span>)}
              </div>
              <div className="mt-2">
                <StatusBadge status={i.consent} />
              </div>
              {i.containsStudentFace && i.consent !== "approved" && (
                <p className="mt-2 text-[10px] text-amber-300">⚠️ Student face — get parent consent before public use.</p>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
