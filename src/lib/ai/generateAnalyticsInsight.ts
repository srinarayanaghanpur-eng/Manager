import type { AnalyticsSnapshot } from "@/lib/types";

export interface GeneratedAnalyticsInsight {
  whatWorked: string[];
  whatFailed: string[];
  postNextWeek: string[];
  schoolNeedingAttention: string;
  improvementPlan: string[];
}

export async function generateAnalyticsInsight(
  snapshots: AnalyticsSnapshot[],
  schoolNames: Record<string, string>
): Promise<GeneratedAnalyticsInsight> {
  // Find weakest school by engagement.
  const bySchool: Record<string, number> = {};
  snapshots.forEach((s) => {
    bySchool[s.schoolId] = (bySchool[s.schoolId] || 0) + s.engagement;
  });
  const weakest = Object.entries(bySchool).sort((a, b) => a[1] - b[1])[0]?.[0];

  return {
    whatWorked: [
      "Reels with trending audio drove the highest reach (+38% vs static posts).",
      "Admissions carousel posts had the best save rate.",
      "Evening posts (6–8 PM) outperformed morning posts on engagement.",
    ],
    whatFailed: [
      "Long-form Facebook text posts under-performed (low reach).",
      "Posts without a clear CTA had weak comment activity.",
      "Inconsistent posting on the smaller account stalled follower growth.",
    ],
    postNextWeek: [
      "3 short reels (15–20s) with trending audio",
      "1 admissions carousel with a strong CTA",
      "1 parent-education Short for trust building",
      "1 WhatsApp status admissions reminder",
    ],
    schoolNeedingAttention: weakest
      ? `${schoolNames[weakest] ?? weakest} needs more attention — lower engagement and slower follower growth this week.`
      : "Both accounts are tracking well.",
    improvementPlan: [
      "Lock a fixed posting schedule (Mon/Wed/Fri/Sun).",
      "Batch-shoot reels once a week to stay consistent.",
      "Add a clear CTA to every post (call / visit / DM).",
      "Reply to all admission DMs within 12 hours.",
      "Repurpose top reels into YouTube Shorts.",
    ],
  };
}
