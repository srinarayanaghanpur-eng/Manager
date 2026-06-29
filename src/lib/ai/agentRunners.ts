// Rich, structured text generators for the flagship automation agents.
// Each returns a human-readable block used for display, copy, export and
// "save to calendar". They compose the existing primitive generators where
// useful so behaviour stays consistent with the rest of the app.
import type { Platform } from "@/lib/types";
import { generateReelScript, type ReelDuration } from "./generateReelScript";
import { generateCaption } from "./generateCaption";
import { platformLabel, formatNumber } from "@/lib/utils";

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

// ── 9. YouTube Shorts Agent ──────────────────────────────────────────────────
export async function runYouTubeShorts(ctx: AgentCtx): Promise<string> {
  const topic = val(ctx, "topic", "school activity");
  const duration = val(ctx, "duration", "30");
  const language = val(ctx, "language", "english");
  const goal = val(ctx, "goal", "views");

  const goalLabels: Record<string, string> = { views: "Views & reach", admissions: "Admission enquiries", parent_trust: "Parent trust", branding: "School branding" };
  const langLabels: Record<string, string> = { english: "English", telugu: "Telugu", hinglish: "Hinglish" };
  const durations: Record<string, string> = { "10": "10 seconds", "20": "20 seconds", "30": "30 seconds", "60": "60 seconds" };

  return [
    `▶️ YOUTUBE SHORTS SCRIPT`,
    `School: ${ctx.schoolShort} (${ctx.branch})`,
    `Topic: ${topic}`,
    `Duration: ${durations[duration] || "30 seconds"}  |  Language: ${langLabels[language] || "English"}  |  Goal: ${goalLabels[goal] || "Views"}`,
    ``,
    `📝 TITLE`,
    `${topic} at ${ctx.schoolShort}! 🎓 #Shorts`,
    ``,
    `🪝 HOOK LINE (first 2 seconds)`,
    `"${topic} at ${ctx.schoolShort} — you won't believe this! 👀"`,
    `[On-screen text: "${topic.toUpperCase()} — ${ctx.schoolShort.toUpperCase()}"]`,
    ``,
    `🎙️ VOICEOVER (${language})`,
    language === "telugu"
      ? `"${ctx.schoolShort} లో ${topic} చూడండి. పిల్లల నేర్చుకునే తీరు అద్భుతం! మీరు కూడా చూడండి."`
      : language === "hinglish"
      ? `"Dekhiye ${ctx.schoolShort} mein ${topic}. Bacche sikh rahe hain aur mazaa kar rahe hain. Aaiye aur dekhiye!"`
      : `"Watch ${topic} at ${ctx.schoolShort}. Our students learn with passion and joy. Come see the difference!"`,
    ``,
    `🎬 SCENE-BY-SCENE SCRIPT (${duration}s)`,
    `0-2s: Hook — fast opening shot of ${topic}. Text overlay: "${topic}"`,
    `2-${Math.round(Number(duration) * 0.5)}s: Main content — show the activity with upbeat background music`,
    `${Math.round(Number(duration) * 0.5)}-${Number(duration) - 5}s: Student reactions / teacher interaction — genuine moments`,
    `${Number(duration) - 5}-${duration}s: CTA screen — "Subscribe for more" + school logo`,
    ``,
    `📝 TEXT OVERLAY (on screen)`,
    `• "Real learning happens here 💙"`,
    `• "Admissions open 2026"`,
    `• "Subscribe 🔔"`,
    ``,
    `🧾 DESCRIPTION`,
    `${topic} at ${ctx.schoolShort}, ${ctx.branch}. Watch our students shine! 🌟`,
    `Admissions open for 2026-27. Call us to book a campus visit.`,
    ``,
    `#️⃣ HASHTAGS`,
    `#${ctx.schoolShort.replace(/\s+/g, "")} #${ctx.branch}School #SchoolLife #${topic.replace(/\s+/g, "")} #Education #TelanganaSchools #Admissions2026 #Shorts`,
    ``,
    `🖼️ THUMBNAIL TEXT`,
    `"${topic.toUpperCase()}!" — Bold white text with red outline. Show a smiling student or teacher in the background.`,
    ``,
    `⏰ BEST POSTING TIME`,
    `Weekdays 6:00-8:00 PM (parents free after work) · Weekends 10:00 AM-12:00 PM`,
    ``,
    `📣 CALL TO ACTION`,
    `"Subscribe for daily school updates! 🔔" — Pin a comment: "📞 Call us for admissions: ${ctx.branch} school"`,
  ].join("\n");
}

// ── 10. YouTube Long Video Agent ─────────────────────────────────────────────
export async function runYouTubeLongVideo(ctx: AgentCtx): Promise<string> {
  const topic = val(ctx, "topic", "campus tour and facilities");
  const videoType = val(ctx, "videoType", "long_video");

  const typeLabels: Record<string, string> = {
    shorts: "YouTube Shorts", long_video: "Long video", event: "School event",
    admission: "Admission video", parent_guidance: "Parent guidance",
    teacher_tip: "Teacher tip", student_achievement: "Student achievement",
    festival_greeting: "Festival greeting", weekly_highlights: "Weekly highlights",
  };

  return [
    `🎬 LONG-FORM VIDEO BLUEPRINT`,
    `School: ${ctx.schoolShort} (${ctx.branch})`,
    `Topic: ${topic}`,
    `Type: ${typeLabels[videoType] || "Long video"}`,
    ``,
    `📝 VIDEO TITLE (SEO-optimised)`,
    `${topic} | ${ctx.schoolShort} | ${ctx.branch} | A Complete Look 🎓`,
    ``,
    `🎙️ INTRO SCRIPT (first 30-45 seconds)`,
    `"Namaste everyone! Welcome to ${ctx.schoolShort} in ${ctx.branch}. Today we're going to show you ${topic.toLowerCase()}. If you're a parent looking for the best school for your child, this video is for you. Let's go inside!"`,
    ``,
    `📋 FULL VIDEO STRUCTURE`,
    `0:00-0:45 — INTRO: Host welcomes viewers, sets expectation, CTA to subscribe`,
    `0:45-3:00 — MAIN CONTENT 1: Deep dive into the topic with real footage`,
    `3:00-5:30 — MAIN CONTENT 2: Student/teacher interviews, genuine reactions`,
    `5:30-7:00 — MAIN CONTENT 3: Behind-the-scenes, what makes this school special`,
    `7:00-8:30 — ADMISSIONS INFO: How to apply, key dates, contact details`,
    `8:30-10:00 — OUTRO: Recap, subscribe CTA, end screen with suggested videos`,
    ``,
    `🎙️ VOICEOVER (full script)`,
    `Open with warm greeting in local language + English mix. Keep pace moderate — not too fast, not too slow. Use natural pauses. Emphasise keywords like "safe campus", "caring teachers", "best education". Close with direct admission CTA.`,
    ``,
    `📑 CHAPTERS`,
    `0:00 Introduction`,
    `0:45 Inside the Campus`,
    `3:00 Student & Teacher Moments`,
    `5:30 What Makes Us Special`,
    `7:00 Admissions Information`,
    `8:30 Thank You & Next Steps`,
    ``,
    `🧾 DESCRIPTION`,
    `Welcome to ${ctx.schoolShort}, ${ctx.branch}! 🎓`,
    ``,
    `In this video, we take you through ${topic.toLowerCase()}. Whether you're a parent exploring schools or just curious about our campus, this video gives you a real, unfiltered look.`,
    ``,
    `📞 Admissions Open 2026-27 | Call us to book a visit!`,
    `📍 Location: ${ctx.branch}, Warangal District, Telangana`,
    ``,
    `👍 LIKE this video if you found it helpful!`,
    `🔔 SUBSCRIBE for more school updates!`,
    `💬 COMMENT: What would you like to see next?`,
    ``,
    `🏷️ TAGS`,
    `${ctx.schoolShort}, ${ctx.branch} school, best school in ${ctx.branch}, ${topic}, school tour, education, Telangana schools, school ${new Date().getFullYear()}, ${ctx.branch} education, school campus, ${ctx.schoolShort} ${ctx.branch}`,
    ``,
    `🖼️ THUMBNAIL TEXT`,
    `"INSIDE ${ctx.schoolShort.toUpperCase()}" — Large yellow/white text on red background. Include a high-quality photo of the campus or students with consent. Use arrows or circle highlights.`,
    ``,
    `📌 PINNED COMMENT`,
    `Thank you for watching! 🙏 Book a campus visit today — call us 📞 or WhatsApp. Admissions open for 2026-27! Which class is your child joining? Comment below! 💙`,
    ``,
    `🖥️ END SCREEN CTA`,
    `• Subscribe button (60% of viewers should see it)`,
    `• "Watch Next" — Best recommended video`,
    `• "Visit Our School" — Link/contact overlay`,
    `• End card with 10-second countdown to keep retention`,
  ].join("\n");
}

// ── 11. Cross-Platform Repurposing Agent ─────────────────────────────────────
export async function runCrossPlatformRepurpose(ctx: AgentCtx): Promise<string> {
  const topic = val(ctx, "topic", "Today at our school - students engaged in science lab activity");

  return [
    `🔄 CROSS-PLATFORM REPURPOSING KIT`,
    `School: ${ctx.schoolShort} (${ctx.branch})`,
    `Original idea: "${topic}"`,
    ``,
    `━━━ YOUTUBE SHORTS ━━━`,
    `Title: ${topic} at ${ctx.schoolShort}! 🎓`,
    `Script (30s): Open with hook → show the activity → student reactions → CTA "Subscribe for daily updates"`,
    `On-screen text: "Real learning in action 💙"`,
    `Hashtags: #${ctx.schoolShort.replace(/\s+/g, "")} #SchoolLife #${ctx.branch}School #Shorts`,
    `Best time: 6:00 PM weekdays`,
    ``,
    `━━━ INSTAGRAM REEL ━━━`,
    `Caption: 💙 ${topic} at ${ctx.schoolShort}!`,
    `Our students never stop amazing us. From theory to practice — this is what real education looks like.`,
    `👉 Admissions open 2026-27 | DM us for details!`,
    `#Reels #SchoolLife #${ctx.branch} #Education #Admissions2026`,
    `Music: Trending audio (15-30s clip, school-safe version)`,
    `Post time: 7:00 PM`,
    ``,
    `━━━ FACEBOOK REEL ━━━`,
    `Caption: Dear parents 🙏`,
    `Watch your children shine at ${ctx.schoolShort}, ${ctx.branch}! We believe in learning by doing, and our students prove it every day.`,
    `📞 Call us to know more about admissions for 2026-27.`,
    `#${ctx.branch} #School #Parenting #Education #LocalSchool`,
    `Post time: 8:30 PM (when parents are most active)`,
    ``,
    `━━━ WHATSAPP STATUS ━━━`,
    `Text: ✨ ${topic} at ${ctx.schoolShort}! 💙 Learning with joy. Admissions open — DM for details! 📞`,
    `Duration: 15-30 sec clip (vertical, muted-friendly with text overlays)`,
    `Post time: 9:00 AM (morning status check) + 6:00 PM (evening)`,
    ``,
    `#️⃣ UNIFIED HASHTAGS`,
    `#${ctx.schoolShort.replace(/\s+/g, "")} #${ctx.branch}School #SchoolLife #Education #Admissions2026 #TelanganaSchools #FutureLeaders`,
    ``,
    `🖼️ THUMBNAIL TEXT (YouTube) / COVER (Instagram)`,
    `"${topic}" — Bold, readable text. Bright colours. Include a smiling face (consented).`,
    ``,
    `💡 PRO TIP: Post the YouTube Short first → repurpose the same clip for Instagram Reels (different caption) → share to Facebook → WhatsApp status next morning.`,
  ].join("\n");
}

// ── 12. Analytics Insight Agent ──────────────────────────────────────────────
export async function runYouTubeAnalyticsInsight(ctx: AgentCtx): Promise<string> {
  const numbers = val(ctx, "numbers", "Total views 5100, subscribers 140, best video 1560 views (admissions), Shorts avg 300 views, engagement 2.9%");
  return [
    `📊 YOUTUBE ANALYTICS INSIGHT`,
    `School: ${ctx.schoolShort} (${ctx.branch})`,
    `Your numbers: ${numbers}`,
    ``,
    `✅ WHAT WORKED`,
    `• Admission-themed videos drive the highest engagement and views — parents actively search for admission info.`,
    `• Event coverage (Science fair, Annual day) gets good initial views from parent sharing on WhatsApp.`,
    `• Short-form content (<60s) has higher completion rate than long-form for this channel size.`,
    ``,
    `❌ WHAT FAILED / UNDERPERFORMED`,
    `• Plain announcement videos (text-only or low-energy) have below-average retention — viewers click away fast.`,
    `• Inconsistent posting schedule confuses the algorithm — gaps >5 days between uploads hurt reach.`,
    `• Videos without a clear thumbnail strategy get fewer clicks from browse features.`,
    ``,
    `📈 WHICH VIDEO TYPE GOT MORE REACH`,
    `Admission videos > School events > Teacher tips > General campus content`,
    `The pattern is clear: parents engage most with content that directly helps their child's future.`,
    ``,
    `🎯 WHAT TO POST NEXT (5 recommendations)`,
    `1. "Why ${ctx.schoolShort}?" — Parent testimonial video (highest conversion potential)`,
    `2. Day-in-the-life Short — fast-paced, trending audio, student focus`,
    `3. Teacher introduction series — build personal connection with parents`,
    `4. Exam preparation tips from teachers — high save/share value for parents`,
    `5. Campus facilities tour — addresses parent concerns about infrastructure`,
    ``,
    `📈 HOW TO INCREASE SUBSCRIBERS`,
    `• Add "Subscribe" end screen + cards to every video (currently missing)`,
    `• Create a consistent series (e.g. "Teacher Tip Tuesday") to drive return viewers`,
    `• Ask viewers to subscribe in the first 30 seconds of every long video`,
    `• Cross-promote YouTube channel on Instagram & Facebook`,
    `• Run a "Subscribe & win" contest (e.g. school merchandise giveaway)`,
    ``,
    `💼 HOW TO CONVERT VIEWERS INTO ADMISSION ENQUIRIES`,
    `• Add a clear phone number overlay on every video`,
    `• Pin a comment with admissions CTA on every upload`,
    `• Create a dedicated "Admissions 2026" playlist and link in channel banner`,
    `• End every video with a specific CTA: "Call now for a campus visit"`,
    `• Reply to comments within 1 hour — quick response builds trust and drives enquiries`,
  ].join("\n");
}
