import { NextResponse } from "next/server";
import { fetchYouTube } from "@/lib/adapters/youtube";
import { fetchInstagram } from "@/lib/adapters/instagram";
import { getSocialConfig } from "@/lib/data/socialConfig";
import type { SocialFetchResult } from "@/lib/adapters/types";

// GET /api/social?schoolId=...&platform=youtube|instagram
// Returns live metrics + recent posts when the relevant API key/token is set,
// otherwise demo data with source: "demo". Secrets never leave the server.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const schoolId = searchParams.get("schoolId") ?? "";
  const platform = searchParams.get("platform") ?? "";

  const cfg = getSocialConfig(schoolId);

  let result: SocialFetchResult;
  switch (platform) {
    case "youtube":
      result = await fetchYouTube(cfg?.youtube?.handle);
      break;
    case "instagram":
      result = await fetchInstagram(
        cfg?.instagram ? process.env[cfg.instagram.igUserIdEnv] : undefined
      );
      break;
    default:
      return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
  }

  return NextResponse.json(result);
}
