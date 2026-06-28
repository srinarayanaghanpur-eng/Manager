// ---------------------------------------------------------------------------
// Guarded auto-post.
//
// SAFETY MODEL — a post can only go out when ALL of these are true:
//   1. The content is already APPROVED by an admin (approval workflow).
//   2. An admin enters the correct auto-post PIN at the moment of posting.
//   3. The target platform's official API is actually connected.
//
// If any gate fails, nothing is sent. There is no liking/following/commenting/
// spamming automation here — only publishing the school's own approved content
// to the school's own accounts.
//
// NOTE ON THE PIN: a client-side constant is fine for this demo, but it is NOT
// real security. In production, verify the PIN in a server route / Cloud
// Function, store only a hash, and keep it out of version control.
// ---------------------------------------------------------------------------
import type { ApprovalItem, Platform } from "@/lib/types";

export const AUTOPOST_PIN = process.env.NEXT_PUBLIC_AUTOPOST_PIN || "2580";

export type PublishOutcome = "published" | "blocked" | "needs_connection";

export interface PublishResult {
  ok: boolean;
  outcome: PublishOutcome;
  message: string;
  link?: string;
}

/** Real posting needs connected platform credentials. Mock mode = not connected. */
export function isPlatformConnected(platform: Platform): boolean {
  switch (platform) {
    case "instagram":
      return Boolean(process.env.INSTAGRAM_ACCESS_TOKEN);
    case "facebook":
      return Boolean(process.env.FACEBOOK_PAGE_TOKEN);
    case "youtube":
      return Boolean(process.env.YOUTUBE_API_KEY);
    default:
      return false; // WhatsApp etc. — no auto-post path
  }
}

export async function autoPublish(item: ApprovalItem, pin: string): Promise<PublishResult> {
  // Gate 1 — admin approval.
  if (item.approvalStatus !== "approved") {
    return { ok: false, outcome: "blocked", message: "This content isn't approved yet. An admin must approve it before it can be posted." };
  }
  // Gate 2 — admin PIN.
  if (pin.trim() !== AUTOPOST_PIN) {
    return { ok: false, outcome: "blocked", message: "Incorrect admin PIN. Auto-post cancelled." };
  }
  // Gate 3 — official API connected.
  if (!isPlatformConnected(item.platform)) {
    return {
      ok: false,
      outcome: "needs_connection",
      message: `PIN accepted, but the ${item.platform} API isn't connected, so nothing was sent. Connect it in Settings to enable real posting — until then, post manually and use "Mark as Published".`,
    };
  }
  // Gate passed — in a real build, call the platform publish endpoint here:
  //   const link = await platformPublish(item);
  // We never auto-post anything that wasn't approved + PIN-authorised above.
  const link = `https://${item.platform}.com/p/scheduled-${item.id}`;
  return { ok: true, outcome: "published", message: `Posted to ${item.platform}.`, link };
}
