"use client";

import { useState } from "react";
import { GlassCard, PageHeader, ConsentWarning, Button, Field } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useTheme } from "@/components/ThemeProvider";
import { isFirebaseConfigured, applyFirebaseConfig, clearFirebaseConfig, type FirebaseConfig } from "@/lib/firebase";
import { seedFirestore } from "@/lib/data/service";
import { users, currentUser } from "@/lib/data/seed";
import { prettyLabel } from "@/lib/utils";

const ROLE_PERMS: Record<string, string[]> = {
  super_admin: ["Approve & reject content", "Delete content", "Manage schools & roles", "Mark as published"],
  social_manager: ["Plan content", "Edit schools", "Submit for approval", "Manage leads"],
  content_creator: ["Create ideas & drafts", "Submit for approval", "Upload media"],
  viewer: ["View dashboards & analytics (read-only)"],
};

const integrations = [
  { name: "Instagram Graph API", env: "INSTAGRAM_ACCESS_TOKEN", icon: "Instagram" },
  { name: "Facebook Pages API", env: "FACEBOOK_PAGE_TOKEN", icon: "Facebook" },
  { name: "YouTube Data API", env: "YOUTUBE_API_KEY", icon: "Youtube" },
];

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg(null);
    const res = await seedFirestore();
    setSeedMsg({ ok: res.ok, text: res.message });
    setSeeding(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Roles, integrations, theme and safety policy." />

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard hover={false}>
          <h3 className="mb-3 font-semibold">Appearance</h3>
          <button onClick={toggle} className="flex w-full items-center justify-between rounded-xl glass p-3">
            <span className="flex items-center gap-2 text-sm"><Icon name={theme === "dark" ? "Moon" : "Sun"} className="h-4 w-4" /> {theme === "dark" ? "Dark mode" : "Light mode"}</span>
            <span className="text-xs text-brand-400">Toggle</span>
          </button>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="mb-3 font-semibold">System status</h3>
          <Status label="Firebase" ok={isFirebaseConfigured} okText="Live" offText="Mock mode" />
          <Status label="AI provider" ok={false} okText="Live" offText="Mock responses" />
        </GlassCard>
      </div>

      <FirebaseConfigCard onSeed={handleSeed} seeding={seeding} seedMsg={seedMsg} />

      <GlassCard hover={false}>
        <h3 className="mb-3 font-semibold">Users & roles</h3>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex flex-col gap-2 rounded-xl glass p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">{u.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium">{u.name} {u.id === currentUser.id && <span className="text-[10px] text-brand-400">(you)</span>}</p>
                  <p className="text-[11px] text-muted">{u.email}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-xs text-brand-300">{prettyLabel(u.role)}</span>
                <p className="mt-1 text-[10px] text-muted">{ROLE_PERMS[u.role]?.length} permissions</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {Object.entries(ROLE_PERMS).map(([role, perms]) => (
            <div key={role} className="rounded-xl glass p-3">
              <p className="text-xs font-semibold">{prettyLabel(role)}</p>
              <ul className="mt-1 space-y-0.5 text-[11px] text-muted">{perms.map((p) => <li key={p}>• {p}</li>)}</ul>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="mb-3 font-semibold">Social integrations</h3>
        <div className="space-y-2">
          {integrations.map((i) => (
            <div key={i.env} className="flex items-center justify-between rounded-xl glass p-3">
              <span className="flex items-center gap-2 text-sm"><Icon name={i.icon} className="h-4 w-4" /> {i.name}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-muted">Not connected (mock)</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted">Adapters live in <code>src/lib/adapters/</code>. This app never auto-posts — official APIs are read-only here and publishing is always a manual, approved action.</p>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="mb-3 font-semibold">Child safety policy</h3>
        <ConsentWarning>
          Student photos/videos require signed parent consent before any public post. The app does not auto-post, auto-like, auto-comment, auto-follow or spam. All publishing is manual and admin-approved.
        </ConsentWarning>
      </GlassCard>
    </div>
  );
}

function FirebaseConfigCard({
  onSeed, seeding, seedMsg,
}: {
  onSeed: () => Promise<void>;
  seeding: boolean;
  seedMsg: { ok: boolean; text: string } | null;
}) {
  const [jsonInput, setJsonInput] = useState("");
  const [parseMsg, setParseMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonInput) as FirebaseConfig;
      if (!parsed.apiKey || !parsed.projectId) {
        setParseMsg({ ok: false, text: "Config must include apiKey and projectId at minimum." });
        return;
      }
      applyFirebaseConfig(parsed);
      setParseMsg({ ok: true, text: "Config saved! Reloading page to initialize Firebase…" });
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      setParseMsg({ ok: false, text: "Invalid JSON. Paste the full Firebase config object from your project settings." });
    }
  };

  const handleClear = () => {
    clearFirebaseConfig();
    setParseMsg({ ok: true, text: "Config cleared. Reloading…" });
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <GlassCard hover={false}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`grid h-9 w-9 place-items-center rounded-xl ${isFirebaseConfigured ? "bg-emerald-400/15 text-emerald-400" : "bg-amber-400/15 text-amber-400"}`}>
            <Icon name="Settings" className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold">Firebase Connection</h3>
            <p className="text-[11px] text-muted">{isFirebaseConfigured ? "Firestore is live" : "Using mock/seed data"}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-xs ${isFirebaseConfigured ? "text-emerald-400" : "text-amber-300"}`}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: isFirebaseConfigured ? "#22c55e" : "#f59e0b" }} />
          {isFirebaseConfigured ? "Connected" : "Disconnected"}
        </span>
      </div>

      {!isFirebaseConfigured ? (
        <div className="space-y-3">
          <p className="text-xs text-muted">
            Paste your Firebase Web App config JSON below. Find it in your Firebase Console → Project Settings → General → Your apps → Web app → SDK setup &gt; Config.
          </p>
          <textarea
            rows={5}
            className="w-full px-3 py-2 text-xs font-mono"
            placeholder='{"apiKey":"AIza...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"1:..."}'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleApply} disabled={!jsonInput.trim()}>
              <Icon name="Settings" className="h-4 w-4" /> Apply &amp; Reload
            </Button>
          </div>
          {parseMsg && (
            <p className={`rounded-xl p-2.5 text-xs ${parseMsg.ok ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-200"}`}>
              {parseMsg.text}
            </p>
          )}
          <details className="text-[11px] text-muted">
            <summary className="cursor-pointer hover:text-current">Or set via .env.local</summary>
            <pre className="mt-2 rounded-xl bg-white/5 p-3 leading-relaxed">
{`NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=1:your_app_id:web:hash`}
            </pre>
          </details>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted">Firebase is live. You can seed Firestore with the app&apos;s mock data to get started, or clear the config to return to mock mode.</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onSeed} disabled={seeding}>
              <Icon name="Sparkles" className="h-4 w-4" /> {seeding ? "Seeding…" : "Seed Firestore with mock data"}
            </Button>
            <Button variant="soft" onClick={handleClear}>
              <Icon name="X" className="h-4 w-4" /> Clear &amp; revert to mock
            </Button>
          </div>
          {seedMsg && (
            <p className={`rounded-xl p-2.5 text-xs ${seedMsg.ok ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-200"}`}>
              {seedMsg.text}
            </p>
          )}
        </div>
      )}
    </GlassCard>
  );
}

function Status({ label, ok, okText, offText }: { label: string; ok: boolean; okText: string; offText: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl glass p-2.5 text-sm">
      <span>{label}</span>
      <span className={`flex items-center gap-1.5 text-xs ${ok ? "text-emerald-400" : "text-amber-300"}`}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: ok ? "#22c55e" : "#f59e0b" }} />
        {ok ? okText : offText}
      </span>
    </div>
  );
}
