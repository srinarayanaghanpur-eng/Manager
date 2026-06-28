"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard, PageHeader, Button, Field, Select, StatusBadge, ConsentWarning } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useSchool } from "@/components/SchoolProvider";
import { schools, contentIdeas } from "@/lib/data/seed";
import { generateContentIdea, type GeneratedContentIdea } from "@/lib/ai/generateContentIdea";
import { copyToClipboard, downloadText, platformLabel } from "@/lib/utils";
import type { ContentGoal, ContentType, Language, Platform, Tone } from "@/lib/types";

export default function ContentIdeasPage() {
  const { activeSchool } = useSchool();
  const [schoolId, setSchoolId] = useState(schools[0].id);
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [contentType, setContentType] = useState<ContentType>("reel");
  const [goal, setGoal] = useState<ContentGoal>("admissions");
  const [language, setLanguage] = useState<Language>("english");
  const [tone, setTone] = useState<Tone>("premium");
  const [result, setResult] = useState<GeneratedContentIdea | null>(null);
  const [loading, setLoading] = useState(false);

  const school = schools.find((s) => s.id === schoolId)!;
  const ideas = activeSchool === "all" ? contentIdeas : contentIdeas.filter((i) => i.schoolId === activeSchool);

  const generate = async () => {
    setLoading(true);
    const r = await generateContentIdea({
      schoolName: `${school.name} (${school.branch})`, platform, contentType, goal, language, tone,
    });
    await new Promise((res) => setTimeout(res, 350));
    setResult(r);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Content Idea Generator" subtitle="Pick options and generate a full content package." />

      <GlassCard hover={false}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Field label="School"><Select value={schoolId} onChange={setSchoolId} options={schools.map((s) => ({ value: s.id, label: s.branch }))} /></Field>
          <Field label="Platform"><Select value={platform} onChange={(v) => setPlatform(v as Platform)} options={[{ value: "instagram", label: "Instagram" }, { value: "youtube", label: "YouTube" }, { value: "facebook", label: "Facebook" }, { value: "whatsapp", label: "WhatsApp" }]} /></Field>
          <Field label="Type"><Select value={contentType} onChange={(v) => setContentType(v as ContentType)} options={[{ value: "reel", label: "Reel" }, { value: "short", label: "Short" }, { value: "poster", label: "Poster" }, { value: "story", label: "Story" }, { value: "long_video", label: "Long video" }, { value: "carousel", label: "Carousel" }]} /></Field>
          <Field label="Goal"><Select value={goal} onChange={(v) => setGoal(v as ContentGoal)} options={[{ value: "admissions", label: "Admissions" }, { value: "trust", label: "Trust" }, { value: "viral_reach", label: "Viral reach" }, { value: "parent_education", label: "Parent education" }, { value: "event_coverage", label: "Event coverage" }, { value: "brand_building", label: "Brand building" }]} /></Field>
          <Field label="Language"><Select value={language} onChange={(v) => setLanguage(v as Language)} options={[{ value: "english", label: "English" }, { value: "telugu", label: "Telugu" }, { value: "hinglish", label: "Hinglish" }]} /></Field>
          <Field label="Tone"><Select value={tone} onChange={(v) => setTone(v as Tone)} options={[{ value: "premium", label: "Premium" }, { value: "emotional", label: "Emotional" }, { value: "gen_z", label: "Gen Z" }, { value: "professional", label: "Professional" }, { value: "local_parent", label: "Local parent" }]} /></Field>
        </div>
        <Button onClick={generate} disabled={loading} className="mt-4"><Icon name="Sparkles" className="h-4 w-4" /> {loading ? "Generating…" : "Generate 10 ideas + package"}</Button>
      </GlassCard>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-2">
          <GlassCard hover={false}>
            <h3 className="mb-2 font-semibold">10 Content Ideas</h3>
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              {result.ideas.map((i, idx) => <li key={idx}>{i}</li>)}
            </ol>
          </GlassCard>
          <div className="space-y-4">
            <Block title="Reel Script" text={result.reelScript} />
            <Block title="Voiceover" text={result.voiceover} />
            <Block title="Caption" text={result.caption} />
            <Block title="Hashtags" text={result.hashtags.join(" ")} />
            <Block title="Thumbnail text" text={result.thumbnailText} />
            <Block title="Shot list" text={result.shotList.map((s, i) => `${i + 1}. ${s}`).join("\n")} />
            <Block title="Canva poster prompt" text={result.canvaPosterPrompt} />
            <Block title="Video generation prompt" text={result.videoGenPrompt} />
            <Block title="CTA" text={result.cta} />
            <div className="rounded-2xl"><ConsentWarning>{result.safetyNotes}</ConsentWarning></div>
            <Button variant="soft" onClick={() => downloadText("content-package.txt", JSON.stringify(result, null, 2))}>
              <Icon name="Download" className="h-4 w-4" /> Export full package
            </Button>
          </div>
        </motion.div>
      )}

      {/* Idea bank */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Idea Bank ({ideas.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((i) => (
            <GlassCard key={i.id}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold">{i.title}</h3>
                <StatusBadge status={i.status ?? "idea"} />
              </div>
              <p className="mt-1 text-xs text-muted">{i.whyItWorks}</p>
              <p className="mt-2 text-xs">💬 {i.caption}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-emerald-400">Reach {i.reachScore}</span>
                <span className="rounded-full glass px-2 py-0.5">{platformLabel(i.bestPlatform)}</span>
                <span className="rounded-full glass px-2 py-0.5 capitalize">{i.difficulty}</span>
                {i.needsStudentFace && <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-amber-300">Face: consent</span>}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function Block({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-2xl glass p-4">
      <div className="mb-1 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        <button onClick={async () => { await copyToClipboard(text); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="rounded-lg p-1.5 hover:bg-white/10">
          <Icon name="Copy" className="h-3.5 w-3.5" />
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-words font-sans text-[13px] text-muted">{text}</pre>
      {copied && <span className="text-[10px] text-emerald-400">Copied!</span>}
    </div>
  );
}
