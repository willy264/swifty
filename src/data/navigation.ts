import {
  Award,
  Bell,
  Home,
  Radar,
  Shield,
  Target,
  UserCircle2,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const primaryNavItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: Home,
    description: "Mission control, trending signals, and your daily guardrail.",
  },
  {
    href: "/airdrops",
    label: "Airdrops",
    icon: Radar,
    description: "Discover verified campaigns, reward estimates, and trust cues.",
  },
  {
    href: "/wallet",
    label: "Wallet Guard",
    icon: Wallet,
    description: "Scan approvals, suspicious contracts, and wallet exposure.",
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: Target,
    description: "Track participation, deadlines, and completion streaks.",
  },
];

export const secondaryNavItems: NavItem[] = [
  {
    href: "/leaderboard",
    label: "Leaderboard",
    icon: Award,
    description: "XP, streaks, badges, and community rankings.",
  },
  {
    href: "/alerts",
    label: "Alerts",
    icon: Bell,
    description: "Push scam warnings and deadline reminders to Telegram.",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserCircle2,
    description: "Wallet, referral code, Telegram session, and account stats.",
  },
];

export const quickActionItems = [
  {
    title: "Scan a project",
    description: "Run domain and contract heuristics before you join.",
    href: "/airdrops",
    accent: "accent" as const,
  },
  {
    title: "Audit wallet risk",
    description: "Check approvals, exploit exposure, and safety score.",
    href: "/wallet",
    accent: "warn" as const,
  },
  {
    title: "Maintain streak",
    description: "Complete your checklist before deadlines roll over.",
    href: "/tasks",
    accent: "success" as const,
  },
];

export const productPillars = [
  {
    icon: Shield,
    title: "Security-first discovery",
    body: "Every campaign is framed through risk scoring and actionable warnings.",
  },
  {
    icon: Radar,
    title: "Telegram-native workflow",
    body: "Designed for Mini App auth, alerts, and share loops inside Telegram.",
  },
  {
    icon: Target,
    title: "Gamification with streaks",
    body: "XP, badges, and leaderboards drive repeated engagement and learning.",
  },
];
