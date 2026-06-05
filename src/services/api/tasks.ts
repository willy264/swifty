import { apiRequest } from "./client";
import type { AirdropTask } from "@/lib/types";

export async function getUserTasks(
  baseUrl: string,
  userId: string
): Promise<AirdropTask[]> {
  return apiRequest<AirdropTask[]>(baseUrl, `/tasks/${userId}`, {
    next: { revalidate: 30 },
  });
}

export async function ensureChecklist(
  baseUrl: string,
  userId: string,
  airdropId: string
): Promise<AirdropTask[]> {
  return apiRequest<AirdropTask[]>(baseUrl, "/tasks/checklist", {
    method: "POST",
    body: JSON.stringify({ userId, airdropId }),
  });
}

export async function updateTask(
  baseUrl: string,
  input: {
    taskId: string;
    status?: "pending" | "in_progress" | "completed";
    progress?: number;
  }
): Promise<AirdropTask> {
  return apiRequest<AirdropTask>(baseUrl, "/tasks/update", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
