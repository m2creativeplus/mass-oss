import { ConvexHttpClient } from "convex/browser";

// Lazy-initialized Convex HTTP client for API routes.
// Defers creation until first request to avoid build-time crash
// when NEXT_PUBLIC_CONVEX_URL is not yet available.
let _client: ConvexHttpClient | null = null;

export function getConvexClient(): ConvexHttpClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error(
        "NEXT_PUBLIC_CONVEX_URL is not set. Check your environment variables."
      );
    }
    _client = new ConvexHttpClient(url);
  }
  return _client;
}
