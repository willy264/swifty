// Export all API functions
export { ApiError, apiRequest, type JsonValue } from "./client";
export { authenticateTelegram } from "./auth";
export {
  getUser,
  getUserStats,
  attachUserWallet,
  connectWallet,
} from "./user";
export {
  getAirdrops,
  getAirdropById,
  analyzeAirdrop,
} from "./airdrops";
export { analyzeWallet, getWalletAnalysis } from "./wallet";
export {
  getUserTasks,
  ensureChecklist,
  updateTask,
} from "./tasks";
export {
  getLeaderboard,
  grantXp,
} from "./gamification";
export { getReferrals } from "./referrals";
export {
  getTrendingCoins,
  getCoinPrice,
} from "./crypto";
export { sendNotification } from "./notifications";
export { getHealth, getServiceBanner } from "./health";
export {
  assessAirdrop,
  setPreferences,
  getRecommendations,
} from "./ai";
