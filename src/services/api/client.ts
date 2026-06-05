export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | JsonPrimitive[]
  | Record<string, JsonPrimitive | JsonPrimitive[]>;

export async function apiRequest<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit & {
    next?: { revalidate?: number | false };
  }
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message =
      (await response.text().catch(() => "")) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}
