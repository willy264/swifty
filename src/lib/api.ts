import * as aiApi from "@/services/api/ai";
import * as airdropApi from "@/services/api/airdrops";
import * as authApi from "@/services/api/auth";
import * as cryptoApi from "@/services/api/crypto";
import * as gamificationApi from "@/services/api/gamification";
import * as healthApi from "@/services/api/health";
import * as notificationApi from "@/services/api/notifications";
import * as referralApi from "@/services/api/referrals";
import * as taskApi from "@/services/api/tasks";
import * as userApi from "@/services/api/user";
import * as walletApi from "@/services/api/wallet";
import { API_BASE_URL, DEMO_USER_ID } from "@/data/constants";
import { getDashboardData } from "@/services/api/aggregations";

export { ApiError, apiRequest, type JsonValue } from "@/services/api/client";
export { getDashboardData };

export function getServiceBanner() {
  return healthApi.getServiceBanner(API_BASE_URL);
}

export function getHealth() {
  return healthApi.getHealth(API_BASE_URL);
}

export function authenticateTelegram(initData: string) {
  return authApi.authenticateTelegram(API_BASE_URL, initData);
}

export function getUser(userId: string = DEMO_USER_ID) {
  return userApi.getUser(API_BASE_URL, userId);
}

export function getUserStats(userId: string) {
  return userApi.getUserStats(API_BASE_URL, userId);
}

export function attachUserWallet(userId: string, address: string) {
  return userApi.attachUserWallet(API_BASE_URL, userId, address);
}

export function connectWallet(userId: string, address: string) {
  return userApi.connectWallet(API_BASE_URL, userId, address);
}

export function getAirdrops(take = 24, skip = 0) {
  return airdropApi.getAirdrops(API_BASE_URL, take, skip);
}

export function getAirdropById(id: string) {
  return airdropApi.getAirdropById(API_BASE_URL, id);
}

export function analyzeAirdrop(
  input: Parameters<typeof airdropApi.analyzeAirdrop>[1]
) {
  return airdropApi.analyzeAirdrop(API_BASE_URL, input);
}

export function analyzeWallet(address: string, chain = "eth" as const) {
  return walletApi.analyzeWallet(API_BASE_URL, address, chain);
}

export function getWalletAnalysis(address: string, chain = "eth" as const) {
  return walletApi.getWalletAnalysis(API_BASE_URL, address, chain);
}

export function getTrendingCoins() {
  return cryptoApi.getTrendingCoins(API_BASE_URL);
}

export function getCoinPrice(coinId: string, vs = "usd") {
  return cryptoApi.getCoinPrice(API_BASE_URL, coinId, vs);
}

export function getUserTasks(userId: string) {
  return taskApi.getUserTasks(API_BASE_URL, userId);
}

export function ensureChecklist(userId: string, airdropId: string) {
  return taskApi.ensureChecklist(API_BASE_URL, userId, airdropId);
}

export function updateTask(
  input: Parameters<typeof taskApi.updateTask>[1]
) {
  return taskApi.updateTask(API_BASE_URL, input);
}

export function getLeaderboard(limit = 20) {
  return gamificationApi.getLeaderboard(API_BASE_URL, limit);
}

export function grantXp(userId: string, amount: number) {
  return gamificationApi.grantXp(API_BASE_URL, userId, amount);
}

export function getReferrals(userId: string) {
  return referralApi.getReferrals(API_BASE_URL, userId);
}

export function sendNotification(
  input: Parameters<typeof notificationApi.sendNotification>[1]
) {
  return notificationApi.sendNotification(API_BASE_URL, input);
}

export function assessAirdrop(airdropId: string) {
  return aiApi.assessAirdrop(API_BASE_URL, airdropId);
}

export function setPreferences(
  input: Parameters<typeof aiApi.setPreferences>[1]
) {
  return aiApi.setPreferences(API_BASE_URL, input);
}

export function getRecommendations(
  input: Parameters<typeof aiApi.getRecommendations>[1]
) {
  return aiApi.getRecommendations(API_BASE_URL, input);
}
