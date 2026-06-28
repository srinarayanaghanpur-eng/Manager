# EduSocial AI Manager

An AI-powered social media manager for two schools:

- **Sri Narayana High School** — Ghanpur
- **Sri Adarshavani High School** — Duggondi

It helps you plan content, find school-safe trending ideas, generate captions and reel scripts, manage an approval workflow, track admissions leads, and watch growth — **without ever auto-posting**. Every post is a draft until an admin approves it.

> 🛡️ **Safety by design:** the app never auto-likes, auto-comments, auto-follows or spams. Social APIs are read-only here. Publishing is always a manual, admin-approved action. Student photos require parent-consent confirmation before public use.

---

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Firebase (Auth / Firestore / Storage) · PWA · mobile-first glassmorphism UI with dark/light mode.

## Runs out of the box (mock mode)

The app is built to run **with no keys at all**. Firebase and the AI providers fall back to local mock/seed data, so you can explore everything immediately.

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Features / pages

| Page | What it does |
|------|--------------|
| **Dashboard** | Planned/published counts, pending approvals, follower growth (both schools), platform cards, today's tasks, weekly content score, leads. |
| **Schools** | Edit both school profiles: branch, logo, brand colors, contact, links, followers, audience, tone. |
| **AI Agents** | 10 agents (Trend Finder, Reel Script, Caption, Hashtag, Poster Prompt, YouTube Growth, Facebook Reach, Admissions Lead, Weekly Strategy, Analytics Insight). Each has an input form, generate, output card, copy / export / save-to-calendar. |
| **Content Ideas** | Pick school/platform/type/goal/language/tone → 10 ideas + reel script, voiceover, caption, hashtags, thumbnail text, shot list, Canva & video prompts, CTA, safety notes. |
| **Calendar** | Month/week views, drag-and-drop, color by platform, status & platform filters. |
| **Approvals** | Draft → Waiting → Approved / Rejected / Published. Approve, reject with comment, mark published with link. Admin-only actions. |
| **Media Library** | Upload & tag photos/videos/logos/posters with per-file consent status and child-safety warnings. |
| **Analytics** | Mock metrics (reach, engagement, views, watch time…), top 5 posts, school growth comparison, and an AI weekly analysis. |
| **Leads** | Admissions enquiry tracker with status pipeline + AI follow-up (WhatsApp / call script / reminder / trust message). |
| **Monetization** | YouTube & Facebook monetization progress, sponsorship & local-collab opportunities. |
| **Settings** | Roles & permissions, integration status, theme, child-safety policy. |

## Project structure

```
src/
  app/                 # App Router pages + /api/ai route
  components/          # AppShell, nav, ThemeProvider, reusable UI, Icon
  lib/
    types.ts           # shared domain types
    firebase.ts        # guarded Firebase init (mock-safe)
    utils.ts
    ai/                # generateContentIdea / generateCaption / generateReelScript /
                       # generateWeeklyStrategy / generateAnalyticsInsight /
                       # generateLeadFollowup / generateTrendIdeas + runAgent + client
    adapters/          # instagram / facebook / youtube (mock; read-only; no publish)
    data/              # seed.ts (mirrors Firestore collections) + agents.ts
firestore.rules        # role-based security rules
public/                # manifest.json, sw.js (PWA)
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you have. Anything left blank stays in mock mode.

```
# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# AI (server-side only — never exposed to the browser)
AI_PROVIDER=mock          # mock | anthropic | openai | gemini
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
```

## Connecting Firebase (optional)

1. Create a Firebase project; enable **Authentication**, **Firestore**, **Storage**.
2. Paste the web config into `.env.local`.
3. Deploy the rules in `firestore.rules` (admins approve/delete; creators draft; viewers read).
4. Create these collections: `users, schools, socialAccounts, contentIdeas, contentCalendar, approvals, mediaLibrary, analyticsMock, leads, weeklyReports, agentOutputs, settings`. The shapes match `src/lib/data/seed.ts`, so you can seed directly from it.

## Connecting real AI (optional)

Set `AI_PROVIDER` + the matching key. Implement the provider call in `src/lib/ai/client.ts` (`callProvider`) — there's a ready-to-uncomment Anthropic example. The client UI calls `/api/ai`, so keys never reach the browser.

## Connecting social APIs later (optional)

Implement the real calls in `src/lib/adapters/{instagram,facebook,youtube}.ts`. The adapters share one interface (`getMetrics`, `getRecentPosts`) so the UI doesn't change. **Note:** there is intentionally no `publish()` — posting stays manual and approved.

## User roles

Super Admin · Social Media Manager · Content Creator · Viewer. Permissions are enforced in the UI and in `firestore.rules` (only Super Admin can approve or delete).

## PWA

`public/manifest.json` + `public/sw.js` make the app installable. Add `icon-192.png` and `icon-512.png` under `public/icons/` for full install support (the service worker registers only in production builds).

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add the env vars from `.env.example`.
4. Deploy. (It also deploys fine with zero env vars, in mock mode.)

---

Built for Ananth — Sri Narayana High School (Ghanpur) & Sri Adarshavani High School (Duggondi).
