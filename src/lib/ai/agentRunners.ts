// Rich, structured text generators for the flagship automation agents.
// Each returns a human-readable block used for display, copy, export and
// "save to calendar". They compose the existing primitive generators where
// useful so behaviour stays consistent with the rest of the app.
import type { Platform } from "@/lib/types";
import { generateReelScript, type ReelDuration } from "./generateReelScript";
import { generateCaption } from "./generateCaption";
import { platformLabel } from "@/lib/utils";

export interface AgentCtx {
  schoolName: string; // "Sri Narayana High School (Ghanpur)"
  schoolShort: string; // "Sri Narayana High School"
  branch: string; // "Ghanpur"
  platform: Platform;
  followers: number;
  values: Record<string, string>;
}

const val = (ctx: AgentCtx, key: string, fallback = "") =>
  (ctx.values[key]?.trim() || fallback);

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ── 1. School Viral Reel Agent ──────────────────────────────────────────────
export async function runViralReel(ctx: AgentCtx): Promise<string> {
  const topic = val(ctx, "topic", "A day at our school");
  const audience = val(ctx, "audience", "local parents");
  const duration = (Number(val(ctx, "duration", "30")) || 30) as ReelDuration;
  const reel = await generateReelScript({
    category: topic, schoolName: ctx.schoolShort, duration, platform: ctx.platform,
  });
  const cap = await generateCaption({
    topic, schoolName: ctx.schoolShort, platform: ctx.platform, style: "premium",
  });
  const tags = [
    ...cap.hashtagGroups.local.slice(0, 3),
    ...cap.hashtagGroups.school.slice(0, 3),
    ...cap.hashtagGroups.education.slice(0, 3),
    ...cap.hashtagGroups.event.slice(0, 2),
  ];

  return [
    `🎬 VIRAL REEL BLUEPRINT — ${topic}`,
    `${platformLabel(ctx.platform)} · ${duration}s · For: ${audience}`,
    ``,
    `🪝 HOOK (first 2 seconds)`,
    `"You won't believe what happens every morning at ${ctx.schoolShort}…"`,
    `Open on motion + a bold on-screen line. No slow intros — earn the scroll.`,
    ``,
    `🎞️ SCRIPT`,
    `0-2s: Hook line on screen, fast push-in on the ${topic} moment.`,
    `2-${Math.round(duration * 0.6)}s: 3 quick proof shots — real students, real learning, real care.`,
    `${Math.round(duration * 0.6)}-${duration}s: Pay-off + ${ctx.schoolShort} logo + CTA card.`,
    ``,
    `📋 SHOT LIST`,
    ...reel.scenes.map((s, i) => `  ${i + 1}. [${s.time}] ${s.visual} — ${s.camera}${s.textOverlay ? ` | text: "${s.textOverlay}"` : ""}`),
    ``,
    `🎙️ VOICEOVER`,
    reel.voiceover,
    ``,
    `✍️ CAPTION`,
    cap.caption,
    ``,
    `#️⃣ HASHTAGS`,
    tags.join(" "),
    ``,
    `📣 CALL TO ACTION`,
    reel.cta,
    ``,
    `🎵 Music: ${reel.music}`,
    `⚠️ Use only students with signed parent consent on camera.`,
  ].join("\n");
}

// ── 2. Parent Trust Builder Agent ───────────────────────────────────────────
export async function runParentTrust(ctx: AgentCtx): Promise<string> {
  const concern = val(ctx, "concern", "Is my child safe and learning well here?");
  const cap = await generateCaption({
    topic: "Your child is safe and growing", schoolName: ctx.schoolShort, platform: "facebook", style: "emotional",
  });

  return [
    `💚 PARENT TRUST KIT`,
    `Concern addressed: "${concern}"`,
    ``,
    `💡 POST IDEA`,
    `A calm, honest "behind the scenes" post that directly answers this worry — show the real systems, faces (consented) and daily care that prove it, instead of just claiming it.`,
    ``,
    `✍️ CAPTION`,
    `Dear parents, we hear you. ${concern.replace(/\?+$/, "")} is something we take seriously every single day.`,
    cap.caption,
    `— Team ${ctx.schoolShort}, ${ctx.branch}`,
    ``,
    `🎬 REEL SCRIPT (20s)`,
    `0-3s: On-screen text: "${concern}"`,
    `3-8s: Show the real answer in action (e.g. attendance check, safe campus, attentive teachers).`,
    `8-15s: A teacher or head speaks one warm, reassuring line to camera.`,
    `15-20s: "Your trust is our responsibility." + ${ctx.schoolShort} logo + contact.`,
    ``,
    `💬 WHATSAPP MESSAGE`,
    `Namaste 🙏 This is ${ctx.schoolShort}, ${ctx.branch}. We know "${concern.toLowerCase().replace(/\?+$/, "")}" matters to you. Here's exactly how we handle it — and you're always welcome to visit and see for yourself. Reply here anytime. 💙`,
    ``,
    `⚠️ Keep it honest. Only promise what the school truly delivers.`,
  ].join("\n");
}

// ── 3. Admissions Growth Agent ──────────────────────────────────────────────
export async function runAdmissionsGrowth(ctx: AgentCtx): Promise<string> {
  const target = val(ctx, "target", "new admissions");
  const offer = val(ctx, "offer", "early-bird benefits for families who join this month");
  const plan = [
    { d: "Day 1", t: "Announcement", a: `Bold "Admissions Open" reel + post. Lead with the offer: ${offer}.`, p: "Instagram + Facebook" },
    { d: "Day 2", t: "Proof", a: "Parent testimonial / results highlight — why families chose us.", p: "Facebook + WhatsApp status" },
    { d: "Day 3", t: "Tour", a: "60s campus tour reel ending on the admissions CTA.", p: "Instagram + YouTube Short" },
    { d: "Day 4", t: "Value", a: `Carousel: "Why ${ctx.schoolShort}?" — 5 concrete reasons.`, p: "Instagram + Facebook" },
    { d: "Day 5", t: "Urgency", a: `Reminder: limited seats for ${target}. Countdown sticker.`, p: "WhatsApp + Stories" },
    { d: "Day 6", t: "Community", a: "Festival / values post that locals love + soft CTA.", p: "Facebook" },
    { d: "Day 7", t: "Close", a: "Last-call post + DM/call drive. Collect enquiries.", p: "All channels" },
  ];

  return [
    `🚀 7-DAY ADMISSIONS CAMPAIGN`,
    `Target: ${target}`,
    `Offer: ${offer}`,
    `School: ${ctx.schoolShort}, ${ctx.branch}`,
    ``,
    ...plan.map((x) => `${x.d} — ${x.t}\n  Post: ${x.a}\n  Where: ${x.p}\n  CTA: "📞 Call ${ctx.branch} school / DM 'JOIN' to book a seat."`),
    ``,
    `📈 FOLLOW-UP PLAN`,
    `• Reply to every enquiry within 1 hour (template: warm greeting + invite to visit).`,
    `• Day 3 & Day 6: WhatsApp nudge to anyone who showed interest but didn't book.`,
    `• Log every lead in the Leads page and move it through the pipeline.`,
    ``,
    `🎯 GOAL CHECK: track DMs, calls and visits daily. If a day underperforms, repost the best reel as a Story with the offer.`,
  ].join("\n");
}

// ── 4. Trend Adaptation Agent ───────────────────────────────────────────────
export async function runTrendAdapt(ctx: AgentCtx): Promise<string> {
  const trend = val(ctx, "trend", "a viral trend");
  return [
    `🔁 SCHOOL-SAFE TREND REMAKE`,
    `Original trend: ${trend}`,
    `Platform: ${platformLabel(ctx.platform)}`,
    ``,
    `✅ SAFE CONCEPT`,
    `Keep the format and timing that made "${trend}" work, but swap the content for a wholesome school version — students, teachers, classrooms, achievements. The familiar structure gets the reach; the safe content protects the brand.`,
    ``,
    `🎬 SCRIPT`,
    `0-2s: Match the trend's signature opening beat (same rhythm / on-screen hook).`,
    `2-7s: Reveal — but it's "${ctx.schoolShort}" themed (e.g. subjects, teachers, exam life).`,
    `7-12s: Punchline / payoff that's funny or proud, never embarrassing to any child.`,
    `12-15s: ${ctx.schoolShort} logo + soft CTA.`,
    ``,
    `✍️ CAPTION`,
    `We had to do the "${trend}" trend… ${ctx.schoolShort} edition 😄🎓 Tag a parent who'd love this!`,
    ``,
    `⚠️ SAFETY NOTES`,
    `• Check the original audio is clean (no abusive / adult lyrics) before using.`,
    `• No mocking, ranking, or embarrassing students. Keep it kind.`,
    `• Only consented students on camera. When in doubt, use teachers or text-only.`,
    `• If the trend itself is risky or controversial, skip it — reputation > reach.`,
  ].join("\n");
}

// ── 5. Weekly Planner Agent ─────────────────────────────────────────────────
export async function runWeeklyPlanner(ctx: AgentCtx): Promise<string> {
  const goal = val(ctx, "goal", "steady growth & trust");
  const plan = [
    { idea: "Motivation reel — student confidence", p: "instagram", t: "8:00 AM" },
    { idea: "Teacher tip Short — exam preparation", p: "youtube", t: "5:00 PM" },
    { idea: "Parent must-know carousel — study routine", p: "facebook", t: "8:30 PM" },
    { idea: "Classroom activity reel with trending audio", p: "instagram", t: "1:00 PM" },
    { idea: "Admissions reminder status", p: "whatsapp", t: "9:00 AM" },
    { idea: "Weekend highlight reel — best moments", p: "instagram", t: "11:00 AM" },
    { idea: "Values / festival post for parents", p: "facebook", t: "7:30 PM" },
  ];
  return [
    `🗓️ WEEKLY POSTING PLAN`,
    `Goal: ${goal}`,
    `School: ${ctx.schoolShort}, ${ctx.branch}`,
    ``,
    ...days.map((d, i) => `${d}\n  📌 ${plan[i].idea}\n  📱 ${platformLabel(plan[i].p as Platform)}  ⏰ ${plan[i].t}`),
    ``,
    `🎯 THIS WEEK'S FOCUS`,
    `• At least 3 reels (reels drive the most reach).`,
    `• 1 admissions push + 1 trust post — every single week.`,
    `• Keep posting times fixed so the audience learns when to expect you.`,
    ``,
    `📈 TARGET: aim for +${Math.max(40, Math.round(ctx.followers * 0.05))} followers and 1 reel crossing 5K views.`,
  ].join("\n");
}

// ── 6. YouTube Shorts Growth Agent ──────────────────────────────────────────
export async function runShortsGrowth(ctx: AgentCtx): Promise<string> {
  const topic = val(ctx, "topic", "a day at our school");
  return [
    `▶️ YOUTUBE SHORT — ${topic}`,
    `School: ${ctx.schoolShort}, ${ctx.branch}`,
    ``,
    `📝 TITLE (under 60 chars)`,
    `${topic} at ${ctx.schoolShort}! 🎓 #Shorts`,
    ``,
    `🧾 DESCRIPTION`,
    `A real look at ${topic.toLowerCase()} at ${ctx.schoolShort}, ${ctx.branch}. Admissions open now — call us to visit the campus! 💙`,
    `Subscribe for more from our school family. #Shorts #SchoolLife #${ctx.branch}`,
    ``,
    `🏷️ TAGS`,
    `${ctx.schoolShort}, ${ctx.branch} school, school shorts, best school in ${ctx.branch}, admissions ${new Date().getFullYear() + 0}, school life, education, telangana schools`,
    ``,
    `🖼️ THUMBNAIL TEXT`,
    `Big bold 3 words: "INSIDE OUR SCHOOL" (high contrast, smiling face if consented).`,
    ``,
    `🎬 SCRIPT (≤ 60s, retention-optimised)`,
    `0-2s: Hook — "This is ${topic} at ${ctx.schoolShort}."`,
    `2-10s: Fast cuts, one idea per shot, on-screen captions for sound-off viewers.`,
    `10-45s: Show the most interesting / proud moment. Keep energy high, no dead air.`,
    `45-60s: Pay-off + "Subscribe & visit us" end card.`,
    ``,
    `💡 GROWTH TIP: hook in the first 2s decides everything on Shorts. Re-record the hook until it's irresistible.`,
  ].join("\n");
}

// ── 7. Facebook Local Reach Agent ───────────────────────────────────────────
export async function runFacebookLocal(ctx: AgentCtx): Promise<string> {
  const locality = val(ctx, "locality", `parents in ${ctx.branch} and nearby villages`);
  const cap = await generateCaption({
    topic: "A school your village can trust", schoolName: ctx.schoolShort, platform: "facebook", style: "emotional",
  });
  return [
    `📘 FACEBOOK LOCAL POST`,
    `Audience: ${locality}`,
    ``,
    `✍️ POST`,
    `🙏 Namaste, dear parents of ${locality}.`,
    cap.caption,
    `At ${ctx.schoolShort}, ${ctx.branch}, your child learns close to home — with caring teachers and a safe campus. 💙`,
    `📞 Call us or visit today. Admissions open!`,
    ``,
    `#️⃣ ${cap.hashtagGroups.local.join(" ")} ${cap.hashtagGroups.school.slice(0, 2).join(" ")}`,
    ``,
    `🚀 BOOST SUGGESTION`,
    `• Objective: Reach / Engagement (not link clicks — locals respond to the post itself).`,
    `• Budget: ₹150–₹300 over 3 days is plenty for a village radius.`,
    `• Targeting: Parents aged 28–45 within 10–15 km of ${ctx.branch}.`,
    `• Best time: 8:00–9:30 PM, when parents are free after dinner.`,
    `• Creative: a warm photo or short reel beats plain text every time.`,
    ``,
    `⚠️ Confirm parent consent for any student faces before boosting.`,
  ].join("\n");
}

// ── 8. Analytics Doctor Agent ───────────────────────────────────────────────
export async function runAnalyticsDoctor(ctx: AgentCtx): Promise<string> {
  const numbers = val(ctx, "numbers", "reach down, engagement low, reels flat");
  return [
    `🩺 ANALYTICS DIAGNOSIS`,
    `Your numbers: ${numbers}`,
    `School: ${ctx.schoolShort}, ${ctx.branch}`,
    ``,
    `✅ WHAT'S WORKING`,
    `• Reels / video are doing the heavy lifting — keep them as your #1 format.`,
    `• Posts with real student & teacher faces (consented) earn the most saves and shares.`,
    `• Emotional, parent-focused posts outperform generic announcements.`,
    ``,
    `❌ WHAT'S NOT WORKING`,
    `• Plain-text or poster-only posts are dragging your average reach down.`,
    `• Inconsistent posting is confusing the algorithm — gaps kill momentum.`,
    `• Weak first 2 seconds = low watch time = limited reach. Fix the hooks.`,
    ``,
    `🎯 POST THESE NEXT (5)`,
    `1. A high-energy reel with a strong 2-second hook (your best-performing topic).`,
    `2. A parent trust post answering one common worry.`,
    `3. A YouTube Short repurposed from your top reel.`,
    `4. A "5 reasons to join ${ctx.schoolShort}" admissions carousel.`,
    `5. A weekend highlight reel set to trending (clean) audio.`,
    ``,
    `📅 PRESCRIPTION: post consistently (same times daily), lead with reels, and review again in 7 days.`,
  ].join("\n");
}
