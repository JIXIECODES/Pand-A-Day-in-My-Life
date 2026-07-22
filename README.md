# Pand-A Day in My Life

A React + Vite productivity companion where a cozy panda reacts to goals, focus sessions, journal memories, streaks, rewards, outfits, decorations, and seasonal room changes.

## Tech stack

- React 18 + Vite
- Tailwind CSS
- dayjs
- Supabase Authentication and PostgreSQL for signed-in accounts
- localStorage for guest progress and signed-in offline cache

## Features

- Home dashboard with today’s goals, panda support, progress, focus tools, and wellbeing check-ins
- Calendar planning with time-blocked, daily, and long-term goals
- Panda mood, XP, levels, streaks, outfits, decorations, rewards, and achievements
- Journal memories and account preferences
- Email/password accounts with persistent sessions
- Guest mode for device-only progress
- Offline-friendly account cache with automatic cloud retry

## Run locally

1. Install dependencies:

```bash
pnpm install
```

2. Copy `.env.example` to `.env`.
3. Add the two public frontend values described below.
4. Start Vite:

```bash
pnpm dev
```

The repository uses `pnpm-lock.yaml`. The production build is:

```bash
pnpm build
```

## Supabase setup

### 1. Create the database table and security policies

In the Supabase dashboard:

1. Open **SQL Editor**.
2. Create a new query.
3. Copy the complete contents of `supabase/migrations/202607220001_create_user_data.sql`.
4. Run the query once.

The migration creates `public.user_data`. Each authenticated user has one versioned JSON snapshot identified by their Supabase user ID. Row Level Security is enabled and forced. Separate select, insert, update, and delete policies require `auth.uid() = user_id`, and the anonymous database role has no table privileges.

The snapshot includes every existing app storage category:

- Dated, daily, long-term, and time-blocked goals
- Calendar entries and category colors
- Journal entries
- Panda mood, happiness, energy, XP, levels, streaks, and completion history
- Daily rewards and daily tasks
- Achievements
- Unlocked and equipped outfits
- Unlocked decorations
- Theme, timezone, notification, timer, capacity, wellbeing, and resilience preferences

### 2. Enable email/password authentication

In **Authentication → Providers → Email**:

1. Enable the Email provider.
2. Keep **Allow new users to sign up** enabled.
3. Choose whether users must confirm their email.

If email confirmation is enabled, sign-up shows a friendly “check your email” message and the account becomes available after confirmation.

### 3. Configure authentication URLs

In **Authentication → URL Configuration**:

- Set **Site URL** to the GitHub Pages URL:

```text
https://jixiecodes.github.io/Pand-A-Day-in-My-Life/
```

- Add these **Redirect URLs** for development and production:

```text
http://localhost:5173/Pand-A-Day-in-My-Life/
http://127.0.0.1:5173/Pand-A-Day-in-My-Life/
https://jixiecodes.github.io/Pand-A-Day-in-My-Life/
```

The app calculates its email-confirmation redirect from Vite’s `BASE_URL`, so the same code works locally and on GitHub Pages.

### 4. Add local environment variables

In **Project Settings → API** or the project **Connect** dialog, copy:

- The project URL
- The frontend publishable key, or the legacy public `anon` key

Paste them into your local `.env` file:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Put the project URL after `VITE_SUPABASE_URL=` and the frontend publishable key after `VITE_SUPABASE_PUBLISHABLE_KEY=`.

Do not use a database password, Supabase account password, service-role key, secret API key, or personal access token. Vite variables are included in the public browser bundle, so only the public frontend key belongs here. The local `.env` file is ignored by Git.

### 5. Add GitHub Actions secrets

In the GitHub repository, open **Settings → Secrets and variables → Actions → Secrets → New repository secret**.

Create these two repository secrets with the exact names:

- `VITE_SUPABASE_URL` — project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — frontend publishable key

The Pages workflow passes these values only to the Vite build step. Do not add a service-role key or database password.

### 6. Deploy

Push to `main` or manually run **Build and deploy Vite site to Pages** from the Actions tab. The existing Vite base path and hash navigation remain compatible with GitHub Pages.

## Authentication and protected pages

Supabase restores browser sessions automatically. While the session is loading, the app shows a friendly loading screen. Users without a Supabase session see Login or Sign Up instead of application pages.

Guest mode remains available intentionally and stores data only in that browser. Logging out returns to the protected login screen.

## Local progress migration and offline behavior

For a signed-in account, Supabase is the cloud source of truth and localStorage is an offline cache.

On the first successful sign-in to an empty cloud account:

1. Existing cache for that Supabase user ID is preferred.
2. Progress from the older email-scoped profile is considered next.
3. Guest progress is considered only if that account has not completed migration.
4. The source snapshot is copied to `user_data`.
5. Only after the cloud save succeeds is the migrated guest or legacy source removed.

If the network or SQL setup is unavailable, the source remains intact and the app retries later. Existing cloud data is never overwritten by guest migration. Optimistic timestamp checks prevent a stale browser cache from silently overwriting a newer cloud snapshot.

The legacy browser-only account implementation stored local credentials insecurely. Startup removes those old credential records without deleting goals or panda progress.

## Test two separate accounts

Use two email addresses you control.

1. Create Account A, confirm its email if required, and log in.
2. Add a uniquely named goal, journal entry, or panda customization.
3. Wait until the account status says it is saved, then log out.
4. Create or log into Account B.
5. Confirm that Account A’s unique data is absent.
6. Add different data to Account B and log out.
7. Log back into Account A and confirm its original data returns while Account B’s data remains absent.
8. Optionally open one account in a normal window and the other in a private window to verify session and local-cache isolation.
9. In Supabase **Table Editor → user_data**, confirm there is one row for each account. Do not edit `auth.users` manually.

For an RLS check, while signed in as either account, the browser client should receive only that account’s row. The frontend never receives permission to query another user’s snapshot.

## Security notes

- No private credentials are committed.
- The service-role key is never used in the React app or GitHub Pages workflow.
- Supabase Auth handles password storage; the app never stores account passwords.
- The public frontend key identifies the Supabase project but does not bypass Row Level Security.
- `public.user_data` rejects anonymous access and isolates authenticated rows by `auth.uid()`.