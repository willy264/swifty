import { apiRequest } from "./client";
import type { HealthResponse } from "@/lib/types";

export async function getServiceBanner(baseUrl: string): Promise<string> {
  return apiRequest<string>(baseUrl, "", {
    next: { revalidate: 60 },
  });
}

export async function getHealth(baseUrl: string): Promise<HealthResponse> {
  return apiRequest<HealthResponse>(baseUrl, "/health", {
    next: { revalidate: 60 },
  });
}
