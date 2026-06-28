import type { SocialAdapter, AccountMetrics, PlatformPost } from "./types";

// YouTube Data API adapter (mock).
// To connect for real: use the YouTube Data API v3 + Analytics API with OAuth.
export const youtubeAdapter: SocialAdapter = {
  platform: "youtube",
  isConnected() {
    return Boolean(process.env.YOUTUBE_API_KEY);
  },
  async getMetrics(): Promise<AccountMetrics> {
    return {
      platform: "youtube",
      followers: 540,
      reach: 12000,
      engagementRate: 3.4,
      views: 24800,
      likes: 980,
      comments: 64,
      shares: 120,
      saves: 0,
      watchTimeHours: 310,
    };
  },
  async getRecentPosts(): Promise<PlatformPost[]> {
    return [
      {
        id: "yt1",
        caption: "Inside Our School — Real School Day",
        permalink: "https://youtube.com/watch?v=mock1",
        likes: 540,
        comments: 42,
        views: 11200,
        postedAt: "2026-06-18",
      },
    ];
  },
};
