// ---------------------------------------------------------------------------
// School Poster & Reel Studio generator (daily design tool).
// One input → poster text, Canva prompt, image-gen prompt, reel script,
// voiceover, captions, hashtags, plus festival-greeting & admissions modes.
// Mock by default; structure is ready to swap for a real AI provider.
// ---------------------------------------------------------------------------
import type { Language, Platform, Tone } from "@/lib/types";

export type DesignType = "poster" | "reel" | "festival" | "admissions";

export interface PosterReelInput {
  schoolName: string;
  branch: string;
  designType: DesignType;
  occasion: string; // topic, festival name, or campaign (e.g. "Admissions 2026")
  platform: Platform;
  language: Language;
  tone: Tone;
  brandPrimary: string;
  brandSecondary: string;
  contactNumber: string;
}

export interface ReelBeat {
  time: string;
  visual: string;
  text: string;
}

export interface PosterReelOutput {
  posterText: { headline: string; subtext: string; cta: string; cornerLabel: string };
  canvaPrompt: string;
  imagePrompt: string;
  reelScript: ReelBeat[];
  voiceover: string;
  captions: { short: string; premium: string; emotional: string };
  hashtags: string[];
  festivalGreeting?: string;
  admissionsContent?: { headline: string; points: string[]; cta: string };
  safetyNote: string;
}

function localize(language: Language, kind: "today" | "wishes" | "join") {
  if (language === "telugu") {
    return { today: "ఈ రోజు మా పాఠశాలలో", wishes: "శుభాకాంక్షలు", join: "మా పాఠశాలలో చేరండి" }[kind];
  }
  if (language === "hinglish") {
    return { today: "Aaj humare school mein", wishes: "Shubhkaamnaayein", join: "Humare school mein judein" }[kind];
  }
  return { today: "Today at our school", wishes: "Warm wishes", join: "Join our school family" }[kind];
}

export async function generatePosterReel(input: PosterReelInput): Promise<PosterReelOutput> {
  const { schoolName, branch, designType, occasion, language, tone } = input;
  const full = `${schoolName} (${branch})`;
  const occ = occasion || (designType === "admissions" ? "Admissions 2026" : designType === "festival" ? "Festival" : "Our School");

  // ---- Poster text -------------------------------------------------------
  const headlineByType: Record<DesignType, string> = {
    poster: occ.toUpperCase(),
    reel: occ,
    festival: `Happy ${occ}! 🪔`,
    admissions: "ADMISSIONS OPEN 2026",
  };
  const posterText = {
    headline: headlineByType[designType],
    subtext:
      designType === "admissions"
        ? "Limited seats · Quality education · Caring teachers"
        : designType === "festival"
        ? `${localize(language, "wishes")} from ${full}`
        : `${full} · where every child grows`,
    cta:
      designType === "admissions"
        ? `📞 Call ${input.contactNumber} to book a visit`
        : designType === "festival"
        ? "Follow us for daily school updates 💙"
        : "Visit us today!",
    cornerLabel: designType === "admissions" ? "2026 BATCH" : "★ " + branch,
  };

  // ---- Canva + image prompts --------------------------------------------
  const canvaPrompt = `Create a ${tone} ${designType === "admissions" ? "admissions" : designType} poster (1080×1080) for ${full}. Brand colors ${input.brandPrimary} (primary) and ${input.brandSecondary} (accent). Clean geometric layout, school logo top-left, headline "${posterText.headline}" in bold, subtext "${posterText.subtext}", and a CTA strip at the bottom with the phone number. Leave a clear photo area on the right. Modern, premium, trustworthy.`;
  const imagePrompt = `${tone}, photorealistic image for a ${designType} post by an Indian school (${branch}, Telangana). ${
    designType === "festival" ? `Warm ${occ} festive decorations on a clean campus, soft golden light.` : designType === "admissions" ? "Bright, welcoming school entrance with happy, hopeful mood." : "Clean modern classroom / campus, students learning, warm natural light."
  } No readable text in the image, leave negative space for overlay. No identifiable faces of minors unless consent is given.`;

  // ---- Reel script -------------------------------------------------------
  const intro = designType === "festival" ? `${posterText.headline}` : `${localize(language, "today")}…`;
  const reelScript: ReelBeat[] = [
    { time: "0-2s", visual: designType === "festival" ? "Decorated campus reveal" : "Hook shot — campus / activity", text: intro },
    { time: "2-7s", visual: "Detail shot (consented students only)", text: posterText.subtext },
    { time: "7-13s", visual: "Teacher / topic / festive moment", text: designType === "admissions" ? "Admissions open for 2026" : "Real learning, every day" },
    { time: "13-18s", visual: "Wide smiling group / values moment", text: posterText.cta },
    { time: "18-22s", visual: `Logo end card — ${full}`, text: designType === "festival" ? localize(language, "wishes")! : "Visit us today 📞" },
  ];

  // ---- Voiceover ---------------------------------------------------------
  const voiceover =
    designType === "festival"
      ? `${localize(language, "wishes")} from all of us at ${full}. May this ${occ} bring joy and success to your family.`
      : designType === "admissions"
      ? `Admissions for 2026 are now open at ${full}. Quality education, caring teachers, and a safe campus for your child. Call us today to book a visit.`
      : `${localize(language, "today")} we focus on what matters most — your child's growth. At ${full}, every day is a step forward.`;

  // ---- Captions ----------------------------------------------------------
  const captions = {
    short: `${posterText.headline} ✨ — ${full}`,
    premium: `${posterText.headline}\n${full}, where excellence is a daily habit. 🎓 ${posterText.cta}`,
    emotional: `Every child deserves a school that truly cares. ❤️ ${posterText.subtext} — ${full}.`,
  };

  // ---- Hashtags ----------------------------------------------------------
  const baseTags = ["#" + schoolName.replace(/\s+/g, ""), "#" + branch.replace(/\s+/g, ""), "#SchoolLife", "#Education", "#Telangana"];
  const typeTags: Record<DesignType, string[]> = {
    poster: ["#SchoolPoster", "#ProudStudents"],
    reel: ["#Reels", "#Trending", "#SchoolReels"],
    festival: ["#FestivalWishes", "#" + occ.replace(/\s+/g, ""), "#Celebration"],
    admissions: ["#Admissions2026", "#AdmissionsOpen", "#JoinUs", "#BookYourSeat"],
  };
  const hashtags = [...baseTags, ...typeTags[designType]];

  // ---- Conditional blocks ------------------------------------------------
  const festivalGreeting =
    designType === "festival"
      ? `🪔 ${posterText.headline}\n\n${localize(language, "wishes")} to all our students, parents and well-wishers from the entire family of ${full}. May this ${occ} fill your homes with happiness, health and success. 💙`
      : undefined;

  const admissionsContent =
    designType === "admissions"
      ? {
          headline: "Admissions Open for 2026–27",
          points: [
            "Experienced & caring teachers",
            "Safe, disciplined campus",
            "Strong academic results",
            "Activities, sports & values education",
            "Limited seats — enrol early",
          ],
          cta: `📞 Call ${input.contactNumber} or DM us to book a campus visit.`,
        }
      : undefined;

  return {
    posterText,
    canvaPrompt,
    imagePrompt,
    reelScript,
    voiceover,
    captions,
    hashtags,
    festivalGreeting,
    admissionsContent,
    safetyNote:
      "⚠️ Child safety: don't publish identifiable faces of minors without signed parent consent. Keep student names/locations private and moderate comments.",
  };
}
