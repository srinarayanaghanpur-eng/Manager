// AI sponsor pitch generator (mock).
// Produces a ready-to-send outreach message to a local business inviting them
// to sponsor a school event or video series.

export interface SponsorPitchInput {
  schoolName: string;
  businessName: string;
  businessType: string;
  eventOrVideo: string; // e.g. "Annual Day", "Campus tour video series"
  package: string; // e.g. "Banner + 2 reel shoutouts"
  audience: string; // e.g. "2,500+ local parents on Instagram & Facebook"
}

export interface GeneratedSponsorPitch {
  whatsappPitch: string;
  emailPitch: string;
  callOpening: string;
  packageOptions: { tier: string; price: string; includes: string }[];
}

export async function generateSponsorPitch(
  input: SponsorPitchInput
): Promise<GeneratedSponsorPitch> {
  const biz = input.businessName || "your business";
  const event = input.eventOrVideo || "our upcoming school event";

  return {
    whatsappPitch: `Namaste 🙏\nThis is ${input.schoolName}. We're organising ${event} and reaching ${input.audience}. We'd love to partner with ${biz} as a sponsor.\n\nYour ${input.businessType} brand would be featured via: ${input.package}.\n\nIt's a great way to reach local families. Can I share a short sponsorship plan with you? 💙`,
    emailPitch: `Subject: Sponsorship opportunity with ${input.schoolName} — ${event}\n\nDear ${biz} team,\n\nWe are ${input.schoolName}, and we're preparing ${event}. Our social media reaches ${input.audience}, made up mostly of local parents and families.\n\nWe'd like to invite ${biz} to partner with us. As a ${input.businessType}, you'd get visibility with exactly the local audience you serve. Our sponsorship includes: ${input.package}.\n\nWe keep all content school-appropriate and brand-safe. I'd be glad to share a one-page plan and pricing options at a time that suits you.\n\nWarm regards,\n${input.schoolName} — Social Media Team`,
    callOpening: `"Hello, this is ${input.schoolName}. We're hosting ${event} and partnering with a few trusted local businesses like ${biz}. We reach ${input.audience} — would you be open to a quick chat about a simple sponsorship package?"`,
    packageOptions: [
      { tier: "Bronze", price: "₹5,000", includes: "Logo on event banner + 1 tagged story" },
      { tier: "Silver", price: "₹10,000", includes: "Banner + 1 reel shoutout + tagged post" },
      { tier: "Gold", price: "₹20,000", includes: "Title sponsor + 2 reels + logo on all event content" },
    ],
  };
}
