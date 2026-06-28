import type { ContentIdea, Platform } from "@/lib/types";
import { nowISO, uid } from "@/lib/utils";

export type TrendCategory =
  | "admissions"
  | "classroom"
  | "parent_trust"
  | "achievements"
  | "events"
  | "festivals"
  | "national_days"
  | "exam_tips"
  | "parent_education"
  | "reels_trends"
  | "shorts_style"
  | "facebook_parents";

export interface TrendIdea {
  id: string;
  title: string;
  whyItWorks: string;
  videoIdea: string;
  hook: string;
  caption: string;
  hashtags: string[];
  bestPlatform: Platform;
  difficulty: "easy" | "medium" | "hard";
  reachScore: number;
  needsStudentFace: boolean;
  category: TrendCategory;
}

const seedTrends: Omit<TrendIdea, "id">[] = [
  {
    title: "Admissions Open — 'Last 20 Seats' countdown",
    whyItWorks: "Scarcity + clear CTA drives parent enquiries fast.",
    videoIdea: "Animated counter over campus b-roll, ending on contact card.",
    hook: "Only a few seats left for 2026 — is your child's name on the list?",
    caption: "Admissions are closing soon. Book a visit today! 🎓",
    hashtags: ["#Admissions2026", "#SeatsFillingFast", "#JoinUs"],
    bestPlatform: "instagram",
    difficulty: "easy",
    reachScore: 82,
    needsStudentFace: false,
    category: "admissions",
  },
  {
    title: "A Day in 60 Seconds — Campus Tour",
    whyItWorks: "Builds trust by showing real, clean facilities to parents.",
    videoIdea: "Fast-cut gimbal walkthrough: gate → classrooms → lab → playground.",
    hook: "Ever wondered what a full school day looks like?",
    caption: "Step inside our world 💙 #SchoolTour",
    hashtags: ["#SchoolTour", "#CampusLife", "#OurSchool"],
    bestPlatform: "youtube",
    difficulty: "medium",
    reachScore: 75,
    needsStudentFace: false,
    category: "classroom",
  },
  {
    title: "Parent Must-Know: Study Routine Tips",
    whyItWorks: "Educational value = high saves and shares among parents.",
    videoIdea: "Teacher to camera, 3 quick tips with text overlays.",
    hook: "3 things that helped our toppers study smarter 📚",
    caption: "Save this for your child's exam prep! ✨",
    hashtags: ["#ParentTips", "#StudySmart", "#ExamPrep"],
    bestPlatform: "facebook",
    difficulty: "easy",
    reachScore: 68,
    needsStudentFace: false,
    category: "parent_education",
  },
  {
    title: "Student Achievement Spotlight",
    whyItWorks: "Celebrating success builds pride and word-of-mouth referrals.",
    videoIdea: "Photo montage with achievement text (consent required).",
    hook: "Proud moment alert! 🏆",
    caption: "Celebrating our shining stars 🌟",
    hashtags: ["#ProudMoment", "#StudentSuccess", "#Achievers"],
    bestPlatform: "instagram",
    difficulty: "easy",
    reachScore: 71,
    needsStudentFace: true,
    category: "achievements",
  },
  {
    title: "National Day Salute Reel",
    whyItWorks: "Timely, patriotic content gets strong organic reach.",
    videoIdea: "Assembly flag moment + tricolor overlay, inspirational VO.",
    hook: "This is how we honour our nation 🇮🇳",
    caption: "Proud, grateful, together. Happy Independence Day!",
    hashtags: ["#IndependenceDay", "#ProudIndian", "#SchoolPride"],
    bestPlatform: "instagram",
    difficulty: "medium",
    reachScore: 79,
    needsStudentFace: false,
    category: "national_days",
  },
  {
    title: "Festival Greetings from Our Family",
    whyItWorks: "Festival posts are highly shareable in local parent groups.",
    videoIdea: "Decorated campus b-roll + warm greeting text in Telugu & English.",
    hook: "Wishing your family joy this festive season 🪔",
    caption: "Happy festival from all of us! 💛",
    hashtags: ["#FestivalWishes", "#SchoolFamily", "#Celebration"],
    bestPlatform: "facebook",
    difficulty: "easy",
    reachScore: 66,
    needsStudentFace: false,
    category: "festivals",
  },
  {
    title: "Exam Motivation — 15s Pep Talk",
    whyItWorks: "Short, emotional, relatable during exam season.",
    videoIdea: "Teacher delivering a calm motivational line to camera.",
    hook: "Dear students, take a deep breath… you've got this.",
    caption: "You're more prepared than you think 💪 #ExamMotivation",
    hashtags: ["#ExamMotivation", "#YouGotThis", "#BoardExams"],
    bestPlatform: "youtube",
    difficulty: "easy",
    reachScore: 64,
    needsStudentFace: false,
    category: "exam_tips",
  },
  {
    title: "Trending Audio Classroom Transition",
    whyItWorks: "Riding a trend boosts discovery on Reels/Shorts.",
    videoIdea: "Snap transition from empty class to full activity on the beat.",
    hook: "Wait for the transition… 👀",
    caption: "POV: learning is actually fun here 😄",
    hashtags: ["#Trending", "#ClassroomVibes", "#Reels"],
    bestPlatform: "instagram",
    difficulty: "medium",
    reachScore: 73,
    needsStudentFace: false,
    category: "reels_trends",
  },
];

export async function generateTrendIdeas(
  category?: TrendCategory
): Promise<TrendIdea[]> {
  const list = category
    ? seedTrends.filter((t) => t.category === category)
    : seedTrends;
  const source = list.length ? list : seedTrends;
  return source.map((t) => ({ ...t, id: uid("trend") }));
}

export function trendToContentIdea(
  t: TrendIdea,
  schoolId: string,
  createdBy: string
): ContentIdea {
  return {
    id: uid("idea"),
    createdAt: nowISO(),
    updatedAt: nowISO(),
    createdBy,
    schoolId,
    title: t.title,
    hook: t.hook,
    caption: t.caption,
    hashtags: t.hashtags,
    bestPlatform: t.bestPlatform,
    difficulty: t.difficulty,
    reachScore: t.reachScore,
    needsStudentFace: t.needsStudentFace,
    goal: "viral_reach",
    whyItWorks: t.whyItWorks,
    videoIdea: t.videoIdea,
    status: "idea",
  };
}
