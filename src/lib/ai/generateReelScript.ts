import type { Platform } from "@/lib/types";

export type ReelDuration = 10 | 20 | 30 | 60;

export interface ReelScriptInput {
  category: string;
  schoolName: string;
  duration: ReelDuration;
  platform: Platform;
}

export interface ReelScene {
  time: string;
  visual: string;
  textOverlay: string;
  camera: string;
}

export interface GeneratedReelScript {
  duration: ReelDuration;
  scenes: ReelScene[];
  voiceover: string;
  music: string;
  cta: string;
}

const reelCategories = [
  "Today at school",
  "Parent must know",
  "Student confidence",
  "Teacher tip",
  "Admissions open",
  "School tour",
  "Morning assembly",
  "Classroom activity",
  "Festival greetings",
  "Exam motivation",
];

export { reelCategories };

export async function generateReelScript(
  input: ReelScriptInput
): Promise<GeneratedReelScript> {
  const { duration, category, schoolName } = input;
  const beats = Math.max(3, Math.round(duration / 6));
  const scenes: ReelScene[] = Array.from({ length: beats }).map((_, i) => {
    const start = Math.round((duration / beats) * i);
    const end = Math.round((duration / beats) * (i + 1));
    const map = [
      {
        visual: `Hook shot — ${category} moment at ${schoolName}`,
        textOverlay: i === 0 ? category.toUpperCase() : "",
        camera: "Handheld, quick push-in",
      },
      {
        visual: "Activity / detail close-up (consented students only)",
        textOverlay: "Real learning, every day",
        camera: "Slow pan, shallow depth",
      },
      {
        visual: "Teacher or topic highlight",
        textOverlay: "Guided by caring teachers",
        camera: "Tripod, eye level",
      },
      {
        visual: "Wide campus / smiling group",
        textOverlay: "Admissions open",
        camera: "Gimbal, slow reveal",
      },
      {
        visual: `Logo end card — ${schoolName}`,
        textOverlay: "Visit us today 📞",
        camera: "Static, centered",
      },
    ];
    const m = map[Math.min(i, map.length - 1)];
    return { time: `${start}-${end}s`, ...m };
  });

  return {
    duration,
    scenes,
    voiceover: `${category} at ${schoolName}. This is where your child grows with confidence and care. Admissions are now open — come see for yourself.`,
    music: duration <= 20 ? "Upbeat trending audio (low volume under VO)" : "Warm inspirational instrumental",
    cta: "Save this & share with a parent who needs to see it 💙",
  };
}
