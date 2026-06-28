// Common shape every social platform adapter returns. Swap the mock
// implementations for real API calls without touching the UI.
import type { Platform } from "@/lib/types";

export interface AccountMetrics {
  platform: Platform;
  followers: number;
  reach: number;
  engagementRate: number; // %
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  watchTimeHours: number;
}

export interface PlatformPost {
  id: string;
  caption: string;
  permalink: string;
  likes: number;
  comments: number;
  views?: number;
  postedAt: string;
}

export interface SocialAdapter {
  platform: Platform;
  /** Returns false in mock mode — real adapters check OAuth tokens. */
  isConnected(): boolean;
  getMetrics(handle: string): Promise<AccountMetrics>;
  getRecentPosts(handle: string): Promise<PlatformPost[]>;
  // NOTE: publish() intentionally NOT implemented. This app never auto-posts.
  // Publishing must always be a manual, admin-approved action.
}
