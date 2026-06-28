export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function nowISO() {
  return new Date().toISOString();
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export function platformLabel(p: string) {
  return ({
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
    whatsapp: "WhatsApp",
  } as Record<string, string>)[p] ?? p;
}

export function platformColor(p: string) {
  return ({
    instagram: "#E1306C",
    facebook: "#1877F2",
    youtube: "#FF0000",
    whatsapp: "#25D366",
  } as Record<string, string>)[p] ?? "#6366f1";
}

export function statusColor(s: string) {
  return ({
    idea: "#94a3b8",
    draft: "#f59e0b",
    ready: "#3b82f6",
    approved: "#22c55e",
    published: "#a855f7",
    waiting_for_approval: "#f59e0b",
    rejected: "#ef4444",
    new: "#3b82f6",
    contacted: "#f59e0b",
    visited: "#a855f7",
    joined: "#22c55e",
    not_interested: "#94a3b8",
    prospect: "#94a3b8",
    negotiating: "#f59e0b",
    active: "#22c55e",
    completed: "#a855f7",
    declined: "#ef4444",
  } as Record<string, string>)[s] ?? "#6366f1";
}

export function formatINR(n: number) {
  if (n >= 10_000_000) return "₹" + (n / 10_000_000).toFixed(2) + " Cr";
  if (n >= 100_000) return "₹" + (n / 100_000).toFixed(2) + " L";
  return "₹" + n.toLocaleString("en-IN");
}

export function prettyLabel(s: string) {
  return s
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
