import { apiRequest } from "./client";
import type { Airdrop, SetPreferencesDto, RecommendDto } from "@/lib/types";

export async function assessAirdrop(
  baseUrl: string,
  airdropId: string
): Promise<void> {
  return apiRequest<void>(baseUrl, `/ai/airdrops/${airdropId}/assess`, {
    method: "POST",
  });
}

export async function setPreferences(
  baseUrl: string,
  input: SetPreferencesDto
): Promise<void> {
  return apiRequest<void>(baseUrl, "/ai/preferences", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getRecommendations(
  baseUrl: string,
  input: RecommendDto
): Promise<Airdrop[]> {
  return apiRequest<Airdrop[]>(baseUrl, "/ai/recommendations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
