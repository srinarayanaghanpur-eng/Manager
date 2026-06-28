import type { SocialAdapter, AccountMetrics, PlatformPost } from "./types";

// Facebook Pages API adapter (mock).
// To connect for real: use the Facebook Graph API with a Page access token.
export const facebookAdapter: SocialAdapter = {
  platform: "facebook",
  isConnected() {
    return Boolean(process.env.FACEBOOK_PAGE_TOKEN);
  },
  async getMetrics(): Promise<AccountMetrics> {
    return {
      platform: "facebook",
      followers: 1280,
      reach: 5400,
      engagementRate: 4.1,
      views: 7200,
      likes: 640,
      comments: 54,
      shares: 180,
      saves: 0,
      watchTimeHours: 22,
    };
  },
  async getRecentPosts(): Promise<PlatformPost[]> {
    return [
      {
        id: "fb1",
        caption: "Parent must-know: study routine tips",
        permalink: "https://facebook.com/mock1",
        likes: 210,
        comments: 31,
        postedAt: "2026-06-21",
      },
    ];
  },
};
