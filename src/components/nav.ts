export interface NavItem {
  href: string;
  label: string;
  icon: string; // lucide icon name
}

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/workflow", label: "Workflow", icon: "Workflow" },
  { href: "/schools", label: "Schools", icon: "School" },
  { href: "/ai-agents", label: "AI Agents", icon: "Bot" },
  { href: "/growth", label: "Growth Studio", icon: "TrendingUp" },
  { href: "/content-ideas", label: "Content Ideas", icon: "Lightbulb" },
  { href: "/poster-studio", label: "Poster & Reel Studio", icon: "Image" },
  { href: "/two-school-planner", label: "Two-School Planner", icon: "Clapperboard" },
  { href: "/calendar", label: "Calendar", icon: "CalendarDays" },
  { href: "/approvals", label: "Approvals", icon: "CheckCircle2" },
  { href: "/media", label: "Media Library", icon: "Images" },
  { href: "/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/leads", label: "Leads", icon: "Users" },
  { href: "/youtube", label: "YouTube Studio", icon: "Youtube" },
  { href: "/monetization", label: "Monetization & Growth", icon: "Wallet" },
  { href: "/settings", label: "Settings", icon: "Settings" },
];

// Items shown in the mobile bottom bar (most-used 5).
export const bottomNav: NavItem[] = [
  { href: "/", label: "Home", icon: "LayoutDashboard" },
  { href: "/ai-agents", label: "Agents", icon: "Bot" },
  { href: "/calendar", label: "Plan", icon: "CalendarDays" },
  { href: "/approvals", label: "Approve", icon: "CheckCircle2" },
  { href: "/leads", label: "Leads", icon: "Users" },
];
