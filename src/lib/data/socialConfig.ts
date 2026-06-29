// ---------------------------------------------------------------------------
// Single source of truth for the schools' REAL social accounts.
//
// Handles/usernames live here (not hardcoded across the UI). Secrets (API keys
// and access tokens) are NEVER stored here — they are read from server-side
// environment variables inside the adapters, so they never reach the browser.
// ---------------------------------------------------------------------------
import { SCHOOL_A, SCHOOL_B } from "./seed";

export interface SchoolSocialConfig {
  schoolId: string;
  youtube?: {
    /** Channel handle without the leading @ (used with the Data API forHandle). */
    handle: string;
    url: string;
  };
  instagram?: {
    username: string;
    url: string;
    /**
     * Env var that holds this account's Instagram BUSINESS account id.
     * Instagram has no public username→id lookup, so this must be provided
     * once you complete the Meta Graph API setup (see SOCIAL_SETUP.md).
     */
    igUserIdEnv: string;
  };
}

export const socialConfig: SchoolSocialConfig[] = [
  {
    schoolId: SCHOOL_A, // Sri Narayana High School — Ghanpur
    instagram: {
      username: "sri_narayana_high_school",
      url: "https://www.instagram.com/sri_narayana_high_school/",
      igUserIdEnv: "INSTAGRAM_IG_USER_ID_NARAYANA",
    },
    // No public YouTube channel provided for this school yet.
  },
  {
    schoolId: SCHOOL_B, // Sri Adarshavani High School — Duggondi
    youtube: {
      handle: "sriadarshavanihighschooldu7480",
      url: "https://www.youtube.com/@sriadarshavanihighschooldu7480",
    },
    instagram: {
      username: "sri_adarshavani",
      url: "https://www.instagram.com/sri_adarshavani/",
      igUserIdEnv: "INSTAGRAM_IG_USER_ID_ADARSHAVANI",
    },
  },
];

export function getSocialConfig(schoolId: string): SchoolSocialConfig | undefined {
  return socialConfig.find((c) => c.schoolId === schoolId);
}
