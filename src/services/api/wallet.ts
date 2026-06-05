import { apiRequest } from "./client";
import type { WalletAnalysis, ApiChain } from "@/lib/types";

export async function getWalletAnalysis(
  baseUrl: string,
  address: string,
  chain: ApiChain = "eth"
): Promise<WalletAnalysis> {
  const search = new URLSearchParams({ chain });
  return apiRequest<WalletAnalysis>(
    baseUrl,
    `/wallet/${address}/analysis?${search.toString()}`,
    {
      next: { revalidate: 60 },
    }
  );
}

export async function analyzeWallet(
  baseUrl: string,
  address: string,
  chain: ApiChain = "eth"
): Promise<WalletAnalysis> {
  return apiRequest<WalletAnalysis>(baseUrl, "/security/analyze-wallet", {
    method: "POST",
    body: JSON.stringify({ address, chain }),
  });
}
