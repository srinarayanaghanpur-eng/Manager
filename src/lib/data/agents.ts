import type { AgentDef } from "@/lib/types";

const platformOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
];

const durationOptions = [
  { value: "10", label: "10 sec" },
  { value: "20", label: "20 sec" },
  { value: "30", label: "30 sec" },
  { value: "60", label: "60 sec" },
];

const captionStyleOptions = [
  { value: "premium", label: "Premium" },
  { value: "emotional", label: "Emotional" },
  { value: "short", label: "Short" },
  { value: "telugu", label: "Telugu" },
  { value: "hinglish", label: "Hinglish" },
];

// The roster. The 8 flagship automation agents come first, followed by the
// focused utility agents. Every agent declares its own input schema so the UI
// renders the right form automatically.
export const agents: AgentDef[] = [
  // ── Flagship agents ──────────────────────────────────────────────────────
  {
    id: "viral-reel",
    name: "School Viral Reel Agent",
    description: "Turns any school moment into a scroll-stopping, share-ready reel.",
    tagline: "Hook → script → shot list → caption, ready to shoot.",
    icon: "Clapperboard",
    accent: "#a855f7",
    category: "Content",
    outputs: ["Hook", "Script", "Shot list", "Voiceover", "Caption", "Hashtags", "CTA"],
    fields: [
      { key: "school", label: "School", type: "school" },
      { key: "platform", label: "Platform", type: "platform" },
      { key: "topic", label: "Topic / moment", type: "text", placeholder: "e.g. Morning assembly, Science fair", full: true },
      { key: "audience", label: "Target audience", type: "text", placeholder: "e.g. Local parents of class 6–10" },
      { key: "duration", label: "Duration", type: "select", options: durationOptions, default: "30" },
    ],
  },
  {
    id: "parent-trust",
    name: "Parent Trust Builder Agent",
    description: "Answers a real parent worry with warm, credible content across channels.",
    tagline: "Post idea, caption, reel script & WhatsApp note that build trust.",
    icon: "ShieldCheck",
    accent: "#22c55e",
    category: "Trust",
    outputs: ["Post idea", "Caption", "Reel script", "WhatsApp message"],
    fields: [
      { key: "school", label: "School", type: "school" },
      { key: "concern", label: "Parent's concern", type: "textarea", placeholder: "e.g. Is my child safe during school hours? Are studies serious enough?", full: true },
    ],
  },
  {
    id: "admissions-growth",
    name: "Admissions Growth Agent",
    description: "Builds a full 7-day campaign to hit a class admissions target.",
    tagline: "Day-by-day admission campaign with posts, CTAs & follow-ups.",
    icon: "UserPlus",
    accent: "#3563ff",
    category: "Growth",
    outputs: ["7-day campaign", "Daily posts", "CTAs", "Follow-up plan"],
    fields: [
      { key: "school", label: "School", type: "school" },
      { key: "target", label: "Class & admissions target", type: "text", placeholder: "e.g. 40 new admissions for Class 1–5", full: true },
      { key: "offer", label: "Offer / key message", type: "textarea", placeholder: "e.g. Early-bird fee waiver, free uniform, scholarship test", full: true },
    ],
  },
  {
    id: "trend-adapt",
    name: "Trend Adaptation Agent",
    description: "Rewrites any viral trend or audio into a 100% school-safe version.",
    tagline: "Take a trend → get a classroom-friendly remake plan.",
    icon: "TrendingUp",
    accent: "#ec4899",
    category: "Growth",
    outputs: ["Safe concept", "Script", "Caption", "Safety notes"],
    fields: [
      { key: "school", label: "School", type: "school" },
      { key: "platform", label: "Platform", type: "platform" },
      { key: "trend", label: "Trending audio / topic", type: "text", placeholder: "e.g. 'Aura points' trend, a viral dance audio", full: true },
    ],
  },
  {
    id: "weekly-planner",
    name: "Weekly Planner Agent",
    description: "Lays out a complete Monday–Sunday posting plan around a goal.",
    tagline: "A full week of posts, platforms & timing in one click.",
    icon: "CalendarRange",
    accent: "#8b5cf6",
    category: "Growth",
    outputs: ["Mon–Sun plan", "Platforms", "Posting times", "Weekly goal"],
    fields: [
      { key: "school", label: "School", type: "school" },
      { key: "goal", label: "Goal for the week", type: "text", placeholder: "e.g. Push admissions, build trust, grow reels", full: true },
    ],
  },
  {
    id: "shorts-growth",
    name: "YouTube Shorts Growth Agent",
    description: "Optimises a topic into a high-retention YouTube Short.",
    tagline: "Title, description, tags, thumbnail text & full script.",
    icon: "Youtube",
    accent: "#ef4444",
    category: "Content",
    outputs: ["Title", "Description", "Tags", "Thumbnail text", "Script"],
    fields: [
      { key: "school", label: "School", type: "school" },
      { key: "topic", label: "Topic", type: "text", placeholder: "e.g. A day in our science lab", full: true },
    ],
  },
  {
    id: "fb-local",
    name: "Facebook Local Reach Agent",
    description: "Writes a parent-friendly Facebook post tuned for a local village audience.",
    tagline: "Local-language friendly post + a smart boost suggestion.",
    icon: "Facebook",
    accent: "#1877F2",
    category: "Growth",
    outputs: ["Facebook post", "Boost suggestion", "Targeting", "Best time"],
    fields: [
      { key: "school", label: "School", type: "school" },
      { key: "locality", label: "Village / local audience", type: "text", placeholder: "e.g. Parents in Ghanpur & nearby villages", full: true },
    ],
  },
  {
    id: "analytics-doctor",
    name: "Analytics Doctor Agent",
    description: "Diagnoses your numbers and prescribes exactly what to post next.",
    tagline: "What's working, what's not, and your next 5 posts.",
    icon: "BarChart3",
    accent: "#14b8a6",
    category: "Insights",
    outputs: ["Diagnosis", "Working", "Not working", "Next posts"],
    fields: [
      { key: "school", label: "School", type: "school" },
      { key: "numbers", label: "Analytics numbers", type: "textarea", placeholder: "e.g. Reach 12k, engagement 3.1%, reels 8k views, followers +120, FB flat", full: true },
    ],
  },

  // ── Focused utility agents ───────────────────────────────────────────────
  {
    id: "trend-finder",
    name: "Trend Finder Agent",
    description: "Suggests school-safe trending ideas with reach scores.",
    tagline: "5 fresh, safe content ideas ranked by reach potential.",
    icon: "Lightbulb",
    accent: "#f59e0b",
    category: "Growth",
    outputs: ["5 ideas", "Hooks", "Reach scores", "Hashtags"],
    fields: [
      { key: "school", label: "School", type: "school" },
      { key: "platform", label: "Platform", type: "platform" },
    ],
  },
  {
    id: "caption",
    name: "Caption Agent",
    description: "Writes captions in multiple styles & languages.",
    tagline: "On-brand captions with grouped hashtag sets.",
    icon: "PenLine",
    accent: "#06b6d4",
    category: "Content",
    outputs: ["Caption", "Hashtag sets"],
    fields: [
      { key: "school", label: "School", type: "school" },
      { key: "platform", label: "Platform", type: "platform" },
      { key: "style", label: "Style", type: "select", options: captionStyleOptions, default: "premium" },
      { key: "topic", label: "Topic", type: "text", placeholder: "e.g. Admissions open, Sports day", full: true },
    ],
  },
  {
    id: "hashtag",
    name: "Hashtag Agent",
    description: "Builds grouped hashtag sets (local, school, admission…).",
    tagline: "Ready-to-paste hashtag groups for maximum discovery.",
    icon: "Hash",
    accent: "#0ea5e9",
    category: "Content",
    outputs: ["Local", "School", "Education", "Admission", "Event"],
    fields: [
      { key: "school", label: "School", type: "school" },
      { key: "topic", label: "Topic", type: "text", placeholder: "e.g. Annual day", full: true },
    ],
  },
  {
    id: "poster-prompt",
    name: "Poster Prompt Agent",
    description: "Creates Canva & AI poster generation prompts.",
    tagline: "Design-ready prompts for Canva and AI image tools.",
    icon: "Image",
    accent: "#eab308",
    category: "Content",
    outputs: ["Canva prompt", "AI image prompt", "Thumbnail text"],
    fields: [
      { key: "school", label: "School", type: "school" },
      { key: "platform", label: "Platform", type: "platform" },
      { key: "topic", label: "Topic", type: "text", placeholder: "e.g. Admissions open 2026", full: true },
    ],
  },
];

export const agentCategories: { id: string; label: string }[] = [
  { id: "all", label: "All agents" },
  { id: "Content", label: "Content" },
  { id: "Growth", label: "Growth" },
  { id: "Trust", label: "Trust" },
  { id: "Insights", label: "Insights" },
];
