import { apiRequest } from "./client";
import type { NotificationSendResponse, NotificationType } from "@/lib/types";

export async function sendNotification(
  baseUrl: string,
  input: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
  }
): Promise<NotificationSendResponse> {
  return apiRequest<NotificationSendResponse>(
    baseUrl,
    "/notifications/send",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
}
