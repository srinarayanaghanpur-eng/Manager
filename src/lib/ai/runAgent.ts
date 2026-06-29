// Bridges the agent cards to the underlying generators and returns a
// human-readable text block (used for display, copy, export and save).
import { generateContentIdea } from "./generateContentIdea";
import { generateCaption, type CaptionStyle } from "./generateCaption";
import { generateTrendIdeas } from "./generateTrendIdeas";
import {
  runViralReel, runParentTrust, runAdmissionsGrowth, runTrendAdapt,
  runWeeklyPlanner, runShortsGrowth, runFacebookLocal, runAnalyticsDoctor,
  runYouTubeShorts, runYouTubeLongVideo, runCrossPlatformRepurpose, runYouTubeAnalyticsInsight,
  type AgentCtx,
} from "./agentRunners";
import type { Platform } from "@/lib/types";

export interface AgentRunInput {
  schoolName: string; // "Sri Narayana High School (Ghanpur)"
  schoolShort: string; // "Sri Narayana High School"
  branch: string; // "Ghanpur"
  schoolId: string;
  followers: number;
  values: Record<string, string>;
}

export async function runAgent(agentId: string, input: AgentRunInput): Promise<string> {
  const platform = (input.values.platform as Platform) || "instagram";
  const ctx: AgentCtx = {
    schoolName: input.schoolName,
    schoolShort: input.schoolShort,
    branch: input.branch,
    platform,
    followers: input.followers,
    values: input.values,
  };

  switch (agentId) {
    // ── Flagship agents ──────────────────────────────────────────────────
    case "viral-reel": return runViralReel(ctx);
    case "parent-trust": return runParentTrust(ctx);
    case "admissions-growth": return runAdmissionsGrowth(ctx);
    case "trend-adapt": return runTrendAdapt(ctx);
    case "weekly-planner": return runWeeklyPlanner(ctx);
    case "shorts-growth": return runShortsGrowth(ctx);
    case "fb-local": return runFacebookLocal(ctx);
    case "analytics-doctor": return runAnalyticsDoctor(ctx);

    // ── Focused utility agents ───────────────────────────────────────────
    case "trend-finder": {
      const trends = await generateTrendIdeas();
      return trends.slice(0, 5).map((t, i) =>
        `${i + 1}. ${t.title}\n   Why it works: ${t.whyItWorks}\n   Hook: ${t.hook}\n   Caption: ${t.caption}\n   Platform: ${t.bestPlatform} · Reach score: ${t.reachScore} · Student face: ${t.needsStudentFace ? "Yes (consent needed)" : "No"}\n   Hashtags: ${t.hashtags.join(" ")}`
      ).join("\n\n");
    }
    case "caption": {
      const c = await generateCaption({
        topic: input.values.topic || "Admissions open",
        schoolName: input.schoolShort,
        platform,
        style: (input.values.style as CaptionStyle) || "premium",
      });
      return `CAPTION (${input.values.style || "premium"}):\n${c.caption}\n\nHashtags:\nLocal: ${c.hashtagGroups.local.join(" ")}\nSchool: ${c.hashtagGroups.school.join(" ")}\nEducation: ${c.hashtagGroups.education.join(" ")}\nAdmission: ${c.hashtagGroups.admission.join(" ")}\nEvent: ${c.hashtagGroups.event.join(" ")}`;
    }
    case "hashtag": {
      const c = await generateCaption({
        topic: input.values.topic || "", schoolName: input.schoolShort, platform, style: "short",
      });
      const g = c.hashtagGroups;
      return `HASHTAG SETS\n\nLocal:\n${g.local.join(" ")}\n\nSchool:\n${g.school.join(" ")}\n\nEducation:\n${g.education.join(" ")}\n\nAdmission:\n${g.admission.join(" ")}\n\nEvent:\n${g.event.join(" ")}`;
    }
    // ── YouTube agents ───────────────────────────────────────────────────
    case "youtube-shorts": return runYouTubeShorts(ctx);
    case "youtube-long-video": return runYouTubeLongVideo(ctx);
    case "cross-platform-repurpose": return runCrossPlatformRepurpose(ctx);
    case "youtube-analytics-insight": return runYouTubeAnalyticsInsight(ctx);
    case "poster-prompt": {
      const idea = await generateContentIdea({
        schoolName: input.schoolShort, platform, contentType: "poster",
        goal: "admissions", language: "english", tone: "premium",
      });
      return `CANVA POSTER PROMPT:\n${idea.canvaPosterPrompt}\n\nAI VIDEO/IMAGE PROMPT:\n${idea.videoGenPrompt}\n\nThumbnail text: ${idea.thumbnailText}`;
    }
    default:
      return "Agent not found.";
  }
}
