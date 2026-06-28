import type { ContentGoal, ContentType, Language, Platform, Tone } from "@/lib/types";

export interface ContentIdeaInput {
  schoolName: string;
  platform: Platform;
  contentType: ContentType;
  goal: ContentGoal;
  language: Language;
  tone: Tone;
}

export interface GeneratedContentIdea {
  ideas: string[];
  reelScript: string;
  voiceover: string;
  caption: string;
  hashtags: string[];
  thumbnailText: string;
  shotList: string[];
  canvaPosterPrompt: string;
  videoGenPrompt: string;
  cta: string;
  safetyNotes: string;
}

const goalAngles: Record<ContentGoal, string[]> = {
  admissions: [
    "Admissions open 2026 — limited seats announcement",
    "A day in the life of a student at {school}",
    "5 reasons parents choose {school}",
    "Campus walkthrough reel",
    "Meet our teachers — qualifications spotlight",
  ],
  trust: [
    "How we keep your child safe at {school}",
    "Parent testimonial of the week",
    "Behind the scenes: how we plan each class",
    "Our discipline and values explained",
    "Transparent results — board exam highlights",
  ],
  viral_reach: [
    "Trending audio + classroom transition reel",
    "Students recreate a popular trend (school-safe)",
    "Teacher vs student challenge",
    "Before/after study glow-up",
    "Guess the subject from the emoji",
  ],
  parent_education: [
    "3 ways to help your child study at home",
    "Screen time tips for school kids",
    "How to build a morning routine",
    "Nutrition for exam season",
    "Talking to your child about marks",
  ],
  event_coverage: [
    "Annual day highlights reel",
    "Sports day best moments",
    "Independence Day celebration",
    "Science exhibition tour",
    "Festival celebration at {school}",
  ],
  brand_building: [
    "Our school story in 30 seconds",
    "Why our logo means what it means",
    "Founders' vision reel",
    "Campus aesthetic b-roll",
    "Year in review montage",
  ],
};

export async function generateContentIdea(
  input: ContentIdeaInput
): Promise<GeneratedContentIdea> {
  const base = goalAngles[input.goal].map((s) =>
    s.replace("{school}", input.schoolName)
  );
  const extra = [
    `${input.contentType} idea: student achievement spotlight`,
    `${input.contentType} idea: classroom activity of the week`,
    `${input.contentType} idea: quick exam tip from a teacher`,
    `${input.contentType} idea: morning assembly moment`,
    `${input.contentType} idea: festival greeting from ${input.schoolName}`,
  ];
  const ideas = [...base, ...extra].slice(0, 10);

  const langTag =
    input.language === "telugu"
      ? "ఈ రోజు మా పాఠశాలలో"
      : input.language === "hinglish"
      ? "Aaj humare school mein"
      : "Today at our school";

  return {
    ideas,
    reelScript: `HOOK (0-2s): "${langTag}..."\nSCENE 1 (2-6s): Wide shot of campus / classroom.\nSCENE 2 (6-12s): Close-up of the activity, students engaged (faces blurred unless consent given).\nSCENE 3 (12-18s): Teacher or topic highlight.\nCLOSE (18-22s): Logo + CTA card.`,
    voiceover: `${langTag} we focus on what matters most — your child's growth. At ${input.schoolName}, every day is a step forward. Admissions are open. Visit us today.`,
    caption: `${input.schoolName} | ${input.goal.replace("_", " ")} ✨\nWhere learning meets care. ${langTag} 💙`,
    hashtags: [
      "#" + input.schoolName.replace(/\s+/g, ""),
      "#SchoolLife",
      "#Admissions2026",
      "#Education",
      "#ProudParents",
      "#Telangana",
    ],
    thumbnailText: input.goal === "admissions" ? "ADMISSIONS OPEN" : "WATCH THIS",
    shotList: [
      "Establishing wide shot of school entrance",
      "Tracking shot down a corridor",
      "Close-up of activity / hands-on learning",
      "Reaction shot (consented students only)",
      "Logo + CTA end card",
    ],
    canvaPosterPrompt: `Premium school poster for ${input.schoolName}, ${input.tone} tone, brand blue & white, clean geometric layout, headline "${input.goal === "admissions" ? "Admissions Open 2026" : "Join Our Family"}", space for logo top-left and contact number bottom.`,
    videoGenPrompt: `A ${input.tone}, ${input.language} ${input.contentType} for ${input.schoolName}. Bright, hopeful, cinematic b-roll of a clean Indian school campus, warm lighting, students learning, ends on logo card. No identifiable minors unless consent.`,
    cta: input.goal === "admissions"
      ? "📞 Call now to book a campus visit!"
      : "Follow for daily updates from our school 💙",
    safetyNotes:
      "⚠️ Child safety: Do not show identifiable faces of minors without signed parent consent. Avoid sharing student full names, class timings, or location pins. Keep comments moderated.",
  };
}
