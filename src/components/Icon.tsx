"use client";

import {
  LayoutDashboard, School, Bot, Lightbulb, CalendarDays, CheckCircle2,
  Images, BarChart3, Users, Wallet, Settings, TrendingUp, Clapperboard,
  PenLine, Hash, Image as ImageIcon, Youtube, Facebook, UserPlus,
  CalendarRange, Sun, Moon, Copy, Download, Sparkles, Plus, X, Phone,
  MessageCircle, ShieldCheck, Instagram, ChevronRight, Star, Eye,
  Heart, Share2, Bookmark, Clock, Workflow, Send, Video, ListVideo,
  type LucideProps,
} from "lucide-react";

const map: Record<string, React.ComponentType<LucideProps>> = {
  LayoutDashboard, School, Bot, Lightbulb, CalendarDays, CheckCircle2,
  Images, BarChart3, Users, Wallet, Settings, TrendingUp, Clapperboard,
  PenLine, Hash, Image: ImageIcon, Youtube, Facebook, UserPlus,
  CalendarRange, Sun, Moon, Copy, Download, Sparkles, Plus, X, Phone,
  MessageCircle, ShieldCheck, Instagram, ChevronRight, Star, Eye,
  Heart, Share2, Bookmark, Clock, Workflow, Send, Video, ListVideo,
  // Aliases so platformLabel() values resolve to an icon.
  YouTube: Youtube,
  WhatsApp: MessageCircle,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = map[name] ?? Sparkles;
  return <Cmp {...props} />;
}
