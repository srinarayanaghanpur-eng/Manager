"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassCard, PageHeader, StatCard, Button, Field, Select } from "@/components/ui";
import { Icon } from "@/components/Icon";
import {
  youTubeChannels, youTubeVideoLibrary, youTubeContentPlans,
  adarshavaniYouTubeTracker, schools,
} from "@/lib/data/seed";
import { formatNumber, platformColor, copyToClipboard, downloadText, uid } from "@/lib/utils";
import { useSchool } from "@/components/SchoolProvider";
import { useLiveSocial } from "@/lib/hooks/useLiveSocial";
import type { YouTubeVideo, YouTubeContentType } from "@/lib/types";

type PlatformTab = "instagram" | "youtube" | "facebook" | "whatsapp";
type YTTab = "dashboard" | "planner" | "shorts" | "longvideo" | "monetization" | "repurpose" | "weekly" | "library" | "analytics";

const platformTabs: { id: PlatformTab; label: string; icon: string }[] = [
  { id: "instagram", label: "Instagram", icon: "Instagram" },
  { id: "youtube", label: "YouTube", icon: "Youtube" },
  { id: "facebook", label: "Facebook", icon: "Facebook" },
  { id: "whatsapp", label: "WhatsApp", icon: "MessageCircle" },
];

const sectionTabs: { id: YTTab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "planner", label: "Content Planner", icon: "ListVideo" },
  { id: "shorts", label: "Shorts Agent", icon: "Video" },
  { id: "longvideo", label: "Long Video Agent", icon: "Clapperboard" },
  { id: "monetization", label: "Monetization", icon: "Wallet" },
  { id: "repurpose", label: "Repurpose", icon: "Share2" },
  { id: "weekly", label: "Weekly Plan", icon: "CalendarDays" },
  { id: "library", label: "Video Library", icon: "Images" },
  { id: "analytics", label: "Analytics Insight", icon: "BarChart3" },
];

const emptyVideo: YouTubeVideo = {
  id: "", schoolId: "", title: "", youtubeLink: "", datePublished: "",
  views: 0, likes: 0, comments: 0, watchTime: 0,
  contentType: "shorts", performanceRating: 0, notes: "",
};

function ProgressBar({ value, target, accent, label }: { value: number; target: number; accent: string; label?: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  return (
    <div>
      {label && <p className="mb-1 text-xs font-medium">{label}</p>}
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted">{formatNumber(value)} / {formatNumber(target)}</span>
        <span className="font-semibold" style={{ color: accent }}>{pct}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: accent }} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default function YouTubePage() {
  const [platform, setPlatform] = useState<PlatformTab>("youtube");
  const [section, setSection] = useState<YTTab>("dashboard");
  const { activeSchool } = useSchool();

  const channel = youTubeChannels.find((c) => c.schoolId === (activeSchool !== "all" ? activeSchool : "school_adarshavani")) || youTubeChannels[1];
  const school = schools.find((s) => s.id === channel.schoolId)!;
  const videos = youTubeVideoLibrary.filter((v) => v.schoolId === channel.schoolId);
  const plans = youTubeContentPlans.filter((p) => p.schoolId === channel.schoolId);
  const tracker = channel.schoolId === "school_adarshavani" ? adarshavaniYouTubeTracker : adarshavaniYouTubeTracker;

  const handlePlatformChange = (p: PlatformTab) => {
    setPlatform(p);
    if (p !== "youtube") {
      const routes: Record<string, string> = {
        instagram: "/", facebook: "/", whatsapp: "/leads",
      };
      window.location.href = routes[p] || "/";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="YouTube Studio"
        subtitle={`Manage ${school.name} — ${channel.channelName}`}
      />

      {/* Platform tabs */}
      <div className="flex gap-1 rounded-2xl glass p-1.5">
        {platformTabs.map((t) => {
          const active = platform === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handlePlatformChange(t.id)}
              className={`platform-tab flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${active ? (t.id === "youtube" ? "youtube-bg text-red-400" : "bg-white/10 text-current") : "text-muted hover:text-current"}`}
            >
              <Icon name={t.icon} className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-1.5">
        {sectionTabs.map((t) => {
          const active = section === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSection(t.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-medium transition ${active ? "youtube-bg text-red-400" : "glass text-muted hover:text-current"}`}
            >
              <Icon name={t.icon} className="mr-1.5 inline-block h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {section === "dashboard" && <Dashboard channel={channel} school={school} videos={videos} />}
          {section === "planner" && <ContentPlanner channel={channel} school={school} plans={plans} />}
          {section === "shorts" && <ShortsAgent school={school} />}
          {section === "longvideo" && <LongVideoAgent school={school} />}
          {section === "monetization" && <MonetizationTracker channel={channel} tracker={tracker} />}
          {section === "repurpose" && <RepurposeAgent school={school} />}
          {section === "weekly" && <WeeklyPlan channel={channel} school={school} />}
          {section === "library" && <VideoLibrary school={school} videos={videos} />}
          {section === "analytics" && <AnalyticsInsight school={school} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// 1. YouTube Channel Dashboard
function Dashboard({ channel, school, videos }: { channel: typeof youTubeChannels[0]; school: typeof schools[0]; videos: YouTubeVideo[] }) {
  const { data: live, loading: liveLoading } = useLiveSocial(school.id, "youtube");
  const isLive = live?.source === "live" && !!live.metrics;
  const m = isLive ? live!.metrics! : null;

  // Prefer live numbers when connected; otherwise fall back to the seed channel.
  const subscribers = m ? m.followers : channel.subscriberCount;
  const totalViewsAllTime = m ? m.views : channel.totalViews;
  const livePosts = isLive ? (live!.posts ?? []) : [];

  const topVideo = [...videos].sort((a, b) => b.views - a.views)[0];
  const totalWatchTime = videos.reduce((s, v) => s + v.watchTime, 0);
  const avgRating = videos.length ? Math.round(videos.reduce((s, v) => s + v.performanceRating, 0) / videos.length) : 0;

  return (
    <div className="space-y-6">
      {/* Channel info */}
      <GlassCard hover={false} className="relative overflow-hidden border-l-4" style={{ borderLeftColor: "#ef4444" }}>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 blur-3xl" style={{ background: "#ef4444" }} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl youtube-gradient text-white">
                <Icon name="Youtube" className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{channel.channelName}</h2>
                <a href={channel.channelUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-red-400 hover:underline">
                  {channel.channelUrl}
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {liveLoading ? (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-muted">Checking…</span>
            ) : isLive ? (
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-400">
                <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 align-middle" />
                Live · YouTube API
              </span>
            ) : (
              <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-400" title={live?.error ?? "Add YOUTUBE_API_KEY to show live data"}>
                <Icon name="Clock" className="mr-1 inline-block h-3 w-3" />
                Demo data
              </span>
            )}
            <span className="text-muted">{school.name} — {school.branch}</span>
          </div>
        </div>
      </GlassCard>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Subscribers" value={formatNumber(subscribers)} sub={isLive ? "Live" : `Target: ${formatNumber(1000)}`} accent="#ef4444" icon={<Icon name="Users" className="h-5 w-5" />} />
        <StatCard label="Total videos" value={channel.totalVideos} sub={`${channel.totalShorts} Shorts`} accent="#f97316" icon={<Icon name="Video" className="h-5 w-5" />} />
        <StatCard label="Total views" value={formatNumber(totalViewsAllTime)} sub={isLive ? "Live · all-time" : `${videos.length} uploaded`} accent="#eab308" icon={<Icon name="Eye" className="h-5 w-5" />} />
        <StatCard label="Watch hours" value={formatNumber(totalWatchTime)} sub={`Avg rating: ${avgRating}%`} accent="#22c55e" icon={<Icon name="Clock" className="h-5 w-5" />} />
      </div>

      {/* Live recent uploads */}
      {livePosts.length > 0 && (
        <GlassCard hover={false}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Icon name="Video" className="h-4 w-4 text-red-400" /> Latest uploads
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] text-emerald-400">Live</span>
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {livePosts.map((p) => (
              <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-xl bg-white/5 p-2.5 hover:bg-white/10">
                <Icon name="Youtube" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.caption}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{formatNumber(p.views ?? 0)} views · {formatNumber(p.likes)} likes · {p.postedAt}</p>
                </div>
              </a>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Channel details + Best performing */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard hover={false}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Icon name="Youtube" className="h-4 w-4 text-red-400" /> Channel Details
            {isLive && <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] text-emerald-400">Live</span>}
          </h3>
          <div className="space-y-2">
            <InfoRow label="Channel name" value={channel.channelName} />
            <InfoRow label="Subscribers" value={formatNumber(subscribers)} />
            <InfoRow label="Total videos" value={channel.totalVideos} />
            <InfoRow label="Total Shorts" value={channel.totalShorts} />
            <InfoRow label="Total views" value={formatNumber(totalViewsAllTime)} />
            <InfoRow label="Watch hours" value={formatNumber(channel.watchHours)} />
            <InfoRow label="Shorts views" value={formatNumber(channel.shortsViews)} />
            <InfoRow label="Uploads (90 days)" value={channel.uploadsLast90Days} />
            <InfoRow label="Weekly upload target" value={channel.weeklyUploadTarget} />
            <InfoRow label="Monetization progress" value={`${channel.monetizationEligibility}%`} />
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard hover={false}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Icon name="Lightbulb" className="h-4 w-4 text-amber-400" /> Best Video Ideas
            </h3>
            <ul className="space-y-2">
              {channel.bestVideoIdeas.map((idea) => (
                <li key={idea} className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <Icon name="Star" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                  {idea}
                </li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard hover={false}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Icon name="Lightbulb" className="h-4 w-4 text-amber-400" /> Best Shorts Ideas
            </h3>
            <ul className="space-y-2">
              {channel.bestShortsIdeas.map((idea) => (
                <li key={idea} className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <Icon name="Star" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                  {idea}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>

      {/* Top video */}
      {topVideo && (
        <GlassCard hover={false}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Icon name="Star" className="h-4 w-4 text-yellow-400" /> Best Performing Video
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-lg font-bold">{topVideo.title}</p>
              <p className="mt-1 text-xs text-muted">Published {topVideo.datePublished}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <span className="rounded-lg bg-white/5 px-2.5 py-1"><strong>{formatNumber(topVideo.views)}</strong> views</span>
                <span className="rounded-lg bg-white/5 px-2.5 py-1"><strong>{formatNumber(topVideo.likes)}</strong> likes</span>
                <span className="rounded-lg bg-white/5 px-2.5 py-1"><strong>{topVideo.comments}</strong> comments</span>
                <span className="rounded-lg bg-white/5 px-2.5 py-1"><strong>{topVideo.watchTime}h</strong> watch time</span>
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 text-sm">
              <p className="font-medium text-emerald-400">Performance: {topVideo.performanceRating}%</p>
              <p className="mt-1 text-muted">{topVideo.notes || "No notes"}</p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

// 2. YouTube Content Planner
function ContentPlanner({ channel, school, plans }: { channel: typeof youTubeChannels[0]; school: typeof schools[0]; plans: typeof youTubeContentPlans }) {
  const videoTypes = [
    { id: "shorts", label: "YouTube Shorts" },
    { id: "long_video", label: "Long videos" },
    { id: "event", label: "School event videos" },
    { id: "admission", label: "Admission videos" },
    { id: "parent_guidance", label: "Parent guidance videos" },
    { id: "teacher_tip", label: "Teacher tip videos" },
    { id: "student_achievement", label: "Student achievement videos" },
    { id: "festival_greeting", label: "Festival greeting videos" },
    { id: "weekly_highlights", label: "Weekly school highlights" },
  ];
  const [selectedType, setSelectedType] = useState("shorts");
  const [topic, setTopic] = useState("");
  const [savedPlans, setSavedPlans] = useState(plans);

  const addPlan = () => {
    if (!topic.trim()) return;
    setSavedPlans((prev) => [...prev, {
      id: `plan_${Date.now()}`,
      schoolId: channel.schoolId,
      videoType: selectedType,
      topic: topic.trim(),
      platform: "youtube",
      status: "draft",
      createdAt: new Date().toISOString(),
    }]);
    setTopic("");
  };

  const videoTypeLabel = (id: string) => videoTypes.find((v) => v.id === id)?.label || id;

  return (
    <div className="space-y-4">
      <GlassCard hover={false}>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Icon name="ListVideo" className="h-5 w-5 text-red-400" /> Create Content Plan
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Video type">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 text-sm outline-none">
              {videoTypes.map((v) => <option key={v.id} value={v.id} className="bg-slate-900 text-white">{v.label}</option>)}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Topic / idea">
              <input className="w-full px-3 py-2 text-sm outline-none" placeholder="e.g. Science lab demonstration, Morning assembly" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </Field>
          </div>
        </div>
        <Button onClick={addPlan} className="mt-3">
          <Icon name="Plus" className="h-4 w-4" /> Add to content plan
        </Button>
      </GlassCard>

      {savedPlans.length > 0 && (
        <GlassCard hover={false}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Icon name="CalendarDays" className="h-4 w-4 text-red-400" /> Content Plans ({savedPlans.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="pb-2">Type</th><th className="pb-2">Topic</th><th className="pb-2">Status</th><th className="pb-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {savedPlans.map((p) => (
                  <tr key={p.id} className="border-t border-white/5">
                    <td className="py-2.5">
                      <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-[11px] text-red-400">{videoTypeLabel(p.videoType)}</span>
                    </td>
                    <td className="py-2.5 font-medium">{p.topic}</td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${
                        p.status === "published" ? "bg-emerald-400/15 text-emerald-400" :
                        p.status === "ready" ? "bg-blue-400/15 text-blue-400" :
                        "bg-amber-400/15 text-amber-400"
                      }`}>{p.status}</span>
                    </td>
                    <td className="py-2.5 text-xs text-muted">{p.createdAt.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Ideas by type */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videoTypes.slice(0, 6).map((vt) => (
          <GlassCard key={vt.id} hover={false} className="border-l-4" style={{ borderLeftColor: "#ef4444" }}>
            <h4 className="mb-2 text-sm font-semibold">{vt.label}</h4>
            <p className="text-xs text-muted">
              Create engaging {vt.label.toLowerCase()} for {school.name} to connect with parents and showcase school life.
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// 3. YouTube Shorts Agent
function ShortsAgent({ school }: { school: typeof schools[0] }) {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("30");
  const [language, setLanguage] = useState("english");
  const [goal, setGoal] = useState("views");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ctx = { schoolName: `${school.name} (${school.branch})`, schoolShort: school.name, branch: school.branch, platform: "youtube" as const, followers: school.followers.youtube, values: { topic, duration, language, goal } };
    const { runYouTubeShorts } = await import("@/lib/ai/agentRunners");
    const text = await runYouTubeShorts(ctx);
    setOutput(text);
    setLoading(false);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassCard hover={false}>
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl youtube-gradient text-white"><Icon name="Youtube" className="h-4 w-4" /></div>
          <h3 className="font-semibold">Shorts Agent</h3>
        </div>
        <p className="mb-4 text-xs text-muted">Input a topic and get a complete YouTube Short — title, hook, script, voiceover, hashtags & more.</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Field label="Topic"><input className="w-full px-3 py-2 text-sm outline-none" placeholder="e.g. Morning assembly, Science experiment" value={topic} onChange={(e) => setTopic(e.target.value)} /></Field></div>
          <Field label="Duration">
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-3 py-2 text-sm outline-none">
              <option value="10" className="bg-slate-900 text-white">10 sec</option>
              <option value="20" className="bg-slate-900 text-white">20 sec</option>
              <option value="30" className="bg-slate-900 text-white">30 sec</option>
              <option value="60" className="bg-slate-900 text-white">60 sec</option>
            </select>
          </Field>
          <Field label="Language">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-3 py-2 text-sm outline-none">
              <option value="english" className="bg-slate-900 text-white">English</option>
              <option value="telugu" className="bg-slate-900 text-white">Telugu</option>
              <option value="hinglish" className="bg-slate-900 text-white">Hinglish</option>
            </select>
          </Field>
          <div className="col-span-2">
            <Field label="Goal">
              <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full px-3 py-2 text-sm outline-none">
                <option value="views" className="bg-slate-900 text-white">Views</option>
                <option value="admissions" className="bg-slate-900 text-white">Admissions</option>
                <option value="parent_trust" className="bg-slate-900 text-white">Parent trust</option>
                <option value="branding" className="bg-slate-900 text-white">Branding</option>
              </select>
            </Field>
          </div>
        </div>
        <Button onClick={run} disabled={loading || !topic.trim()} className="mt-4 w-full">
          <Icon name={loading ? "Sparkles" : "Video"} className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Generating…" : "Generate Shorts Script"}
        </Button>
      </GlassCard>

      <div>
        {output ? (
          <AgentOutput text={output} accent="#ef4444" />
        ) : (
          <GlassCard hover={false} className="grid min-h-[200px] place-items-center text-center text-sm text-muted">
            <div><Icon name="Youtube" className="mx-auto mb-2 h-8 w-8 opacity-30" />Fill in the details and generate a Shorts script.</div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

// 4. YouTube Long Video Agent
function LongVideoAgent({ school }: { school: typeof schools[0] }) {
  const [topic, setTopic] = useState("");
  const [videoType, setVideoType] = useState("long_video");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ctx = { schoolName: `${school.name} (${school.branch})`, schoolShort: school.name, branch: school.branch, platform: "youtube" as const, followers: school.followers.youtube, values: { topic, videoType } };
    const { runYouTubeLongVideo } = await import("@/lib/ai/agentRunners");
    const text = await runYouTubeLongVideo(ctx);
    setOutput(text);
    setLoading(false);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassCard hover={false}>
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-red-500/15 text-red-400"><Icon name="Clapperboard" className="h-4 w-4" /></div>
          <h3 className="font-semibold">Long Video Agent</h3>
        </div>
        <p className="mb-4 text-xs text-muted">Generate a complete long-form video plan — structure, chapters, description, tags, end screen & more.</p>
        <div className="space-y-3">
          <Field label="Video topic">
            <input className="w-full px-3 py-2 text-sm outline-none" placeholder="e.g. Campus tour, Admissions 2026 guide" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </Field>
          <Field label="Video type">
            <select value={videoType} onChange={(e) => setVideoType(e.target.value)} className="w-full px-3 py-2 text-sm outline-none">
              <option value="long_video" className="bg-slate-900 text-white">Long video</option>
              <option value="event" className="bg-slate-900 text-white">School event video</option>
              <option value="admission" className="bg-slate-900 text-white">Admission video</option>
              <option value="parent_guidance" className="bg-slate-900 text-white">Parent guidance video</option>
              <option value="teacher_tip" className="bg-slate-900 text-white">Teacher tip video</option>
              <option value="student_achievement" className="bg-slate-900 text-white">Student achievement video</option>
              <option value="festival_greeting" className="bg-slate-900 text-white">Festival greeting video</option>
              <option value="weekly_highlights" className="bg-slate-900 text-white">Weekly highlights</option>
            </select>
          </Field>
        </div>
        <Button onClick={run} disabled={loading || !topic.trim()} className="mt-4 w-full">
          <Icon name={loading ? "Sparkles" : "Clapperboard"} className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Generating…" : "Generate Long Video Plan"}
        </Button>
      </GlassCard>

      <div>
        {output ? (
          <AgentOutput text={output} accent="#dc2626" />
        ) : (
          <GlassCard hover={false} className="grid min-h-[200px] place-items-center text-center text-sm text-muted">
            <div><Icon name="Clapperboard" className="mx-auto mb-2 h-8 w-8 opacity-30" />Fill in the details and generate a long video plan.</div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

// 5. YouTube Monetization Tracker
function MonetizationTracker({ channel, tracker }: { channel: typeof youTubeChannels[0]; tracker: typeof adarshavaniYouTubeTracker }) {
  const eligible = Math.round(
    (Math.min(1, tracker.subscribers / tracker.subscribersTarget) * 0.25 +
     Math.min(1, tracker.publicWatchHours / tracker.watchHoursTarget) * 0.25 +
     Math.min(1, tracker.shortsViews / tracker.shortsViewsTarget) * 0.25 +
     Math.min(1, tracker.uploads90Days / tracker.eligibilityBreakdown.uploads90Days.target) * 0.25) * 100
  );

  return (
    <div className="space-y-4">
      <GlassCard hover={false} className="border-l-4" style={{ borderLeftColor: "#ef4444" }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Icon name="Youtube" className="h-5 w-5 text-red-400" /> Monetization Tracker
            </h3>
            <p className="text-xs text-muted">{channel.channelName}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: eligible >= 50 ? "#22c55e" : "#ef4444" }}>{eligible}%</p>
            <p className="text-xs text-muted">YPP eligibility</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Subscribers" value={formatNumber(tracker.subscribers)} sub={`${tracker.subscribersTarget - tracker.subscribers} to goal`} accent="#ef4444" icon={<Icon name="Users" className="h-5 w-5" />} />
        <StatCard label="Watch hours" value={formatNumber(tracker.publicWatchHours)} sub={`${tracker.watchHoursTarget - tracker.publicWatchHours}h needed`} accent="#f97316" icon={<Icon name="Clock" className="h-5 w-5" />} />
        <StatCard label="Shorts views" value={formatNumber(tracker.shortsViews)} sub={`of ${formatNumber(tracker.shortsViewsTarget)} target`} accent="#eab308" icon={<Icon name="Eye" className="h-5 w-5" />} />
        <StatCard label="Uploads (90d)" value={tracker.uploads90Days} sub={`${Math.max(0, 3 - tracker.uploads90Days)} more needed`} accent="#22c55e" icon={<Icon name="Video" className="h-5 w-5" />} />
      </div>

      <GlassCard hover={false}>
        <h3 className="mb-4 text-sm font-semibold">Progress Toward Milestones</h3>
        <div className="space-y-4">
          {tracker.milestones.map((m) => (
            <ProgressBar key={m.name} label={m.name} value={m.current} target={m.target} accent={m.done ? "#22c55e" : "#ef4444"} />
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard hover={false}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Icon name="TrendingUp" className="h-4 w-4 text-red-400" /> Next Milestones
          </h3>
          <div className="space-y-3">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs">
              <p className="font-semibold text-amber-400">🎯 500 subscribers — Beginner creator features</p>
              <p className="mt-1 text-muted">Access to custom thumbnails, end screens, and basic analytics. {tracker.subscribers}/500 achieved.</p>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs">
              <p className="font-semibold text-red-400">🎯 1,000 subscribers — Main monetization goal</p>
              <p className="mt-1 text-muted">YouTube Partner Program eligibility starts here. {tracker.subscribers}/1,000 achieved.</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs">
              <p className="font-semibold text-blue-400">🎯 4,000 public watch hours</p>
              <p className="mt-1 text-muted">Alternative path to YPP alongside 1K subs. {tracker.publicWatchHours}/4,000 hours.</p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-xs">
              <p className="font-semibold text-purple-400">🎯 10M Shorts views in 90 days</p>
              <p className="mt-1 text-muted">Shorts-only monetization path. {formatNumber(tracker.shortsViews)}/10M views.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Icon name="TrendingUp" className="h-4 w-4 text-emerald-400" /> Weekly Growth Plan
          </h3>
          <ul className="space-y-2">
            {tracker.weeklyGrowthPlan.map((action, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-500/15 text-[10px] text-red-400">{i + 1}</span>
                {action}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

// 6. Cross-Platform Repurposing Agent
function RepurposeAgent({ school }: { school: typeof schools[0] }) {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ctx = { schoolName: `${school.name} (${school.branch})`, schoolShort: school.name, branch: school.branch, platform: "youtube" as const, followers: school.followers.youtube, values: { topic } };
    const { runCrossPlatformRepurpose } = await import("@/lib/ai/agentRunners");
    const text = await runCrossPlatformRepurpose(ctx);
    setOutput(text);
    setLoading(false);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassCard hover={false}>
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/15 text-purple-400"><Icon name="Share2" className="h-4 w-4" /></div>
          <h3 className="font-semibold">Cross-Platform Repurposing Agent</h3>
        </div>
        <p className="mb-4 text-xs text-muted">One school video idea → platform-optimized versions for YouTube Shorts, Instagram Reels, Facebook Reels & WhatsApp Status.</p>
        <Field label="Video idea / topic">
          <textarea className="min-h-[100px] w-full resize-y px-3 py-2 text-sm outline-none" placeholder="e.g. Today at Sri Adarshavani High School — science lab activity, students excited" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </Field>
        <Button onClick={run} disabled={loading || !topic.trim()} className="mt-4 w-full">
          <Icon name={loading ? "Sparkles" : "Share2"} className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Generating…" : "Generate All Platform Versions"}
        </Button>
      </GlassCard>

      <div>
        {output ? (
          <AgentOutput text={output} accent="#8b5cf6" />
        ) : (
          <GlassCard hover={false} className="grid min-h-[200px] place-items-center text-center text-sm text-muted">
            <div><Icon name="Share2" className="mx-auto mb-2 h-8 w-8 opacity-30" />One idea, four platforms. Fill in the topic and generate.</div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

// 7. YouTube Weekly Plan
function WeeklyPlan({ channel, school }: { channel: typeof youTubeChannels[0]; school: typeof schools[0] }) {
  const defaultPlan = [
    { day: "Monday", contentType: "Short", idea: `School activity Short — ${school.name}`, platform: "youtube" },
    { day: "Tuesday", contentType: "Parent guidance Short", idea: "Parenting tip for school-age children", platform: "youtube" },
    { day: "Wednesday", contentType: "School activity Short", idea: "Classroom moments & learning in action", platform: "youtube" },
    { day: "Thursday", contentType: "Teacher tip Short", idea: "Exam preparation tip from teachers", platform: "youtube" },
    { day: "Friday", contentType: "Student achievement Short", idea: "Celebrating student success story", platform: "youtube" },
    { day: "Saturday", contentType: "Long video", idea: "Weekly highlight — best moments compilation", platform: "youtube" },
    { day: "Sunday", contentType: "Weekly highlights Short", idea: "Sunday recap — week at a glance", platform: "youtube" },
  ];

  const [plan, setPlan] = useState(defaultPlan);
  const [generated, setGenerated] = useState(false);

  const generate = () => {
    setGenerated(true);
  };

  const downloadPlan = () => {
    const text = plan.map((d) => `${d.day}: ${d.contentType} — ${d.idea}`).join("\n");
    downloadText(`weekly-plan-${school.branch}.txt`, text);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Icon name="CalendarDays" className="h-5 w-5 text-red-400" /> YouTube Weekly Plan
        </h3>
        <div className="flex gap-2">
          <Button variant="soft" onClick={generate}><Icon name="Sparkles" className="h-4 w-4" /> Generate Plan</Button>
          <Button variant="soft" onClick={downloadPlan}><Icon name="Download" className="h-4 w-4" /> Download</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {plan.map((d) => (
          <GlassCard key={d.day} hover={false} className={`border-t-2 ${d.contentType === "Long video" ? "border-red-500" : "border-orange-400"}`}>
            <p className="text-xs font-semibold text-red-400">{d.day}</p>
            <p className="mt-1 text-[11px] font-medium">{d.contentType}</p>
            <p className="mt-1 text-[11px] text-muted">{d.idea}</p>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-muted">
              <Icon name="Youtube" className="h-3 w-3" />
              YouTube
            </div>
          </GlassCard>
        ))}
      </div>

      {generated && (
        <GlassCard hover={false} className="border-l-4 border-emerald-400">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <Icon name="CheckCircle2" className="h-4 w-4" /> Weekly Content Strategy
          </h4>
          <ul className="space-y-2 text-xs text-muted">
            <li>• <strong>Monday-Friday:</strong> Daily Shorts to maintain algorithm momentum and daily parent engagement</li>
            <li>• <strong>Saturday:</strong> Long-form video for deeper watch hours — repurpose best Shorts of the week</li>
            <li>• <strong>Sunday:</strong> Weekly highlights Short to capture viewers who missed daily content</li>
            <li>• <strong>Best posting times:</strong> Shorts at 6-8 PM weekdays, Long video at 10 AM Saturday</li>
            <li>• <strong>Weekly target:</strong> {channel.weeklyUploadTarget} uploads, aim for 500+ total views</li>
          </ul>
        </GlassCard>
      )}
    </div>
  );
}

// 8. YouTube Video Library
function VideoLibrary({ school, videos: initialVideos }: { school: typeof schools[0]; videos: YouTubeVideo[] }) {
  const [videos, setVideos] = useState(initialVideos);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState<YouTubeVideo>({ ...emptyVideo, schoolId: school.id, datePublished: new Date().toISOString().slice(0, 10) });
  const [filter, setFilter] = useState<YouTubeContentType | "all">("all");

  const filtered = filter === "all" ? videos : videos.filter((v) => v.contentType === filter);

  const contentTypeColor = (ct: YouTubeContentType) => {
    const colors: Record<string, string> = {
      shorts: "#ef4444", long_video: "#f97316", event: "#eab308",
      admission: "#22c55e", parent_guidance: "#3b82f6", teacher_tip: "#8b5cf6",
      student_achievement: "#ec4899", festival_greeting: "#14b8a6", weekly_highlights: "#06b6d4",
    };
    return colors[ct] || "#6366f1";
  };

  const save = () => {
    if (!draft.title.trim() || !draft.youtubeLink.trim()) return;
    setVideos((prev) => [{ ...draft, id: `ytv_${Date.now()}` }, ...prev]);
    setDraft({ ...emptyVideo, schoolId: school.id, datePublished: new Date().toISOString().slice(0, 10) });
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Icon name="Images" className="h-5 w-5 text-red-400" /> Video Library ({videos.length})
        </h3>
        <Button onClick={() => setShowAdd((v) => !v)}>
          <Icon name={showAdd ? "X" : "Plus"} className="h-4 w-4" /> {showAdd ? "Cancel" : "Add Video"}
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <GlassCard hover={false}>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Field label="Title"><input className="w-full px-3 py-2 text-sm" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
                <Field label="YouTube link"><input className="w-full px-3 py-2 text-sm" placeholder="https://youtube.com/watch?v=..." value={draft.youtubeLink} onChange={(e) => setDraft({ ...draft, youtubeLink: e.target.value })} /></Field>
                <Field label="Date published"><input type="date" className="w-full px-3 py-2 text-sm" value={draft.datePublished} onChange={(e) => setDraft({ ...draft, datePublished: e.target.value })} /></Field>
                <Field label="Content type">
                  <select value={draft.contentType} onChange={(e) => setDraft({ ...draft, contentType: e.target.value as YouTubeContentType })} className="w-full px-3 py-2 text-sm">
                    <option value="shorts" className="bg-slate-900">Shorts</option>
                    <option value="long_video" className="bg-slate-900">Long video</option>
                    <option value="event" className="bg-slate-900">Event</option>
                    <option value="admission" className="bg-slate-900">Admission</option>
                    <option value="parent_guidance" className="bg-slate-900">Parent guidance</option>
                    <option value="teacher_tip" className="bg-slate-900">Teacher tip</option>
                    <option value="student_achievement" className="bg-slate-900">Student achievement</option>
                    <option value="festival_greeting" className="bg-slate-900">Festival greeting</option>
                    <option value="weekly_highlights" className="bg-slate-900">Weekly highlights</option>
                  </select>
                </Field>
                <Field label="Views"><input type="number" className="w-full px-3 py-2 text-sm" value={draft.views || ""} onChange={(e) => setDraft({ ...draft, views: Number(e.target.value) })} /></Field>
                <Field label="Likes"><input type="number" className="w-full px-3 py-2 text-sm" value={draft.likes || ""} onChange={(e) => setDraft({ ...draft, likes: Number(e.target.value) })} /></Field>
                <Field label="Comments"><input type="number" className="w-full px-3 py-2 text-sm" value={draft.comments || ""} onChange={(e) => setDraft({ ...draft, comments: Number(e.target.value) })} /></Field>
                <Field label="Watch time (h)"><input type="number" className="w-full px-3 py-2 text-sm" value={draft.watchTime || ""} onChange={(e) => setDraft({ ...draft, watchTime: Number(e.target.value) })} /></Field>
                <div className="col-span-2 lg:col-span-4">
                  <Field label="Notes"><input className="w-full px-3 py-2 text-sm" placeholder="Performance notes, ideas for improvement" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></Field>
                </div>
              </div>
              <Button onClick={save} className="mt-3"><Icon name="CheckCircle2" className="h-4 w-4" /> Save to library</Button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter */}
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setFilter("all")} className={`rounded-full px-3 py-1 text-xs font-medium ${filter === "all" ? "youtube-bg text-red-400" : "glass text-muted hover:text-current"}`}>All</button>
        {(["shorts", "long_video", "event", "admission", "teacher_tip", "student_achievement"] as YouTubeContentType[]).map((ct) => (
          <button key={ct} onClick={() => setFilter(ct)} className={`rounded-full px-3 py-1 text-xs font-medium ${filter === ct ? "youtube-bg text-red-400" : "glass text-muted hover:text-current"}`}>{ct.replace(/_/g, " ")}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <GlassCard hover={false} className="grid min-h-[150px] place-items-center text-center text-sm text-muted">
          No videos found. Add your first video to the library.
        </GlassCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <GlassCard key={v.id} hover={false} className="border-l-4" style={{ borderLeftColor: contentTypeColor(v.contentType) }}>
              <div className="flex items-start justify-between">
                <span className="rounded-md px-2 py-0.5 text-[10px] font-medium" style={{ background: `${contentTypeColor(v.contentType)}22`, color: contentTypeColor(v.contentType) }}>
                  {v.contentType.replace(/_/g, " ")}
                </span>
                <span className="text-xs font-semibold" style={{ color: v.performanceRating >= 70 ? "#22c55e" : v.performanceRating >= 50 ? "#eab308" : "#ef4444" }}>
                  {v.performanceRating}%
                </span>
              </div>
              <h4 className="mt-2 text-sm font-semibold leading-tight">{v.title}</h4>
              <p className="mt-1 text-[11px] text-muted">{v.datePublished}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted">
                <span>👁 {formatNumber(v.views)}</span>
                <span>❤ {formatNumber(v.likes)}</span>
                <span>💬 {v.comments}</span>
                <span>⏱ {v.watchTime}h</span>
              </div>
              {v.notes && <p className="mt-2 text-[11px] italic text-muted">{v.notes}</p>}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

// 9. Analytics Insight Agent
function AnalyticsInsight({ school }: { school: typeof schools[0] }) {
  const [numbers, setNumbers] = useState("Total views 5100, subscribers 140, best video 1560 views (admissions), Shorts avg 300 views, engagement 2.9%");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!numbers.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ctx = { schoolName: `${school.name} (${school.branch})`, schoolShort: school.name, branch: school.branch, platform: "youtube" as const, followers: school.followers.youtube, values: { numbers } };
    const { runYouTubeAnalyticsInsight } = await import("@/lib/ai/agentRunners");
    const text = await runYouTubeAnalyticsInsight(ctx);
    setOutput(text);
    setLoading(false);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassCard hover={false}>
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500/15 text-teal-400"><Icon name="BarChart3" className="h-4 w-4" /></div>
          <h3 className="font-semibold">Analytics Insight Agent</h3>
        </div>
        <p className="mb-4 text-xs text-muted">Paste your YouTube analytics numbers and get actionable insights — what worked, what failed, what to post next.</p>
        <Field label="Your YouTube numbers">
          <textarea className="min-h-[120px] w-full resize-y px-3 py-2 text-sm outline-none" value={numbers} onChange={(e) => setNumbers(e.target.value)} />
        </Field>
        <Button onClick={run} disabled={loading || !numbers.trim()} className="mt-4 w-full">
          <Icon name={loading ? "Sparkles" : "BarChart3"} className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Analysing…" : "Generate Insights"}
        </Button>
      </GlassCard>

      <div>
        {output ? (
          <AgentOutput text={output} accent="#14b8a6" />
        ) : (
          <GlassCard hover={false} className="grid min-h-[200px] place-items-center text-center text-sm text-muted">
            <div><Icon name="BarChart3" className="mx-auto mb-2 h-8 w-8 opacity-30" />Input your numbers and get a full analytics diagnosis.</div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

// ── Shared output component ──────────────────────────────────────────────────
function AgentOutput({ text, accent }: { text: string; accent: string }) {
  const [copied, setCopied] = useState(false);
  const blocks = text.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  return (
    <GlassCard hover={false} className="max-h-[600px] overflow-y-auto">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">Output</h4>
        <div className="flex gap-1">
          <button onClick={async () => { await copyToClipboard(text); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="rounded-lg p-1.5 hover:bg-white/10">
            <Icon name="Copy" className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => downloadText("output.txt", text)} className="rounded-lg p-1.5 hover:bg-white/10">
            <Icon name="Download" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {copied && <p className="mb-2 text-[10px] text-emerald-400">Copied!</p>}
      <div className="space-y-2.5">
        {blocks.map((block, i) => {
          const lines = block.split("\n");
          const [title, ...body] = lines;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <p className="text-[13px] font-semibold" style={{ color: accent }}>{title}</p>
              {body.length > 0 && (
                <pre className="mt-0.5 whitespace-pre-wrap break-words font-sans text-[13px] leading-relaxed text-current/90">
                  {body.join("\n")}
                </pre>
              )}
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
