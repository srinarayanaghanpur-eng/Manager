import type { AccountMetrics, PlatformPost, SocialFetchResult } from "./types";

// ---------------------------------------------------------------------------
// Instagram Graph API adapter.
//
// Instagram does NOT allow reading an account from its public URL. Live data
// requires the full Meta setup (see SOCIAL_SETUP.md):
//   • a Professional (Business/Creator) Instagram account
//   • linked to a Facebook Page
//   • a Meta app + a long-lived access token  → INSTAGRAM_ACCESS_TOKEN
//   • the IG Business account id              → per-school env var
//
// Until those are provided, this returns demo data and reports connected:false.
// The live code path below is ready and will activate automatically once the
// token + id are present.
// ---------------------------------------------------------------------------

const API = "https://graph.facebook.com/v21.0";

export function isInstagramConnected(): boolean {
  return Boolean(process.env.INSTAGRAM_ACCESS_TOKEN);
}

const demoMetrics: AccountMetrics = {
  platform: "instagram",
  followers: 500,
  reach: 4200,
  engagementRate: 6.2,
  views: 8100,
  likes: 640,
  comments: 48,
  shares: 90,
  saves: 130,
  watchTimeHours: 22,
};

const demoPosts: PlatformPost[] = [
  {
    id: "ig_demo1",
    caption: "Admissions Open 2026 🎓",
    permalink: "https://www.instagram.com/sri_adarshavani/",
    likes: 210,
    comments: 18,
    views: 3200,
    postedAt: "2026-06-22",
  },
];

async function fetchJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 600 } });
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.error?.message || `Instagram API error (${res.status})`;
    throw new Error(msg);
  }
  return json;
}

/**
 * Fetch live Instagram stats for a school's IG Business account.
 * @param igUserId the IG Business account id (resolved from the per-school env var)
 */
export async function fetchInstagram(igUserId: string | undefined): Promise<SocialFetchResult> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token || !igUserId) {
    return { platform: "instagram", connected: false, source: "demo", metrics: demoMetrics, posts: demoPosts };
  }
  try {
    const profileUrl = `${API}/${igUserId}?fields=followers_count,media_count&access_token=${token}`;
    const profile = await fetchJson(profileUrl);

    const mediaUrl = `${API}/${igUserId}/media?fields=caption,permalink,like_count,comments_count,timestamp&limit=6&access_token=${token}`;
    const media = await fetchJson(mediaUrl);
    const posts: PlatformPost[] = (media.data ?? []).map(
      (m: {
        id: string;
        caption?: string;
        permalink?: string;
        like_count?: number;
        comments_count?: number;
        timestamp?: string;
      }): PlatformPost => ({
        id: m.id,
        caption: m.caption ?? "(no caption)",
        permalink: m.permalink ?? "",
        likes: m.like_count ?? 0,
        comments: m.comments_count ?? 0,
        postedAt: (m.timestamp ?? "").slice(0, 10),
      })
    );

    const followers = Number(profile.followers_count ?? 0);
    const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
    const totalComments = posts.reduce((s, p) => s + p.comments, 0);
    const engagementRate = followers > 0 && posts.length > 0
      ? Number(((((totalLikes + totalComments) / posts.length) / followers) * 100).toFixed(1))
      : 0;

    const metrics: AccountMetrics = {
      platform: "instagram",
      followers,
      reach: 0, // reach/impressions need the insights endpoint + permissions
      engagementRate,
      views: 0,
      likes: totalLikes,
      comments: totalComments,
      shares: 0,
      saves: 0,
      watchTimeHours: 0,
    };
    return { platform: "instagram", connected: true, source: "live", metrics, posts };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown Instagram API error";
    return { platform: "instagram", connected: false, source: "demo", metrics: demoMetrics, posts: demoPosts, error };
  }
}
