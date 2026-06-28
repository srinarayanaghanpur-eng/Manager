import type { Lead } from "@/lib/types";

export interface GeneratedLeadFollowup {
  whatsappMessage: string;
  callScript: string;
  admissionReminder: string;
  parentTrustMessage: string;
}

export async function generateLeadFollowup(
  lead: Lead,
  schoolName: string
): Promise<GeneratedLeadFollowup> {
  const child = lead.studentName || "your child";
  return {
    whatsappMessage: `Namaste ${lead.parentName} 🙏\nThank you for your interest in ${schoolName} for ${child} (${lead.classInterested}). We'd love to welcome you for a campus visit. When would be a good time this week? — ${schoolName} Admissions`,
    callScript: `1. Greet: "Hello ${lead.parentName}, this is ${schoolName} admissions."\n2. Confirm interest: "You enquired about ${lead.classInterested} for ${child}, is that right?"\n3. Value: Share 2 strengths (results, safety, caring teachers).\n4. Invite: Offer a campus visit slot.\n5. Close: Confirm date & send WhatsApp details.`,
    admissionReminder: `Reminder: ${schoolName} admissions for ${lead.classInterested} are filling fast. Would you like to book ${child}'s seat or schedule a visit? Reply YES and we'll help. 🎓`,
    parentTrustMessage: `At ${schoolName}, your child's safety and growth come first. We keep parents updated, maintain small caring classrooms, and focus on values + results. We'd be honoured to be part of ${child}'s journey. 💙`,
  };
}
