import { apiRequest } from "./client";
import type { TrendingCoin, PriceResponse } from "@/lib/types";

export async function getTrendingCoins(
  baseUrl: string
): Promise<TrendingCoin[]> {
  return apiRequest<TrendingCoin[]>(baseUrl, "/crypto/trending", {
    next: { revalidate: 300 },
  });
}

export async function getCoinPrice(
  baseUrl: string,
  coinId: string,
  vs = "usd"
): Promise<PriceResponse> {
  const search = new URLSearchParams({ vs });
  return apiRequest<PriceResponse>(
    baseUrl,
    `/crypto/price/${coinId}?${search.toString()}`,
    {
      next: { revalidate: 60 },
    }
  );
}
