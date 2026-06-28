import type { Platform } from "@/lib/types";

export type AccountTier = "established" | "growing";

export interface GrowthPlanInput {
  schoolName: string;
  branch: string;
  followers: number;
  targetFollowers: number;
  tier: AccountTier; // established (premium branding) | growing (fast follower growth)
  admissionCTA: string;
}

export interface DayPlan {
  day: string;
  idea: string;
  platform: Platform;
  type: string;
}

export interface GeneratedGrowthPlan {
  sevenDayPlan: DayPlan[];
  thirtyDayPlan: { week: string; theme: string; posts: string[] }[];
  dailyReelIdea: string;
  caption: string;
  hashtags: string[];
  voiceover: string;
  shotList: string[];
  bestPostingTime: string;
  growthTarget: string;
  admissionCTA: string;
}

const ESTABLISHED_DAYS: Omit<DayPlan, "platform">[] = [
  { day: "Mon", idea: "Premium campus highlight reel (cinematic b-roll)", type: "Reel" },
  { day: "Tue", idea: "Teacher spotlight — qualifications & care", type: "Short" },
  { day: "Wed", idea: "Parent trust story / testimonial", type: "Carousel" },
  { day: "Thu", idea: "Student achievement spotlight (consented)", type: "Reel" },
  { day: "Fri", idea: "Admissions 2026 — book a visit", type: "Reel" },
  { day: "Sat", idea: "School event recap (annual day / sports)", type: "Reel" },
  { day: "Sun", idea: "YouTube long-form: a real school day", type: "Long video" },
];

const GROWING_DAYS: Omit<DayPlan, "platform">[] = [
  { day: "Mon", idea: "Today at school — quick activity reel", type: "Reel" },
  { day: "Tue", idea: "Student confidence moment (trending audio)", type: "Reel" },
  { day: "Wed", idea: "Teacher tip in local language", type: "Reel" },
  { day: "Thu", idea: "Morning assembly / values moment", type: "Story" },
  { day: "Fri", idea: "Fun classroom activity reel", type: "Reel" },
  { day: "Sat", idea: "Parent-friendly post — daily routine tip", type: "Carousel" },
  { day: "Sun", idea: "Week highlights + admission reminder", type: "Reel" },
];

const platformCycle: Platform[] = ["instagram", "youtube", "facebook", "instagram", "instagram", "instagram", "youtube"];

export async function generateAccountGrowthPlan(
  input: GrowthPlanInput
): Promise<GeneratedGrowthPlan> {
  const established = input.tier === "established";
  const baseDays = established ? ESTABLISHED_DAYS : GROWING_DAYS;
  const sevenDayPlan: DayPlan[] = baseDays.map((d, i) => ({ ...d, platform: platformCycle[i] }));

  const thirtyDayPlan = established
    ? [
        { week: "Week 1", theme: "Premium branding", posts: ["Cinematic campus tour", "Teacher spotlight", "Admissions hero reel", "Parent testimonial", "YouTube Short: facilities"] },
        { week: "Week 2", theme: "Parent trust", posts: ["Safety & care explainer", "Results highlight", "Behind-the-scenes planning", "Values reel", "Q&A with principal"] },
        { week: "Week 3", theme: "Student achievements", posts: ["Topper spotlight", "Sports win recap", "Skill showcase", "Achiever wall carousel", "YouTube: student interview"] },
        { week: "Week 4", theme: "Admissions push", posts: ["5 reasons to join", "Limited seats countdown", "Campus visit invite", "Fee/scholarship clarity", "Admissions testimonial"] },
      ]
    : [
        { week: "Week 1", theme: "Show up daily", posts: ["Today-at-school reel x3", "Teacher tip", "Assembly moment", "Activity reel", "Week recap"] },
        { week: "Week 2", theme: "Local reach", posts: ["Trending audio reel x3", "Student confidence clip", "Parent-friendly tip", "Festival/values post", "Neighbourhood shoutout"] },
        { week: "Week 3", theme: "Awareness & fun", posts: ["Classroom fun reel x3", "Teacher vs student challenge", "Behind the scenes", "Mini school tour", "Admission reminder"] },
        { week: "Week 4", theme: "Convert interest", posts: ["Why our school reel", "Daily routine carousel", "Admission DM CTA x2", "Happy parent clip", "Month highlights"] },
      ];

  const reelIdea = established
    ? "Cinematic 20s reel: slow-motion campus b-roll → student learning → teacher close-up → logo + 'Admissions Open' end card."
    : "Fast 15s reel on trending audio: snap transition from empty classroom to a fun live activity, ending on 'DM for admissions'.";

  const caption = established
    ? `Excellence is a habit, not an event. ✨ At ${input.schoolName} (${input.branch}), every day builds your child's future. 🎓 ${input.admissionCTA}`
    : `Another happy day at ${input.schoolName} (${input.branch})! 💙 Real learning, real fun, every single day. ${input.admissionCTA}`;

  const hashtags = established
    ? ["#SriNarayanaHighSchool", "#PremiumEducation", "#Admissions2026", "#Ghanpur", "#FutureLeaders", "#SchoolReels", "#ParentTrust"]
    : ["#SriAdarshavani", "#Duggondi", "#SchoolLife", "#DailyReels", "#LocalSchool", "#Admissions2026", "#StudentLife", "#Telangana"];

  const voiceover = established
    ? `At ${input.schoolName}, your child learns with confidence and care. Premium facilities, dedicated teachers, proven results. Admissions are now open — visit us today.`
    : `Every day at ${input.schoolName} is full of learning and fun. Friendly teachers, happy students, a school your family can trust. Message us for admissions!`;

  const shotList = established
    ? ["Drone/wide establishing shot of campus", "Gimbal walk through a bright corridor", "Close-up of hands-on learning", "Teacher guiding a student (eye level)", "Logo + CTA end card"]
    : ["Phone handheld entry into classroom", "Quick cuts of students doing an activity", "Smiling reaction shot (consented)", "Teacher giving a thumbs up", "Text card: 'DM for admissions'"];

  return {
    sevenDayPlan,
    thirtyDayPlan,
    dailyReelIdea: reelIdea,
    caption,
    hashtags,
    voiceover,
    shotList,
    bestPostingTime: established ? "6–8 PM (peak parent activity)" : "7–9 AM & 6–8 PM (twice daily)",
    growthTarget: `Grow from ${input.followers.toLocaleString("en-IN")} to ${input.targetFollowers.toLocaleString("en-IN")} followers. ${established ? "Aim +800/month with 4–5 quality reels/week." : "Aim +250/month with daily reels and consistent posting."}`,
    admissionCTA: input.admissionCTA,
  };
}
