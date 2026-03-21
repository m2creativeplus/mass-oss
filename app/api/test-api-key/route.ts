import { NextResponse } from "next/server"

// ============================================================
// MASS OSS - API Key Test Endpoint
// Tests AI provider API keys by making a minimal request
// ============================================================

const PROVIDER_ENDPOINTS: Record<string, { url: string; buildHeaders: (key: string) => HeadersInit; buildBody: () => string }> = {
  openai: {
    url: "https://api.openai.com/v1/models",
    buildHeaders: (key) => ({ Authorization: `Bearer ${key}` }),
    buildBody: () => "",
  },
  google: {
    url: "https://generativelanguage.googleapis.com/v1beta/models",
    buildHeaders: () => ({}),
    buildBody: () => "",
  },
  anthropic: {
    url: "https://api.anthropic.com/v1/messages",
    buildHeaders: (key) => ({
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    }),
    buildBody: () => JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 1,
      messages: [{ role: "user", content: "test" }],
    }),
  },
  mistral: {
    url: "https://api.mistral.ai/v1/models",
    buildHeaders: (key) => ({ Authorization: `Bearer ${key}` }),
    buildBody: () => "",
  },
  groq: {
    url: "https://api.groq.com/openai/v1/models",
    buildHeaders: (key) => ({ Authorization: `Bearer ${key}` }),
    buildBody: () => "",
  },
  cohere: {
    url: "https://api.cohere.ai/v1/models",
    buildHeaders: (key) => ({ Authorization: `Bearer ${key}` }),
    buildBody: () => "",
  },
  huggingface: {
    url: "https://huggingface.co/api/whoami-v2",
    buildHeaders: (key) => ({ Authorization: `Bearer ${key}` }),
    buildBody: () => "",
  },
}

export async function POST(request: Request) {
  try {
    const { provider, apiKey } = await request.json()

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: "Missing provider or apiKey" },
        { status: 400 }
      )
    }

    const config = PROVIDER_ENDPOINTS[provider]
    
    if (!config) {
      // For custom providers, just check if the key looks valid
      return NextResponse.json({
        status: apiKey.length > 10 ? "success" : "failed",
        message: apiKey.length > 10
          ? "Custom key format accepted (unable to verify without endpoint)"
          : "Key too short — minimum 10 characters required",
        latency: 0,
      })
    }

    // Build the request — Google uses query params
    let url = config.url
    const headers = config.buildHeaders(apiKey)
    const body = config.buildBody()
    const method = body ? "POST" : "GET"

    if (provider === "google") {
      url = `${config.url}?key=${apiKey}`
    }

    const startTime = Date.now()
    
    const response = await fetch(url, {
      method,
      headers,
      ...(body ? { body } : {}),
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    const latency = Date.now() - startTime

    if (response.ok || response.status === 200) {
      return NextResponse.json({
        status: "success",
        message: `${provider.toUpperCase()} API key is valid. Response in ${latency}ms.`,
        latency,
      })
    }

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json({
        status: "failed",
        message: `Invalid or expired API key. Status: ${response.status}`,
        latency,
      })
    }

    if (response.status === 429) {
      return NextResponse.json({
        status: "rate_limited",
        message: "API key is valid but rate-limited. Try again later.",
        latency,
      })
    }

    // Some providers return 400 for minimal requests but the auth passed
    if (response.status === 400 && provider === "anthropic") {
      return NextResponse.json({
        status: "success",
        message: `${provider.toUpperCase()} API key authenticated successfully. Response in ${latency}ms.`,
        latency,
      })
    }

    return NextResponse.json({
      status: "failed",
      message: `Unexpected response: ${response.status} ${response.statusText}`,
      latency,
    })

  } catch (error: any) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return NextResponse.json({
        status: "failed",
        message: "Connection timed out after 10 seconds. Check the provider URL or network.",
        latency: 10000,
      })
    }

    return NextResponse.json(
      { status: "failed", message: `Test failed: ${error.message}`, latency: 0 },
      { status: 500 }
    )
  }
}
