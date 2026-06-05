import * as userApi from "@/services/api/user";
import * as airdropApi from "@/services/api/airdrops";
import * as trendingApi from "@/services/api/crypto";
import * as gamificationApi from "@/services/api/gamification";
import * as taskApi from "@/services/api/tasks";
import * as referralApi from "@/services/api/referrals";
import * as healthApi from "@/services/api/health";

import { API_BASE_URL, DEMO_USER_ID } from "@/data/constants";
import type { DashboardData } from "@/lib/types";

export async function getDashboardData(
  userId = DEMO_USER_ID
): Promise<DashboardData> {
  const [health, userResult, airdropsResult, trendingResult, leaderboardResult, tasksResult, referralsResult] =
    await Promise.allSettled([
      healthApi.getHealth(API_BASE_URL),
      userApi.getUser(API_BASE_URL, userId),
      airdropApi.getAirdrops(API_BASE_URL, 18, 0),
      trendingApi.getTrendingCoins(API_BASE_URL),
      gamificationApi.getLeaderboard(API_BASE_URL, 8),
      taskApi.getUserTasks(API_BASE_URL, userId),
      referralApi.getReferrals(API_BASE_URL, userId),
    ]);

  return {
    health:
      health.status === "fulfilled"
        ? health.value
        : {
            status: "degraded",
            service: "swiftydrop-guard-backend",
            ts: new Date().toISOString(),
          },
    user: userResult.status === "fulfilled" ? userResult.value : null,
    airdrops:
      airdropsResult.status === "fulfilled"
        ? airdropsResult.value
        : [],
    trending:
      trendingResult.status === "fulfilled"
        ? trendingResult.value
        : [],
    leaderboard:
      leaderboardResult.status === "fulfilled"
        ? leaderboardResult.value
        : [],
    tasks:
      tasksResult.status === "fulfilled"
        ? tasksResult.value
        : [],
    referrals:
      referralsResult.status === "fulfilled"
        ? referralsResult.value
        : { count: 0, referrals: [] },
    status: {
      user:
        userResult.status === "fulfilled"
          ? { ok: true, source: "live" }
          : {
              ok: false,
              source: "fallback",
              message:
                userResult.reason instanceof Error
                  ? userResult.reason.message
                  : "User profile request failed.",
            },
      airdrops:
        airdropsResult.status === "fulfilled"
          ? { ok: true, source: "live" }
          : {
              ok: false,
              source: "fallback",
              message:
                airdropsResult.reason instanceof Error
                  ? airdropsResult.reason.message
                  : "Airdrop feed request failed.",
            },
      trending:
        trendingResult.status === "fulfilled"
          ? { ok: true, source: "live" }
          : {
              ok: false,
              source: "fallback",
              message:
                trendingResult.reason instanceof Error
                  ? trendingResult.reason.message
                  : "Trending coins request failed.",
            },
      leaderboard:
        leaderboardResult.status === "fulfilled"
          ? { ok: true, source: "live" }
          : {
              ok: false,
              source: "fallback",
              message:
                leaderboardResult.reason instanceof Error
                  ? leaderboardResult.reason.message
                  : "Leaderboard request failed.",
            },
      tasks:
        tasksResult.status === "fulfilled"
          ? { ok: true, source: "live" }
          : {
              ok: false,
              source: "fallback",
              message:
                tasksResult.reason instanceof Error
                  ? tasksResult.reason.message
                  : "Tasks request failed.",
            },
      referrals:
        referralsResult.status === "fulfilled"
          ? { ok: true, source: "live" }
          : {
              ok: false,
              source: "fallback",
              message:
                referralsResult.reason instanceof Error
                  ? referralsResult.reason.message
                  : "Referrals request failed.",
            },
    },
  };
}
