import { apiRequest, type JsonValue } from "./client";
import type { Airdrop, SecurityReport, ApiChain } from "@/lib/types";

export async function getAirdrops(
  baseUrl: string,
  take = 24,
  skip = 0
): Promise<Airdrop[]> {
  const search = new URLSearchParams({
    take: String(take),
    skip: String(skip),
  });

  return apiRequest<Airdrop[]>(baseUrl, `/airdrops?${search.toString()}`, {
    next: { revalidate: 300 },
  });
}

export async function getAirdropById(
  baseUrl: string,
  id: string
): Promise<Airdrop> {
  return apiRequest<Airdrop>(baseUrl, `/airdrops/${id}`, {
    next: { revalidate: 300 },
  });
}

export async function analyzeAirdrop(
  baseUrl: string,
  input: {
    domain?: string;
    contractAddress?: string;
    chain?: ApiChain;
    tokenInfo?: Record<string, JsonValue>;
    walletBehavior?: Record<string, JsonValue>;
    socialLinks?: Record<string, string>;
    airdropId?: string;
  }
): Promise<SecurityReport> {
  return apiRequest<SecurityReport>(baseUrl, "/security/analyze-airdrop", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
