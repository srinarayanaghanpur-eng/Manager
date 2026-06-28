import { NextResponse } from "next/server";
import { callProvider, getProvider } from "@/lib/ai/client";

// Server-side AI endpoint. Keeps API keys off the client.
// In mock mode it returns { mode: "mock" } and the client uses local generators.
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const provider = getProvider();
    if (provider === "mock") {
      return NextResponse.json({ mode: "mock", text: null });
    }
    const text = await callProvider(String(prompt ?? ""));
    return NextResponse.json({ mode: provider, text });
  } catch (e) {
    return NextResponse.json({ mode: "error", text: null }, { status: 500 });
  }
}
