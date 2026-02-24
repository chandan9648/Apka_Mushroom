import { apiBaseUrl } from "./config";

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, opts?: { code?: string; details?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = opts?.code;
    this.details = opts?.details;
  }
}

export type ApiErrorPayload = { message?: string; code?: string; details?: unknown };

export async function apiFetchJson<T>(
  path: string,
  init?: RequestInit & { token?: string }
): Promise<T> {
  const url = `${apiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) headers.set("Content-Type", "application/json");
  if (init?.token) headers.set("Authorization", `Bearer ${init.token}`);

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: "include",
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? ((await res.json()) as unknown) : await res.text();

  if (!res.ok) {
    const payload = (typeof body === "object" && body != null ? (body as ApiErrorPayload) : undefined) ?? undefined;
    throw new ApiError(payload?.message || `Request failed (${res.status})`, res.status, {
      code: payload?.code,
      details: payload?.details,
    });
  }

  return body as T;
}
