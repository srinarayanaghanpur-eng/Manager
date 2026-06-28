// ---------------------------------------------------------------------------
// AI client switch.
//
// `AI_PROVIDER` env var selects the backend. With no key configured we return
// `mode: "mock"` and every generator falls back to built-in deterministic
// sample output, so the app is fully usable offline.
//
// To enable a real provider:
//   1. Set AI_PROVIDER=anthropic|openai|gemini and the matching *_API_KEY.
//   2. Implement the fetch call inside `callProvider` (server-side only — this
//      file must only ever be imported from a route handler / server action).
// ---------------------------------------------------------------------------

export type AIProvider = "mock" | "anthropic" | "openai" | "gemini";

export function getProvider(): AIProvider {
  const p = (process.env.AI_PROVIDER || "mock") as AIProvider;
  if (p === "anthropic" && !process.env.ANTHROPIC_API_KEY) return "mock";
  if (p === "openai" && !process.env.OPENAI_API_KEY) return "mock";
  if (p === "gemini" && !process.env.GEMINI_API_KEY) return "mock";
  return p;
}

/**
 * Server-side text completion. Returns null when running in mock mode so the
 * caller uses its local sample generator instead.
 */
export async function callProvider(prompt: string): Promise<string | null> {
  const provider = getProvider();
  if (provider === "mock") return null;

  // --- Anthropic example (uncomment & install @anthropic-ai/sdk) -----------
  // if (provider === "anthropic") {
  //   const res = await fetch("https://api.anthropic.com/v1/messages", {
  //     method: "POST",
  //     headers: {
  //       "x-api-key": process.env.ANTHROPIC_API_KEY!,
  //       "anthropic-version": "2023-06-01",
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       model: "claude-3-5-sonnet-latest",
  //       max_tokens: 1500,
  //       messages: [{ role: "user", content: prompt }],
  //     }),
  //   });
  //   const data = await res.json();
  //   return data?.content?.[0]?.text ?? null;
  // }

  return null;
}

export const isMockMode = () => getProvider() === "mock";
