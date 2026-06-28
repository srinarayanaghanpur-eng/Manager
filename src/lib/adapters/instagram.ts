import type { SocialAdapter, AccountMetrics, PlatformPost } from "./types";

// Instagram Graph API adapter (mock).
// To connect for real: use the Instagram Graph API with a long-lived token
// (INSTAGRAM_ACCESS_TOKEN) and an IG Business account linked to a Facebook Page.
export const instagramAdapter: SocialAdapter = {
  platform: "instagram",
  isConnected() {
    return Boolean(process.env.INSTAGRAM_ACCESS_TOKEN);
  },
  async getMetrics(handle: string): Promise<AccountMetrics> {
    return {
      platform: "instagram",
      followers: 2050,
      reach: 9800,
      engagementRate: 6.2,
      views: 14200,
      likes: 1340,
      comments: 96,
      shares: 210,
      saves: 320,
      watchTimeHours: 48,
    };
  },
  async getRecentPosts(): Promise<PlatformPost[]> {
    return [
      {
        id: "ig1",
        caption: "Admissions Open 2026 🎓",
        permalink: "https://instagram.com/p/mock1",
        likes: 412,
        comments: 28,
        views: 5200,
        postedAt: "2026-06-22",
      },
      {
        id: "ig2",
        caption: "A Day at School (campus tour)",
        permalink: "https://instagram.com/p/mock2",
        likes: 388,
        comments: 19,
        views: 6100,
        postedAt: "2026-06-25",
      },
    ];
  },
};
