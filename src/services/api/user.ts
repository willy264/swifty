import { apiRequest } from "./client";
import type { User, UserStats, UserWithStats } from "@/lib/types";

export async function getUser(
  baseUrl: string,
  userId: string
): Promise<UserWithStats> {
  return apiRequest<UserWithStats>(baseUrl, `/user/${userId}`, {
    next: { revalidate: 60 },
  });
}

export async function getUserStats(
  baseUrl: string,
  userId: string
): Promise<UserStats | null> {
  const search = new URLSearchParams({ userId });
  return apiRequest<UserStats | null>(
    baseUrl,
    `/user/stats?${search.toString()}`,
    {
      next: { revalidate: 60 },
    }
  );
}

export async function attachUserWallet(
  baseUrl: string,
  userId: string,
  address: string
): Promise<User> {
  return apiRequest<User>(baseUrl, `/user/${userId}/wallet`, {
    method: "POST",
    body: JSON.stringify({ address }),
  });
}

export async function connectWallet(
  baseUrl: string,
  userId: string,
  address: string
): Promise<User> {
  return apiRequest<User>(baseUrl, `/wallet/connect`, {
    method: "POST",
    body: JSON.stringify({ userId, address }),
  });
}
