"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard, PageHeader, Button, Field } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { schools, SCHOOL_A } from "@/lib/data/seed";
import { generateReelScript, type GeneratedReelScript } from "@/lib/ai/generateReelScript";
import { generateCaption } from "@/lib/ai/generateCaption";
import { copyToClipboard, downloadText, platformColor } from "@/lib/utils";
import type { School } from "@/lib/types";

interface SchoolOutput {
  toneLabel: string;
  reel: GeneratedReelScript;
  caption: string;
  hashtags: string[];
}

async function generateForSchool(school: School, idea: string): Promise<SchoolOutput> {
  const established = school.id === SCHOOL_A;
  const reel = await generateReelScript({ category: idea || "Why parents choose our school", schoolName: `${school.name} (${school.branch})`, duration: established ? 30 : 20, platform: "instagram" });
  const cap = await generateCaption({ topic: idea || "Why parents choose our school", schoolName: `${school.name} (${school.branch})`, platform: "instagram", style: established ? "premium" : "emotional" });
  const hashtags = [...cap.hashtagGroups.school, ...cap.hashtagGroups.local, ...cap.hashtagGroups.admission];
  return {
    toneLabel: established ? "Premium · branded" : "Friendly · local",
    reel,
    caption: cap.caption,
    hashtags,
  };
}

export default function TwoSchoolPlannerPage() {
  const [idea, setIdea] = useState("Why parents choose our school");
  const [outputs, setOutputs] = useState<Record<string, SchoolOutput | undefined>>({});
  const [loading, setLoading] = useState<string>("");

  const run = async (which: "a" | "b" | "both") => {
    setLoading(which);
    const targets = which === "a" ? [schools[0]] : which === "b" ? [schools[1]] : schools;
    const results = await Promise.all(targets.map((s) => generateForSchool(s, idea)));
    await new Promise((r) => setTimeout(r, 350));
    setOutputs((prev) => {
      const next = { ...prev };
      targets.forEach((s, i) => { next[s.id] = results[i]; });
      return next;
    });
    setLoading("");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Two-School Content Planner" subtitle="Write one idea, adapt it for both schools — premium for Narayana, local-friendly for Adarshavani." />

      <GlassCard hover={false}>
        <Field label="One content idea">
          <input className="w-full px-3 py-2 text-sm" value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="e.g. Why parents choose our school" />
        </Field>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => run("a")} disabled={!!loading}><Icon name="Instagram" className="h-4 w-4" /> {loading === "a" ? "Generating…" : "Generate for Sri Narayana"}</Button>
          <Button onClick={() => run("b")} disabled={!!loading}><Icon name="Instagram" className="h-4 w-4" /> {loading === "b" ? "Generating…" : "Generate for Sri Adarshavani"}</Button>
          <Button variant="soft" onClick={() => run("both")} disabled={!!loading}><Icon name="Sparkles" className="h-4 w-4" /> {loading === "both" ? "Generating…" : "Generate for both"}</Button>
        </div>
        <p className="mt-2 text-[11px] text-muted">Outputs are drafts. Nothing posts automatically — use “Mark for approval”, then publish manually from Approvals.</p>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {schools.map((s) => (
          <SchoolColumn key={s.id} school={s} out={outputs[s.id]} idea={idea} />
        ))}
      </div>
    </div>
  );
}

function SchoolColumn({ school, out, idea }: { school: School; out?: SchoolOutput; idea: string }) {
  const [flash, setFlash] = useState("");
  const ping = (k: string) => { setFlash(k); setTimeout(() => setFlash(""), 1500); };
  const copy = async (k: string, text: string) => { await copyToClipboard(text); ping(k); };

  return (
    <GlassCard hover={false} className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${school.brandColors.primary}, ${school.brandColors.secondary})` }}>
          {school.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
        </div>
        <div>
          <h3 className="font-semibold leading-tight">{school.name}</h3>
          <p className="text-[11px] text-muted">{school.branch} · {out?.toneLabel ?? school.contentTone.replace("_", " ")}</p>
        </div>
      </div>

      {!out ? (
        <div className="grid min-h-[160px] place-items-center text-center text-sm text-muted">
          <div><Icon name="Bot" className="mx-auto mb-2 h-7 w-7 opacity-50" />No output yet for this school.</div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="rounded-xl glass p-3">
            <h4 className="mb-2 text-sm font-semibold">Reel script ({out.reel.duration}s)</h4>
            <div className="space-y-1.5">
              {out.reel.scenes.map((sc, i) => (
                <div key={i} className="flex gap-2 text-[12px]">
                  <span className="w-12 shrink-0 text-muted">{sc.time}</span>
                  <span className="flex-1">{sc.visual}{sc.textOverlay ? ` — “${sc.textOverlay}”` : ""}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted">🎙 {out.reel.voiceover}</p>
            <p className="text-[11px] text-muted">🎵 {out.reel.music} · 📣 {out.reel.cta}</p>
          </div>

          <div className="rounded-xl glass p-3">
            <h4 className="mb-1 text-sm font-semibold">Caption</h4>
            <pre className="whitespace-pre-wrap break-words font-sans text-[12px] text-muted">{out.caption}</pre>
          </div>

          <div className="rounded-xl glass p-3">
            <h4 className="mb-1 text-sm font-semibold">Hashtags</h4>
            <p className="text-[12px] text-muted">{out.hashtags.join(" ")}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="soft" onClick={() => copy("cap", out.caption)}><Icon name="Copy" className="h-3.5 w-3.5" /> {flash === "cap" ? "Copied!" : "Copy caption"}</Button>
            <Button variant="soft" onClick={() => copy("tags", out.hashtags.join(" "))}><Icon name="Hash" className="h-3.5 w-3.5" /> {flash === "tags" ? "Copied!" : "Copy hashtags"}</Button>
            <Button variant="soft" onClick={() => ping("cal")}><Icon name="CalendarDays" className="h-3.5 w-3.5" /> {flash === "cal" ? "Saved ✓" : "Save to calendar"}</Button>
            <Button onClick={() => ping("appr")}><Icon name="CheckCircle2" className="h-3.5 w-3.5" /> {flash === "appr" ? "Sent ✓" : "Mark for approval"}</Button>
            <Button variant="soft" onClick={() => downloadText(`${school.branch}-${idea.slice(0, 20)}.txt`, `${out.caption}\n\n${out.hashtags.join(" ")}\n\n${out.reel.voiceover}`)}><Icon name="Download" className="h-3.5 w-3.5" /></Button>
          </div>
        </motion.div>
      )}
    </GlassCard>
  );
}
