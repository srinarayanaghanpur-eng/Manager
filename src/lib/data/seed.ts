// ---------------------------------------------------------------------------
// Seed / mock data. Used everywhere until Firestore is connected.
// Mirrors the Firestore collections 1:1 so swapping to live data is trivial.
// ---------------------------------------------------------------------------
import type {
  AnalyticsSnapshot,
  AppUser,
  ApprovalItem,
  CalendarItem,
  ContentIdea,
  Lead,
  MediaItem,
  School,
  SocialAccount,
  Sponsor,
  WeeklyReport,
} from "@/lib/types";

export const SCHOOL_A = "school_narayana";
export const SCHOOL_B = "school_adarshavani";

export const currentUser: AppUser = {
  id: "user_admin",
  name: "Ananth",
  email: "srinarayanaghanpur@gmail.com",
  role: "super_admin",
};

export const users: AppUser[] = [
  currentUser,
  { id: "u2", name: "Priya (Manager)", email: "priya@example.com", role: "social_manager" },
  { id: "u3", name: "Ravi (Creator)", email: "ravi@example.com", role: "content_creator" },
  { id: "u4", name: "Guest", email: "guest@example.com", role: "viewer" },
];

export const schools: School[] = [
  {
    id: SCHOOL_A,
    name: "Sri Narayana High School",
    branch: "Ghanpur",
    brandColors: { primary: "#1f43f5", secondary: "#a855f7" },
    contactNumber: "+91 90000 00001",
    address: "Ghanpur, Warangal District, Telangana",
    website: "https://srinarayanaschool.example",
    instagram: "https://www.instagram.com/sri_narayana_high_school/",
    facebook: "https://facebook.com/srinarayana",
    youtube: "https://youtube.com/@srinarayana",
    whatsapp: "https://wa.me/919000000001",
    followers: { instagram: 2050, facebook: 1280, youtube: 540 },
    targetAudience: "Local parents of K-10 children, Ghanpur & nearby villages",
    contentTone: "premium",
    targetFollowers: 10000,
    monthlyGrowthTarget: "+800 followers / month",
    bestContentType: "Cinematic reels, campus highlights & YouTube Shorts",
    postingFrequency: "1 post/day + 4–5 reels/week",
    admissionCTA: "📞 Book a campus visit — Admissions 2026 are open!",
    contentStrategy:
      "Premium professional branding. Lead with high-quality reels, admissions stories, parent-trust content, student achievements and school events. Grow YouTube with Shorts + long-form campus videos and generate admission leads.",
  },
  {
    id: SCHOOL_B,
    name: "Sri Adarshavani High School",
    branch: "Duggondi",
    brandColors: { primary: "#0ea5e9", secondary: "#22c55e" },
    contactNumber: "+91 90000 00002",
    address: "Duggondi, Warangal District, Telangana",
    website: "https://adarshavani.example",
    instagram: "https://www.instagram.com/sri_adarshavani/",
    facebook: "https://facebook.com/adarshavani",
    youtube: "https://www.youtube.com/@sriadarshavanihighschooldu7480",
    whatsapp: "https://wa.me/919000000002",
    followers: { instagram: 500, facebook: 320, youtube: 140 },
    targetAudience: "Local parents in Duggondi mandal",
    contentTone: "local_parent",
    targetFollowers: 2000,
    monthlyGrowthTarget: "+250 followers / month",
    bestContentType: "Daily activity reels & student/teacher moments",
    postingFrequency: "1–2 posts/day, daily reels",
    admissionCTA: "📲 DM us on WhatsApp for admission details!",
    contentStrategy:
      "Friendly, active, local & trustworthy. Build awareness through consistent daily posting, school-activity reels, teacher/student confidence videos and parent-friendly posts to grow followers and local reach fast.",
  },
];

export const socialAccounts: SocialAccount[] = [
  { id: "sa1", schoolId: SCHOOL_A, platform: "instagram", handle: "@sri_narayana_high_school", followers: 2050, connected: false },
  { id: "sa2", schoolId: SCHOOL_A, platform: "facebook", handle: "Sri Narayana", followers: 1280, connected: false },
  { id: "sa3", schoolId: SCHOOL_A, platform: "youtube", handle: "@srinarayana", followers: 540, connected: false },
  { id: "sa4", schoolId: SCHOOL_B, platform: "instagram", handle: "@sri_adarshavani", followers: 500, connected: false },
  { id: "sa5", schoolId: SCHOOL_B, platform: "facebook", handle: "Sri Adarshavani", followers: 320, connected: false },
  { id: "sa6", schoolId: SCHOOL_B, platform: "youtube", handle: "@sriadarshavanihighschooldu7480", followers: 140, connected: false },
];

const baseDoc = (i: number, schoolId: string) => ({
  createdAt: `2026-06-${10 + (i % 15)}T09:00:00.000Z`,
  updatedAt: `2026-06-${10 + (i % 15)}T09:00:00.000Z`,
  createdBy: "user_admin",
  schoolId,
});

export const contentIdeas: ContentIdea[] = [
  { id: "ci1", ...baseDoc(1, SCHOOL_A), title: "Admissions Open 2026 countdown", hook: "Only a few seats left!", caption: "Book your child's seat today 🎓", hashtags: ["#Admissions2026", "#JoinUs"], bestPlatform: "instagram", difficulty: "easy", reachScore: 82, needsStudentFace: false, goal: "admissions", whyItWorks: "Scarcity + CTA drives enquiries.", videoIdea: "Animated counter over campus b-roll.", status: "approved" },
  { id: "ci2", ...baseDoc(2, SCHOOL_A), title: "A Day at School — 60s tour", hook: "What does a full school day look like?", caption: "Step inside our world 💙", hashtags: ["#SchoolTour", "#CampusLife"], bestPlatform: "youtube", difficulty: "medium", reachScore: 75, needsStudentFace: false, goal: "trust", whyItWorks: "Shows clean facilities, builds trust.", videoIdea: "Gimbal walkthrough of campus.", status: "ready" },
  { id: "ci3", ...baseDoc(3, SCHOOL_A), title: "Teacher tip: exam prep", hook: "3 tips our toppers swear by", caption: "Save this for exam season 📚", hashtags: ["#ExamTips", "#StudySmart"], bestPlatform: "facebook", difficulty: "easy", reachScore: 68, needsStudentFace: false, goal: "parent_education", whyItWorks: "High save rate among parents.", videoIdea: "Teacher to camera, 3 tips.", status: "draft" },
  { id: "ci4", ...baseDoc(4, SCHOOL_B), title: "Student achievement spotlight", hook: "Proud moment alert! 🏆", caption: "Celebrating our stars 🌟", hashtags: ["#ProudMoment", "#Achievers"], bestPlatform: "instagram", difficulty: "easy", reachScore: 71, needsStudentFace: true, goal: "trust", whyItWorks: "Builds pride & referrals.", videoIdea: "Photo montage (consent required).", status: "idea" },
  { id: "ci5", ...baseDoc(5, SCHOOL_B), title: "Independence Day salute", hook: "How we honour our nation 🇮🇳", caption: "Proud & grateful 🇮🇳", hashtags: ["#IndependenceDay", "#SchoolPride"], bestPlatform: "instagram", difficulty: "medium", reachScore: 79, needsStudentFace: false, goal: "brand_building", whyItWorks: "Timely patriotic reach.", videoIdea: "Flag moment + tricolor overlay.", status: "idea" },
  { id: "ci6", ...baseDoc(6, SCHOOL_A), title: "Festival greetings reel", hook: "Wishing your family joy 🪔", caption: "Happy festival from us! 💛", hashtags: ["#FestivalWishes"], bestPlatform: "facebook", difficulty: "easy", reachScore: 66, needsStudentFace: false, goal: "brand_building", whyItWorks: "Shareable in parent groups.", videoIdea: "Decorated campus b-roll.", status: "idea" },
  { id: "ci7", ...baseDoc(7, SCHOOL_A), title: "Exam motivation pep talk", hook: "Take a deep breath, you've got this", caption: "You're more ready than you think 💪", hashtags: ["#ExamMotivation"], bestPlatform: "youtube", difficulty: "easy", reachScore: 64, needsStudentFace: false, goal: "parent_education", whyItWorks: "Emotional & relatable.", videoIdea: "Teacher motivational line.", status: "idea" },
  { id: "ci8", ...baseDoc(8, SCHOOL_B), title: "Trending audio transition", hook: "Wait for the transition 👀", caption: "Learning is fun here 😄", hashtags: ["#Trending", "#Reels"], bestPlatform: "instagram", difficulty: "medium", reachScore: 73, needsStudentFace: false, goal: "viral_reach", whyItWorks: "Trend boosts discovery.", videoIdea: "Snap transition on the beat.", status: "idea" },
  { id: "ci9", ...baseDoc(9, SCHOOL_A), title: "Morning assembly moment", hook: "Every day starts with values", caption: "Discipline + care, daily 💙", hashtags: ["#MorningAssembly"], bestPlatform: "facebook", difficulty: "easy", reachScore: 60, needsStudentFace: false, goal: "trust", whyItWorks: "Reassures parents on values.", videoIdea: "Assembly wide shot + VO.", status: "idea" },
  { id: "ci10", ...baseDoc(10, SCHOOL_B), title: "5 reasons parents choose us", hook: "Why families trust our school", caption: "Here's what sets us apart ✨", hashtags: ["#WhyUs", "#Admissions2026"], bestPlatform: "instagram", difficulty: "easy", reachScore: 77, needsStudentFace: false, goal: "admissions", whyItWorks: "Direct admissions driver.", videoIdea: "5-card carousel with CTA.", status: "idea" },
];

const day = (offset: number) => {
  const d = new Date("2026-06-29T00:00:00.000Z");
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export const calendarItems: CalendarItem[] = [
  { id: "cal1", ...baseDoc(1, SCHOOL_A), title: "Admissions countdown reel", date: day(0), platform: "instagram", contentType: "reel", status: "approved", assignedTo: "Ravi (Creator)" },
  { id: "cal2", ...baseDoc(2, SCHOOL_A), title: "Teacher tip Short", date: day(1), platform: "youtube", contentType: "short", status: "ready", assignedTo: "Ravi (Creator)" },
  { id: "cal3", ...baseDoc(3, SCHOOL_B), title: "Parent must-know carousel", date: day(2), platform: "facebook", contentType: "carousel", status: "draft", assignedTo: "Priya (Manager)" },
  { id: "cal4", ...baseDoc(4, SCHOOL_A), title: "Classroom activity reel", date: day(3), platform: "instagram", contentType: "reel", status: "idea", assignedTo: "Ravi (Creator)" },
  { id: "cal5", ...baseDoc(5, SCHOOL_B), title: "Admissions WhatsApp status", date: day(4), platform: "whatsapp", contentType: "story", status: "idea", assignedTo: "Priya (Manager)" },
  { id: "cal6", ...baseDoc(6, SCHOOL_A), title: "Weekend highlight reel", date: day(5), platform: "instagram", contentType: "reel", status: "idea", assignedTo: "Ravi (Creator)" },
  { id: "cal7", ...baseDoc(7, SCHOOL_B), title: "Festival values post", date: day(6), platform: "facebook", contentType: "poster", status: "idea", assignedTo: "Priya (Manager)" },
];

export const approvals: ApprovalItem[] = [
  { id: "ap1", ...baseDoc(1, SCHOOL_A), title: "Admissions countdown reel", platform: "instagram", approvalStatus: "waiting_for_approval", submittedBy: "Ravi (Creator)", caption: "Only a few seats left for 2026 🎓 Book your visit today!" },
  { id: "ap2", ...baseDoc(2, SCHOOL_B), title: "Student achievement spotlight", platform: "instagram", approvalStatus: "waiting_for_approval", submittedBy: "Priya (Manager)", caption: "Celebrating our shining stars 🌟 (parent consent on file)" },
  { id: "ap3", ...baseDoc(3, SCHOOL_A), title: "Teacher exam tips Short", platform: "youtube", approvalStatus: "approved", submittedBy: "Ravi (Creator)", reviewer: "Ananth", caption: "3 tips our toppers swear by 📚" },
  { id: "ap4", ...baseDoc(4, SCHOOL_B), title: "Generic meme repost", platform: "facebook", approvalStatus: "rejected", submittedBy: "Ravi (Creator)", reviewer: "Ananth", comment: "Off-brand for a school. Use original content only.", caption: "..." },
  { id: "ap5", ...baseDoc(5, SCHOOL_A), title: "Campus tour reel", platform: "instagram", approvalStatus: "published", submittedBy: "Priya (Manager)", reviewer: "Ananth", publishedLink: "https://instagram.com/p/mock2", caption: "Step inside our world 💙" },
];

export const mediaItems: MediaItem[] = [
  { id: "m1", ...baseDoc(1, SCHOOL_A), name: "Campus front gate.jpg", type: "photo", url: "", tags: ["campus", "exterior"], eventName: "General", consent: "approved", containsStudentFace: false },
  { id: "m2", ...baseDoc(2, SCHOOL_A), name: "Annual day performance.mp4", type: "video", url: "", tags: ["event", "annual-day"], className: "Class 8", eventName: "Annual Day", consent: "need_parent_consent", containsStudentFace: true },
  { id: "m3", ...baseDoc(3, SCHOOL_A), name: "School logo.png", type: "logo", url: "", tags: ["brand"], consent: "approved", containsStudentFace: false },
  { id: "m4", ...baseDoc(4, SCHOOL_B), name: "Science exhibition.jpg", type: "photo", url: "", tags: ["event", "science"], className: "Class 9", eventName: "Science Fair", consent: "need_parent_consent", containsStudentFace: true },
  { id: "m5", ...baseDoc(5, SCHOOL_B), name: "Admissions poster.png", type: "poster", url: "", tags: ["admissions", "poster"], consent: "approved", containsStudentFace: false },
];

export const leads: Lead[] = [
  { id: "l1", ...baseDoc(1, SCHOOL_A), parentName: "Suresh Kumar", phone: "+91 98765 11111", studentName: "Anvika", classInterested: "Class 1", source: "instagram", status: "new", followUpDate: day(1) },
  { id: "l2", ...baseDoc(2, SCHOOL_A), parentName: "Lakshmi Devi", phone: "+91 98765 22222", studentName: "Rohan", classInterested: "Class 5", source: "facebook", status: "contacted", notes: "Wants a campus visit this weekend.", followUpDate: day(2) },
  { id: "l3", ...baseDoc(3, SCHOOL_B), parentName: "Venkat Rao", phone: "+91 98765 33333", studentName: "Sneha", classInterested: "Class 8", source: "youtube", status: "visited", notes: "Visited, comparing 2 schools.", followUpDate: day(3) },
  { id: "l4", ...baseDoc(4, SCHOOL_A), parentName: "Anita Sharma", phone: "+91 98765 44444", studentName: "Kiran", classInterested: "Class 3", source: "whatsapp", status: "joined", notes: "Admission confirmed 🎉" },
  { id: "l5", ...baseDoc(5, SCHOOL_B), parentName: "Mohan Reddy", phone: "+91 98765 55555", studentName: "Divya", classInterested: "Class 10", source: "instagram", status: "not_interested", notes: "Chose a school closer to home." },
];

const history = (start: number) =>
  Array.from({ length: 6 }).map((_, i) => ({
    week: `W${i + 1}`,
    value: start + i * Math.round(start * 0.03),
  }));

export const analytics: AnalyticsSnapshot[] = [
  { schoolId: SCHOOL_A, platform: "instagram", followers: 2050, reach: 9800, engagement: 6.2, views: 14200, likes: 1340, comments: 96, shares: 210, saves: 320, watchTimeHours: 48, bestPostingTime: "6–8 PM", bestContentType: "reel", followerHistory: history(1750) },
  { schoolId: SCHOOL_A, platform: "youtube", followers: 540, reach: 12000, engagement: 3.4, views: 24800, likes: 980, comments: 64, shares: 120, saves: 0, watchTimeHours: 310, bestPostingTime: "7–9 PM", bestContentType: "short", followerHistory: history(420) },
  { schoolId: SCHOOL_A, platform: "facebook", followers: 1280, reach: 5400, engagement: 4.1, views: 7200, likes: 640, comments: 54, shares: 180, saves: 0, watchTimeHours: 22, bestPostingTime: "8–9 PM", bestContentType: "carousel", followerHistory: history(1100) },
  { schoolId: SCHOOL_B, platform: "instagram", followers: 500, reach: 2100, engagement: 5.1, views: 3600, likes: 280, comments: 22, shares: 40, saves: 70, watchTimeHours: 11, bestPostingTime: "6–8 PM", bestContentType: "reel", followerHistory: history(380) },
  { schoolId: SCHOOL_B, platform: "youtube", followers: 140, reach: 2800, engagement: 2.9, views: 5100, likes: 190, comments: 14, shares: 22, saves: 0, watchTimeHours: 60, bestPostingTime: "7–9 PM", bestContentType: "short", followerHistory: history(95) },
  { schoolId: SCHOOL_B, platform: "facebook", followers: 320, reach: 1400, engagement: 3.3, views: 1900, likes: 120, comments: 9, shares: 18, saves: 0, watchTimeHours: 6, bestPostingTime: "8–9 PM", bestContentType: "poster", followerHistory: history(250) },
];

export const weeklyReports: WeeklyReport[] = [
  {
    id: "wr1",
    weekOf: day(0),
    schoolId: SCHOOL_A,
    contentPlan: [
      { day: "Mon", idea: "Admissions countdown reel", platform: "instagram" },
      { day: "Tue", idea: "Teacher tip Short", platform: "youtube" },
      { day: "Wed", idea: "Parent must-know carousel", platform: "facebook" },
      { day: "Thu", idea: "Classroom activity reel", platform: "instagram" },
      { day: "Fri", idea: "Admissions WhatsApp status", platform: "whatsapp" },
      { day: "Sat", idea: "Weekend highlight reel", platform: "instagram" },
      { day: "Sun", idea: "Festival/values post", platform: "facebook" },
    ],
    bestReelIdea: "\"A day at Sri Narayana\" fast-cut campus tour with trending audio.",
    bestAdmissionPost: "Carousel: 5 reasons parents choose us + strong CTA.",
    parentEducationTopic: "Building a distraction-free home study corner.",
    youtubeTitle: "Inside Sri Narayana: A Real School Day (Campus Tour 2026)",
    growthTarget: "+100 IG followers, 3 reels over 5K views.",
    mistakesToAvoid: [
      "Posting student faces without consent",
      "Low-effort daily posts",
      "Ignoring admission DMs",
      "Copyrighted music on YouTube",
    ],
  },
];

// Monetization tracker mock
export const monetization = {
  youtube: {
    subscribers: 540,
    subscribersTarget: 1000,
    watchHours: 310,
    watchHoursTarget: 4000,
    shortsViews: 86000,
    shortsViewsTarget: 1000000,
  },
  facebookChecklist: [
    { item: "10,000 followers", done: false },
    { item: "600,000 total minutes viewed (60 days)", done: false },
    { item: "5+ active videos", done: true },
    { item: "Page follows Partner Monetization policies", done: true },
  ],
  opportunities: [
    { title: "Summer camp promotion", note: "High-intent local parents; run reels + WhatsApp.", potential: "High" },
    { title: "Spoken English course", note: "Strong demand; bundle with admissions.", potential: "High" },
    { title: "Computer class promotion", note: "Position as future-skills; short demo reels.", potential: "Medium" },
    { title: "Local business collaboration", note: "Stationery/uniform shops cross-promo.", potential: "Medium" },
    { title: "Sponsorship — local sports day", note: "Banner + social shoutout package.", potential: "Low" },
  ],
};

// ---------------------------------------------------------------------------
// Monetization & Growth page data
// ---------------------------------------------------------------------------

export const youtubeTracker = {
  subscribers: 540,
  subscribersTarget: 1000, // YPP eligibility
  publicWatchHours: 310,
  watchHoursTarget: 4000, // YPP eligibility (long-form path)
  shortsViews: 86000,
  shortsViewsTarget: 10_000_000, // Shorts path (90 days)
  uploads: 38,
  nextTarget: "Reach 1,000 subscribers + 4,000 public watch hours for YouTube Partner Program.",
  weeklyActions: [
    "Upload 2 long-form videos (campus tour + parent tips) to grow watch hours.",
    "Post 4 Shorts repurposed from your best Reels.",
    "Add end screens + playlists to lift session watch time.",
    "Pin a comment with admissions CTA on every video.",
  ],
};

export const instagramTracker = {
  followers: 2050,
  followersTarget: 10000,
  reelViews: 142000,
  engagementRate: 6.2,
  bestReel: { title: "A Day at School (campus tour)", views: 18400, likes: 1240 },
  weeklyGrowth: 120,
  growthActions: [
    "Post 4–5 reels/week with trending audio.",
    "Use a strong hook in the first 2 seconds.",
    "Reply to every comment within an hour of posting.",
  ],
};

export const facebookTracker = {
  followers: 1280,
  pageReach: 5400,
  reelsViews: 24800,
  engagementRate: 4.1,
  checklist: [
    { item: "10,000 followers", done: false },
    { item: "600,000 total minutes viewed (last 60 days)", done: false },
    { item: "5+ active videos", done: true },
    { item: "Follows Partner Monetization & Content policies", done: true },
    { item: "Page is 90+ days old", done: true },
  ],
};

export interface EarningSource {
  source: string;
  icon: string;
  thisMonth: number;
  lastMonth: number;
  note: string;
}

export const businessEarnings: EarningSource[] = [
  { source: "Admissions via social media", icon: "UserPlus", thisMonth: 240000, lastMonth: 180000, note: "8 admissions attributed to Instagram/WhatsApp" },
  { source: "Summer camp", icon: "Sparkles", thisMonth: 65000, lastMonth: 0, note: "26 enrolments from reels campaign" },
  { source: "Spoken English classes", icon: "MessageCircle", thisMonth: 48000, lastMonth: 40000, note: "Batch of 32 students" },
  { source: "Computer classes", icon: "LayoutDashboard", thisMonth: 36000, lastMonth: 30000, note: "Weekend batch" },
  { source: "Sponsorships", icon: "Wallet", thisMonth: 25000, lastMonth: 15000, note: "Sports day banner + reel shoutout" },
  { source: "Local collaborations", icon: "Users", thisMonth: 12000, lastMonth: 8000, note: "Uniform & stationery cross-promo" },
];

export const sponsors: Sponsor[] = [
  { id: "sp1", name: "Sri Lakshmi Stationery", businessType: "Stationery & books", contactNumber: "+91 90000 10001", packageAmount: 15000, startDate: "2026-06-01", endDate: "2026-08-31", deliverables: "Logo on annual day banner + 1 reel shoutout", status: "active" },
  { id: "sp2", name: "Green Leaf Uniforms", businessType: "School uniforms", contactNumber: "+91 90000 10002", packageAmount: 10000, startDate: "2026-06-15", endDate: "2026-07-15", deliverables: "Story mention + tagged post", status: "negotiating" },
  { id: "sp3", name: "Bright Future Tuition", businessType: "Coaching centre", contactNumber: "+91 90000 10003", packageAmount: 20000, startDate: "2026-05-01", endDate: "2026-05-31", deliverables: "Sports day title sponsor + 2 reels", status: "completed" },
  { id: "sp4", name: "Anand Sweets & Bakery", businessType: "Food & catering", contactNumber: "+91 90000 10004", packageAmount: 8000, startDate: "", endDate: "", deliverables: "Festival event catering + banner", status: "prospect" },
];

export const monthlyRevenue = {
  month: "June 2026",
  totalLeads: 42,
  convertedAdmissions: 8,
  estimatedRevenue: 240000, // admissions value
  sponsorIncome: 25000,
  youtubeProgress: "54% to subscribers goal · 8% to watch-hours goal",
  bestPlatformForRevenue: "Instagram (drives most admission enquiries)",
  revenueByPlatform: [
    { platform: "instagram", value: 150000 },
    { platform: "whatsapp", value: 70000 },
    { platform: "facebook", value: 25000 },
    { platform: "youtube", value: 20000 },
  ],
};

// ---------------------------------------------------------------------------
// Per-school health/growth scores derived from existing mock data.
// ---------------------------------------------------------------------------
export interface SchoolScores {
  contentConsistency: number; // 0-100
  leadGeneration: number; // 0-100
  accountHealth: number; // 0-100
  weeklyGrowthPct: number;
}

export function computeSchoolScores(schoolId: string): SchoolScores {
  const planned = calendarItems.filter((c) => c.schoolId === schoolId).length;
  const schoolLeads = leads.filter((l) => l.schoolId === schoolId);
  const joined = schoolLeads.filter((l) => l.status === "joined").length;
  const ana = analytics.filter((a) => a.schoolId === schoolId);
  const avgEng = ana.reduce((s, a) => s + a.engagement, 0) / (ana.length || 1);

  const ig = ana.find((a) => a.platform === "instagram");
  const hist = ig?.followerHistory ?? [];
  const start = hist[0]?.value ?? 1;
  const end = hist[hist.length - 1]?.value ?? start;
  const weeklyGrowthPct = Math.round(((end - start) / start / (hist.length || 1)) * 100);

  const contentConsistency = Math.min(100, Math.round((planned / 7) * 100) + 40);
  const leadGeneration = Math.min(100, schoolLeads.length * 12 + joined * 15);
  const accountHealth = Math.min(
    100,
    Math.round(avgEng * 8 + contentConsistency * 0.3 + leadGeneration * 0.2)
  );
  return { contentConsistency, leadGeneration, accountHealth, weeklyGrowthPct };
}

// Best-performing content idea per school (highest reach score).
export function bestContentForSchool(schoolId: string): ContentIdea | undefined {
  return contentIdeas
    .filter((c) => c.schoolId === schoolId)
    .sort((a, b) => b.reachScore - a.reachScore)[0];
}
