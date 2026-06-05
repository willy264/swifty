import { apiRequest } from "./client";
import type { ReferralsResponse } from "@/lib/types";

export async function getReferrals(
  baseUrl: string,
  userId: string
): Promise<ReferralsResponse> {
  return apiRequest<ReferralsResponse>(baseUrl, `/referrals/${userId}`, {
    next: { revalidate: 60 },
  });
}
