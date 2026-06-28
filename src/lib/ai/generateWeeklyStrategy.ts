import type { Platform } from "@/lib/types";

export interface WeeklyStrategyInput {
  schoolName: string;
  followers: number;
  focusGoal: string;
}

export interface GeneratedWeeklyStrategy {
  weekOf: string;
  sevenDayPlan: { day: string; idea: string; platform: Platform }[];
  bestReelIdea: string;
  bestAdmissionPost: string;
  parentEducationTopic: string;
  youtubeTitle: string;
  growthTarget: string;
  mistakesToAvoid: string[];
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const platforms: Platform[] = [
  "instagram",
  "youtube",
  "facebook",
  "instagram",
  "whatsapp",
  "instagram",
  "facebook",
];

export async function generateWeeklyStrategy(
  input: WeeklyStrategyInput
): Promise<GeneratedWeeklyStrategy> {
  const ideas = [
    "Monday motivation reel — student confidence",
    "Teacher tip Short — exam preparation",
    "Parent must-know carousel — study routine",
    "Classroom activity reel with trending audio",
    "WhatsApp status — admissions reminder",
    "Weekend highlight reel — best moments",
    "Festival / values post for parent audience",
  ];

  return {
    weekOf: new Date().toISOString().slice(0, 10),
    sevenDayPlan: days.map((d, i) => ({
      day: d,
      idea: ideas[i],
      platform: platforms[i],
    })),
    bestReelIdea: `"A day at ${input.schoolName}" — fast-cut campus tour set to trending audio, ending on Admissions Open card.`,
    bestAdmissionPost: `Carousel: "5 reasons parents choose ${input.schoolName}" with a strong CTA to call/visit.`,
    parentEducationTopic: "How to build a distraction-free home study corner (3 simple steps).",
    youtubeTitle: `Inside ${input.schoolName}: A Real School Day (Campus Tour 2026)`,
    growthTarget: `Aim for +${Math.max(40, Math.round(input.followers * 0.05))} followers and 3 reels crossing 5K views this week.`,
    mistakesToAvoid: [
      "Posting student faces without parent consent",
      "Over-posting low-effort content (quality > quantity)",
      "Ignoring DMs / admission enquiries for more than 24h",
      "Using copyrighted music on YouTube long videos",
      "Inconsistent posting times — keep a fixed schedule",
    ],
  };
}
