import { apiRequest } from "./client";
import type { LeaderboardEntry, UserStats } from "@/lib/types";

export async function getLeaderboard(
  baseUrl: string,
  limit = 20
): Promise<LeaderboardEntry[]> {
  const search = new URLSearchParams({ limit: String(limit) });
  return apiRequest<LeaderboardEntry[]>(
    baseUrl,
    `/leaderboard?${search.toString()}`,
    {
      next: { revalidate: 120 },
    }
  );
}

export async function grantXp(
  baseUrl: string,
  userId: string,
  amount: number
): Promise<UserStats> {
  return apiRequest<UserStats>(baseUrl, "/user/xp/update", {
    method: "POST",
    body: JSON.stringify({ userId, amount }),
  });
}
