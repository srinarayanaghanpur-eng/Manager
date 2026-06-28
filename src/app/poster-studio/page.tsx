"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard, PageHeader, Button, Field, Select, ConsentWarning } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { schools } from "@/lib/data/seed";
import { generatePosterReel, type DesignType, type PosterReelOutput } from "@/lib/ai/generatePosterReel";
import { copyToClipboard, downloadText } from "@/lib/utils";
import type { Language, Platform, Tone } from "@/lib/types";

export default function PosterStudioPage() {
  const [schoolId, setSchoolId] = useState(schools[0].id);
  const [designType, setDesignType] = useState<DesignType>("poster");
  const [occasion, setOccasion] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [language, setLanguage] = useState<Language>("english");
  const [tone, setTone] = useState<Tone>("premium");
  const [out, setOut] = useState<PosterReelOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState("");

  const school = schools.find((s) => s.id === schoolId)!;
  const ping = (k: string) => { setFlash(k); setTimeout(() => setFlash(""), 1500); };

  const run = async () => {
    setLoading(true);
    const r = await generatePosterReel({
      schoolName: school.name, branch: school.branch, designType, occasion, platform, language, tone,
      brandPrimary: school.brandColors.primary, brandSecondary: school.brandColors.secondary, contactNumber: school.contactNumber,
    });
    await new Promise((res) => setTimeout(res, 350));
    setOut(r);
    setLoading(false);
  };

  const exportAll = () => {
    if (!out) return;
    const text = [
      `POSTER TEXT\nHeadline: ${out.posterText.headline}\nSubtext: ${out.posterText.subtext}\nCTA: ${out.posterText.cta}\nCorner: ${out.posterText.cornerLabel}`,
      `\nCANVA PROMPT\n${out.canvaPrompt}`,
      `\nIMAGE PROMPT\n${out.imagePrompt}`,
      `\nREEL SCRIPT\n${out.reelScript.map((b) => `[${b.time}] ${b.visual} — "${b.text}"`).join("\n")}`,
      `\nVOICEOVER\n${out.voiceover}`,
      `\nCAPTIONS\nShort: ${out.captions.short}\nPremium: ${out.captions.premium}\nEmotional: ${out.captions.emotional}`,
      `\nHASHTAGS\n${out.hashtags.join(" ")}`,
      out.festivalGreeting ? `\nFESTIVAL GREETING\n${out.festivalGreeting}` : "",
      out.admissionsContent ? `\nADMISSIONS POSTER\n${out.admissionsContent.headline}\n- ${out.admissionsContent.points.join("\n- ")}\n${out.admissionsContent.cta}` : "",
    ].join("\n");
    downloadText(`${school.branch}-${designType}.txt`, text);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Poster & Reel Studio" subtitle="Your daily design tool — one click for poster text, prompts, reel script, voiceover, captions & hashtags." />

      {/* Input bar */}
      <GlassCard hover={false}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Field label="School"><Select value={schoolId} onChange={setSchoolId} options={schools.map((s) => ({ value: s.id, label: s.branch }))} /></Field>
          <Field label="Design type"><Select value={designType} onChange={(v) => setDesignType(v as DesignType)} options={[{ value: "poster", label: "Poster" }, { value: "reel", label: "Reel" }, { value: "festival", label: "Festival greeting" }, { value: "admissions", label: "Admissions poster" }]} /></Field>
          <Field label="Platform"><Select value={platform} onChange={(v) => setPlatform(v as Platform)} options={[{ value: "instagram", label: "Instagram" }, { value: "youtube", label: "YouTube" }, { value: "facebook", label: "Facebook" }, { value: "whatsapp", label: "WhatsApp" }]} /></Field>
          <Field label="Language"><Select value={language} onChange={(v) => setLanguage(v as Language)} options={[{ value: "english", label: "English" }, { value: "telugu", label: "Telugu" }, { value: "hinglish", label: "Hinglish" }]} /></Field>
          <Field label="Tone"><Select value={tone} onChange={(v) => setTone(v as Tone)} options={[{ value: "premium", label: "Premium" }, { value: "emotional", label: "Emotional" }, { value: "gen_z", label: "Gen Z" }, { value: "professional", label: "Professional" }, { value: "local_parent", label: "Local parent" }]} /></Field>
          <Field label="Occasion / topic"><input className="w-full px-3 py-2 text-sm" placeholder={designType === "festival" ? "e.g. Diwali" : "e.g. Annual Day"} value={occasion} onChange={(e) => setOccasion(e.target.value)} /></Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={run} disabled={loading}><Icon name="Sparkles" className="h-4 w-4" /> {loading ? "Designing…" : "Generate design pack"}</Button>
          {out && <Button variant="soft" onClick={exportAll}><Icon name="Download" className="h-4 w-4" /> Export all</Button>}
        </div>
      </GlassCard>

      {out && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-3">
          {/* Live poster preview */}
          <div className="lg:col-span-1">
            <div
              className="relative aspect-square overflow-hidden rounded-2xl p-5 text-white shadow-glass"
              style={{ background: `linear-gradient(135deg, ${school.brandColors.primary}, ${school.brandColors.secondary})` }}
            >
              <div className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold backdrop-blur">{out.posterText.cornerLabel}</div>
              <div className="flex h-full flex-col">
                <p className="text-[11px] font-semibold opacity-90">{school.name}</p>
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="text-2xl font-black leading-tight drop-shadow">{out.posterText.headline}</h3>
                  <p className="mt-2 text-sm opacity-90">{out.posterText.subtext}</p>
                </div>
                <div className="rounded-xl bg-black/25 p-2 text-center text-xs font-semibold backdrop-blur">{out.posterText.cta}</div>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted">Live preview (mock). Use the Canva/image prompts to produce the final art.</p>
            <div className="mt-3"><ConsentWarning>{out.safetyNote}</ConsentWarning></div>
          </div>

          {/* Output blocks */}
          <div className="space-y-3 lg:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <Block k="head" title="Poster headline" text={out.posterText.headline} flash={flash} setFlash={ping} />
              <Block k="sub" title="Poster subtext" text={out.posterText.subtext} flash={flash} setFlash={ping} />
              <Block k="canva" title="Canva prompt" text={out.canvaPrompt} flash={flash} setFlash={ping} />
              <Block k="img" title="Image generation prompt" text={out.imagePrompt} flash={flash} setFlash={ping} />
            </div>

            <Block k="reel" title="Reel script" text={out.reelScript.map((b) => `[${b.time}] ${b.visual} — “${b.text}”`).join("\n")} flash={flash} setFlash={ping} />
            <Block k="vo" title="Voiceover" text={out.voiceover} flash={flash} setFlash={ping} />

            <div className="grid gap-3 sm:grid-cols-3">
              <Block k="cs" title="Short caption" text={out.captions.short} flash={flash} setFlash={ping} />
              <Block k="cp" title="Premium caption" text={out.captions.premium} flash={flash} setFlash={ping} />
              <Block k="ce" title="Emotional caption" text={out.captions.emotional} flash={flash} setFlash={ping} />
            </div>

            <Block k="tags" title="Hashtags" text={out.hashtags.join(" ")} flash={flash} setFlash={ping} />

            {out.festivalGreeting && <Block k="fest" title="Festival greeting content" text={out.festivalGreeting} flash={flash} setFlash={ping} />}
            {out.admissionsContent && (
              <Block
                k="adm"
                title="Admissions poster content"
                text={`${out.admissionsContent.headline}\n- ${out.admissionsContent.points.join("\n- ")}\n${out.admissionsContent.cta}`}
                flash={flash}
                setFlash={ping}
              />
            )}

            <div className="flex flex-wrap gap-2">
              <Button variant="soft" onClick={() => ping("cal")}><Icon name="CalendarDays" className="h-4 w-4" /> {flash === "cal" ? "Saved ✓" : "Save to calendar"}</Button>
              <Button onClick={() => ping("appr")}><Icon name="CheckCircle2" className="h-4 w-4" /> {flash === "appr" ? "Sent ✓" : "Mark for approval"}</Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Block({ k, title, text, flash, setFlash }: { k: string; title: string; text: string; flash: string; setFlash: (k: string) => void }) {
  return (
    <div className="rounded-xl glass p-3">
      <div className="mb-1 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        <button onClick={async () => { await copyToClipboard(text); setFlash(k); }} className="rounded-lg p-1.5 hover:bg-white/10"><Icon name="Copy" className="h-3.5 w-3.5" /></button>
      </div>
      <pre className="whitespace-pre-wrap break-words font-sans text-[12px] text-muted">{text}</pre>
      {flash === k && <span className="text-[10px] text-emerald-400">Copied!</span>}
    </div>
  );
}
