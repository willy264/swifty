export type Nullable<T> = T | null;

export type ApiChain =
  | "eth"
  | "bsc"
  | "polygon"
  | "arbitrum"
  | "optimism"
  | "base";

export type TaskStatus = "pending" | "in_progress" | "completed";

export type NotificationType =
  | "new_airdrop"
  | "deadline_alert"
  | "scam_warning"
  | "wallet_risk"
  | "task_update";

export interface HealthResponse {
  status: string;
  service: string;
  ts: string;
}

export interface User {
  id: string;
  telegramId: string;
  username?: Nullable<string>;
  walletAddress?: Nullable<string>;
  referralCode: string;
  referredById?: Nullable<string>;
  createdAt: string;
}

export interface UserStats {
  userId: string;
  xp: number;
  streak: number;
  level: number;
  badges: string[];
  lastActiveAt: string;
}

export interface UserWithStats extends User {
  stats?: Nullable<UserStats>;
}

export interface TelegramAuthResponse {
  user: User;
}

export interface Airdrop {
  id: string;
  externalId: string;
  name: string;
  description?: Nullable<string>;
  rewardEstimate?: Nullable<string>;
  deadline?: Nullable<string>;
  category?: Nullable<string>;
  trustScore?: Nullable<number>;
  difficulty?: Nullable<string>;
  projectUrl?: Nullable<string>;
  socialLinks: Record<string, string>;
  source: string;
  createdAt: string;
}

export interface SecurityReport {
  trust_score: number;
  scam_probability: number;
  risk_level: "low" | "medium" | "high";
  warnings: string[];
  recommendation: string;
  explanation: string;
}

export interface DangerousApproval {
  token: string;
  spender: string;
}

export interface WalletAnalysis {
  wallet_health_score: number;
  risk_indicators: string[];
  dangerous_approvals: DangerousApproval[];
  suspicious_contracts: string[];
  recommendations: string[];
}

export interface PriceResponse {
  id: string;
  vs: string;
  value: Nullable<number>;
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
}

export interface AirdropTask {
  id: string;
  airdropId: string;
  userId: string;
  label: string;
  status: TaskStatus;
  progress: number;
  completedAt?: Nullable<string>;
  createdAt: string;
}

export interface LeaderboardUserSummary {
  username?: Nullable<string>;
  referralCode: string;
}

export interface LeaderboardEntry {
  userId: string;
  xp: number;
  streak: number;
  level: number;
  badges: string[];
  lastActiveAt: string;
  user: LeaderboardUserSummary;
}

export interface ReferredUserSummary {
  username?: Nullable<string>;
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  rewardGranted: boolean;
  createdAt: string;
  referredUser: ReferredUserSummary;
}

export interface ReferralsResponse {
  count: number;
  referrals: Referral[];
}

export interface NotificationSendResponse {
  ok: boolean;
  id?: string;
  reason?: string;
}

export interface DataSectionStatus {
  ok: boolean;
  source: "live" | "fallback";
  message?: string;
}

export interface DashboardData {
  health: HealthResponse;
  user: UserWithStats | null;
  airdrops: Airdrop[];
  trending: TrendingCoin[];
  leaderboard: LeaderboardEntry[];
  tasks: AirdropTask[];
  referrals: ReferralsResponse | null;
  status: {
    user: DataSectionStatus;
    airdrops: DataSectionStatus;
    trending: DataSectionStatus;
    leaderboard: DataSectionStatus;
    tasks: DataSectionStatus;
    referrals: DataSectionStatus;
  };
}
