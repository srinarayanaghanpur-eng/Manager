import type { Platform } from "@/lib/types";

export type CaptionStyle =
  | "short"
  | "medium"
  | "premium"
  | "emotional"
  | "telugu"
  | "hinglish";

export interface CaptionInput {
  topic: string;
  schoolName: string;
  platform: Platform;
  style: CaptionStyle;
}

export interface GeneratedCaption {
  caption: string;
  hashtagGroups: {
    local: string[];
    school: string[];
    education: string[];
    admission: string[];
    event: string[];
  };
}

export async function generateCaption(
  input: CaptionInput
): Promise<GeneratedCaption> {
  const { topic, schoolName, style } = input;
  const tagName = "#" + schoolName.replace(/\s+/g, "");

  const captions: Record<CaptionStyle, string> = {
    short: `${topic} at ${schoolName} ✨`,
    medium: `${topic} 💙 At ${schoolName}, we make every day count for your child. Admissions open now.`,
    premium: `Excellence isn't an event — it's a habit. ✨\n${topic} at ${schoolName}, where every child is nurtured to lead. 🎓`,
    emotional: `Every smile in our classrooms is a promise kept to a parent. ❤️\n${topic} — this is why we do what we do at ${schoolName}.`,
    telugu: `${topic} 💙\nమా ${schoolName} లో మీ పిల్లల భవిష్యత్తు మా బాధ్యత. ప్రవేశాలు ప్రారంభమయ్యాయి! 🎓`,
    hinglish: `${topic} 💙\n${schoolName} mein har bachche ka future humari zimmedari hai. Admissions open hain! 🎓`,
  };

  return {
    caption: captions[style],
    hashtagGroups: {
      local: ["#Ghanpur", "#Duggondi", "#Warangal", "#Telangana", "#TelanganaSchools"],
      school: [tagName, "#SchoolLife", "#OurSchoolFamily", "#ProudStudents"],
      education: ["#Education", "#Learning", "#FutureLeaders", "#StudentSuccess"],
      admission: ["#Admissions2026", "#AdmissionsOpen", "#JoinUs", "#BookYourSeat"],
      event: ["#SchoolEvents", "#Celebration", "#Memories", "#Highlights"],
    },
  };
}
