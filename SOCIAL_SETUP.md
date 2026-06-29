# Connecting your real social accounts

This app shows **demo data** until you add API credentials. Credentials are read
only on the server (never sent to the browser). Put them in a file named
`.env.local` in the project root, then restart `npm run dev`.

Your accounts are already configured in `src/lib/data/socialConfig.ts`:

| School | Instagram | YouTube |
|---|---|---|
| Sri Narayana High School (Ghanpur) | [@sri_narayana_high_school](https://www.instagram.com/sri_narayana_high_school/) | — |
| Sri Adarshavani High School (Duggondi) | [@sri_adarshavani](https://www.instagram.com/sri_adarshavani/) | [@sriadarshavanihighschooldu7480](https://www.youtube.com/@sriadarshavanihighschooldu7480) |

---

## 1. YouTube — easy, free, ~5 minutes ✅

This gives **real** subscriber count, total views and your latest uploads.
It only reads **public** data, so no login/OAuth is needed — just a free key.

1. Go to <https://console.cloud.google.com/> and create (or pick) a project.
2. In **APIs & Services → Library**, search **"YouTube Data API v3"** and click **Enable**.
3. Go to **APIs & Services → Credentials → Create credentials → API key**.
4. Copy the key. (Recommended: click the key → **Restrict key** → restrict to *YouTube Data API v3*.)
5. Add it to `.env.local`:
   ```
   YOUTUBE_API_KEY=AIza...your-key...
   ```
6. Restart the dev server. Open **YouTube Studio** in the app — the badge turns
   green **"Live · YouTube API"** and the numbers are real.

> Free quota is 10,000 units/day — far more than this app needs.

---

## 2. Instagram — requires Meta setup ⚠️

Instagram has **no** way to read an account from its public URL. Live data needs
the Meta Graph API. This is more involved (Meta controls it), so do it when ready.

**Prerequisites**
1. Convert each Instagram account to a **Professional (Business or Creator)** account
   (Instagram app → Settings → Account type).
2. **Link each Instagram account to a Facebook Page** (Page → Settings → Linked accounts).

**Get the token + account ids**
3. Go to <https://developers.facebook.com/> → **Create App** → type **Business**.
4. Add the **Instagram Graph API** product.
5. Use the **Graph API Explorer** to grant these permissions:
   `instagram_basic`, `pages_show_list`, `pages_read_engagement`.
6. Generate a **long-lived access token** (short-lived tokens expire in ~1 hour;
   exchange it for a 60-day token — see Meta's "Long-Lived Tokens" docs).
7. Find each **IG Business account id**: call
   `GET /me/accounts` → get the Page id, then
   `GET /{page-id}?fields=instagram_business_account`.
8. Add everything to `.env.local`:
   ```
   INSTAGRAM_ACCESS_TOKEN=your-long-lived-token
   INSTAGRAM_IG_USER_ID_NARAYANA=178414...      # Sri Narayana's IG business id
   INSTAGRAM_IG_USER_ID_ADARSHAVANI=178415...   # Sri Adarshavani's IG business id
   ```
9. Restart the dev server. The Instagram code path activates automatically.

> Long-lived tokens expire after ~60 days and must be refreshed. For a permanent
> setup, use a **System User token** (Meta Business Settings) which doesn't expire.

---

## What's live vs demo right now

- The app reads live data through `/api/social` and the adapters in
  `src/lib/adapters/`. When a key/token is missing, that platform returns demo
  numbers and the UI shows a **"Demo data"** badge instead of **"Live"**.
- YouTube **watch-time hours** and Instagram **reach/impressions** need extra
  owner-level permissions (YouTube Analytics API / IG insights), so those
  specific fields stay approximate even when connected.
