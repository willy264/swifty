import { apiRequest } from "./client";
import type { TelegramAuthResponse } from "@/lib/types";

export async function authenticateTelegram(
  baseUrl: string,
  initData: string
): Promise<TelegramAuthResponse> {
  return apiRequest<TelegramAuthResponse>(baseUrl, "/auth/telegram", {
    method: "POST",
    body: JSON.stringify({ initData }),
  });
}
