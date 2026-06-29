import type { AccountMetrics, PlatformPost, SocialFetchResult } from "./types";

// ---------------------------------------------------------------------------
// YouTube Data API v3 adapter.
//
// Public channel stats (subscribers, views, video count) and recent public
// uploads need ONLY a free API key (process.env.YOUTUBE_API_KEY) — no OAuth.
// Without the key it returns demo data so the app keeps working.
//
// Note: watch-time hours are NOT available from the public Data API (they need
// the YouTube Analytics API + channel-owner OAuth), so that field stays 0.
// ---------------------------------------------------------------------------

const API = "https://www.googleapis.com/youtube/v3";

export function isYouTubeConnected(): boolean {
  return Boolean(process.env.YOUTUBE_API_KEY);
}

const demoMetrics: AccountMetrics = {
  platform: "youtube",
  followers: 140,
  reach: 5100,
  engagementRate: 2.9,
  views: 5100,
  likes: 380,
  comments: 47,
  shares: 60,
  saves: 0,
  watchTimeHours: 60,
};

const demoPosts: PlatformPost[] = [
  {
    id: "yt_demo1",
    caption: "Admissions Open 2026 — Apply Now",
    permalink: "https://www.youtube.com/@sriadarshavanihighschooldu7480",
    likes: 98,
    comments: 21,
    views: 1560,
    postedAt: "2026-06-15",
  },
];

interface YTChannelStats {
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  uploadsPlaylistId: string;
  title: string;
}

async function fetchJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 600 } });
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.error?.message || `YouTube API error (${res.status})`;
    throw new Error(msg);
  }
  return json;
}

async function getChannelByHandle(handle: string, key: string): Promise<YTChannelStats> {
  const clean = handle.replace(/^@/, "");
  const url = `${API}/channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(clean)}&key=${key}`;
  const json = await fetchJson(url);
  const item = json.items?.[0];
  if (!item) throw new Error(`No YouTube channel found for @${clean}`);
  return {
    subscriberCount: Number(item.statistics?.subscriberCount ?? 0),
    viewCount: Number(item.statistics?.viewCount ?? 0),
    videoCount: Number(item.statistics?.videoCount ?? 0),
    uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads ?? "",
    title: item.snippet?.title ?? clean,
  };
}

async function getRecentUploads(playlistId: string, key: string): Promise<PlatformPost[]> {
  if (!playlistId) return [];
  const listUrl = `${API}/playlistItems?part=contentDetails&maxResults=6&playlistId=${playlistId}&key=${key}`;
  const list = await fetchJson(listUrl);
  const ids: string[] = (list.items ?? [])
    .map((i: { contentDetails?: { videoId?: string } }) => i.contentDetails?.videoId)
    .filter(Boolean);
  if (ids.length === 0) return [];

  const vidUrl = `${API}/videos?part=snippet,statistics&id=${ids.join(",")}&key=${key}`;
  const vids = await fetchJson(vidUrl);
  return (vids.items ?? []).map(
    (v: {
      id: string;
      snippet?: { title?: string; publishedAt?: string };
      statistics?: { likeCount?: string; commentCount?: string; viewCount?: string };
    }): PlatformPost => ({
      id: v.id,
      caption: v.snippet?.title ?? "(untitled)",
      permalink: `https://www.youtube.com/watch?v=${v.id}`,
      likes: Number(v.statistics?.likeCount ?? 0),
      comments: Number(v.statistics?.commentCount ?? 0),
      views: Number(v.statistics?.viewCount ?? 0),
      postedAt: (v.snippet?.publishedAt ?? "").slice(0, 10),
    })
  );
}

/** Fetch live YouTube stats for a channel handle, falling back to demo data. */
export async function fetchYouTube(handle: string | undefined): Promise<SocialFetchResult> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key || !handle) {
    return { platform: "youtube", connected: false, source: "demo", metrics: demoMetrics, posts: demoPosts };
  }
  try {
    const ch = await getChannelByHandle(handle, key);
    const posts = await getRecentUploads(ch.uploadsPlaylistId, key);
    const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
    const totalComments = posts.reduce((s, p) => s + p.comments, 0);
    const recentViews = posts.reduce((s, p) => s + (p.views ?? 0), 0);
    const engagementRate = recentViews > 0
      ? Number((((totalLikes + totalComments) / recentViews) * 100).toFixed(1))
      : 0;
    const metrics: AccountMetrics = {
      platform: "youtube",
      followers: ch.subscriberCount,
      reach: recentViews,
      engagementRate,
      views: ch.viewCount,
      likes: totalLikes,
      comments: totalComments,
      shares: 0,
      saves: 0,
      watchTimeHours: 0, // not available via the public Data API
    };
    return { platform: "youtube", connected: true, source: "live", metrics, posts };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown YouTube API error";
    return { platform: "youtube", connected: false, source: "demo", metrics: demoMetrics, posts: demoPosts, error };
  }
}
