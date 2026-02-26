export function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (env) return env;

  // In the browser, prefer relative URLs so Next.js can proxy via rewrites.
  // This avoids issues when the frontend dev server runs on a different port
  // (e.g. frontend on :3001 because backend uses :3000).
  if (typeof window !== "undefined") return "";

  // Server-side fallback (in case apiFetchJson is ever used from server code).
  return "http://localhost:3000";
}
