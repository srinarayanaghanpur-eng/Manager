"use client";

import { GlassCard, PageHeader, ConsentWarning } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useTheme } from "@/components/ThemeProvider";
import { isFirebaseConfigured } from "@/lib/firebase";
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
          <Status label="Firebase" ok={isFirebaseConfigured} okText="Configured" offText="Mock mode (no keys)" />
          <Status label="AI provider" ok={false} okText="Live" offText="Mock responses" />
          <p className="mt-2 text-[11px] text-muted">Add keys in <code>.env.local</code> to go live. The app runs fully on mock data until then.</p>
        </GlassCard>
      </div>

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
