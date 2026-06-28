// ---------------------------------------------------------------------------
// Shared domain types for EduSocial AI Manager
// ---------------------------------------------------------------------------

export type Role = "super_admin" | "social_manager" | "content_creator" | "viewer";

export type Platform = "instagram" | "facebook" | "youtube" | "whatsapp";

export type ContentType =
  | "reel"
  | "short"
  | "poster"
  | "story"
  | "long_video"
  | "carousel";

export type ContentGoal =
  | "admissions"
  | "trust"
  | "viral_reach"
  | "parent_education"
  | "event_coverage"
  | "brand_building";

export type Language = "english" | "telugu" | "hinglish";

export type Tone = "premium" | "emotional" | "gen_z" | "professional" | "local_parent";

export type ContentStatus =
  | "idea"
  | "draft"
  | "ready"
  | "approved"
  | "published";

export type ApprovalStatus =
  | "draft"
  | "waiting_for_approval"
  | "approved"
  | "rejected"
  | "published";

export type LeadStatus =
  | "new"
  | "contacted"
  | "visited"
  | "joined"
  | "not_interested";

export type MediaConsent = "approved" | "not_approved" | "need_parent_consent";

export interface BaseDoc {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  schoolId?: string;
  platform?: Platform;
  status?: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface School {
  id: string;
  name: string;
  branch: string;
  logoUrl?: string;
  brandColors: { primary: string; secondary: string };
  contactNumber: string;
  address: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  whatsapp?: string;
  followers: { instagram: number; facebook: number; youtube: number };
  targetAudience: string;
  contentTone: Tone;
  // Per-school growth strategy
  targetFollowers?: number;
  monthlyGrowthTarget?: string;
  bestContentType?: string;
  postingFrequency?: string;
  admissionCTA?: string;
  contentStrategy?: string;
}

export interface SocialAccount {
  id: string;
  schoolId: string;
  platform: Platform;
  handle: string;
  followers: number;
  connected: boolean;
}

export interface ContentIdea extends BaseDoc {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  bestPlatform: Platform;
  difficulty: "easy" | "medium" | "hard";
  reachScore: number; // 0-100
  needsStudentFace: boolean;
  goal: ContentGoal;
  whyItWorks: string;
  videoIdea: string;
}

export interface CalendarItem extends BaseDoc {
  title: string;
  date: string; // ISO date
  platform: Platform;
  contentType: ContentType;
  status: ContentStatus;
  assignedTo: string;
  caption?: string;
  mediaIds?: string[];
}

export interface ApprovalItem extends BaseDoc {
  title: string;
  platform: Platform;
  approvalStatus: ApprovalStatus;
  submittedBy: string;
  reviewer?: string;
  comment?: string;
  publishedLink?: string;
  caption: string;
}

export interface MediaItem extends BaseDoc {
  name: string;
  type: "photo" | "video" | "logo" | "poster";
  url: string;
  tags: string[];
  className?: string;
  eventName?: string;
  consent: MediaConsent;
  containsStudentFace: boolean;
}

export interface Lead extends BaseDoc {
  parentName: string;
  phone: string;
  studentName: string;
  classInterested: string;
  source: Platform;
  status: LeadStatus;
  notes?: string;
  followUpDate?: string;
}

export interface AnalyticsSnapshot {
  schoolId: string;
  platform: Platform;
  followers: number;
  reach: number;
  engagement: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  watchTimeHours: number;
  bestPostingTime: string;
  bestContentType: ContentType;
  followerHistory: { week: string; value: number }[];
}

export interface WeeklyReport {
  id: string;
  weekOf: string;
  schoolId: string;
  contentPlan: { day: string; idea: string; platform: Platform }[];
  bestReelIdea: string;
  bestAdmissionPost: string;
  parentEducationTopic: string;
  youtubeTitle: string;
  growthTarget: string;
  mistakesToAvoid: string[];
}

export type SponsorStatus = "prospect" | "contacted" | "negotiating" | "active" | "completed" | "declined";

export interface Sponsor {
  id: string;
  name: string;
  businessType: string;
  contactNumber: string;
  packageAmount: number;
  startDate: string;
  endDate: string;
  deliverables: string;
  status: SponsorStatus;
}

export type AgentFieldType = "text" | "textarea" | "select" | "school" | "platform";

export interface AgentField {
  key: string;
  label: string;
  type: AgentFieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  default?: string;
  optional?: boolean;
  full?: boolean; // span both columns
}

export type AgentCategory = "Content" | "Growth" | "Trust" | "Insights";

export interface AgentDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  accent: string;
  tagline: string;
  category: AgentCategory;
  outputs: string[]; // labels of what it delivers, shown on the card
  fields: AgentField[];
}
