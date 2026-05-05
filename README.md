# Admin Dashboard — Next.js + MUI + Zustand

A full-stack admin panel built with **Next.js 16**, **Material UI v9**, and **Zustand**, consuming the [DummyJSON](https://dummyjson.com/) public API.

---

## Features

- **Authentication** — NextAuth v4 credentials provider backed by the DummyJSON login API. Session stored as a signed JWT cookie; user/token state mirrored to a Zustand store (also persisted to `localStorage`).
- **Route protection** — `proxy.js` (Next.js 16's replacement for `middleware`) redirects unauthenticated requests to `/login`.
- **Users** — Paginated, searchable table with a full detail page per user.
- **Products** — Paginated, searchable grid with category filter and a detail page featuring an image carousel, specs, and customer reviews.
- **Client-side caching** — Zustand stores cache API responses in memory keyed by `(search, category, page)`. Re-visiting a page never triggers a duplicate network request within the same session.
- **Performance** — `React.memo` on list row/card components; `useCallback` / `useMemo` on all event handlers and derived values.
- **Responsive UI** — Collapsible drawer on mobile, persistent sidebar on desktop.

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| UI | Material UI v9 + `@mui/material-nextjs` |
| State management | Zustand (with `persist` middleware) |
| Authentication | NextAuth v4 (credentials provider) |
| API | [dummyjson.com](https://dummyjson.com/) |

---

## Prerequisites

- **Node.js** 18.17 or later
- **npm** 9+ (or yarn / pnpm)

---

## Installation

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd venture

# 2. Install dependencies
npm install
```

---

## Environment Variables

Create a `.env.local` file in the project root (never commit this file):

```env
# Required — used by NextAuth to sign/verify JWT session tokens.
# Generate a strong random value:  openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-here

# Required — the canonical URL of your app.
# Use http://localhost:3000 for local development.
NEXTAUTH_URL=http://localhost:3000
```

> **Token storage**
> NextAuth stores the session as a signed JWT in a `next-auth.session-token` HTTP-only cookie (automatically upgraded to `__Secure-next-auth.session-token` over HTTPS in production). The `NEXTAUTH_SECRET` is the key used to sign this token — keep it secret and rotate it if compromised.
>
> On the client side, the Zustand `authStore` mirrors the session's `user` object and `accessToken` to `localStorage` under the key `auth-storage`. This lets any component read auth state without going through React context. Clear it by calling `clearSession()` on sign-out (already wired to the sidebar logout button).

---

## Running the App

```bash
# Development (hot reload)
npm run dev

# Production build
npm run build

# Start production server (requires a prior build)
npm start

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/login`.

---

## Demo Credentials

Use any user from the DummyJSON dataset. A few examples:

| Username | Password |
|---|---|
| `emilys` | `emilyspass` |
| `michaelw` | `michaelwpass` |
| `sophiab` | `sophiabpass` |

Full list: `GET https://dummyjson.com/users` (password pattern is `<username>pass`).

---

## Project Structure

```
app/
  (auth)/
    login/page.js           # Login page
  (dashboard)/
    layout.js               # Protected shell: sidebar + AppBar
    dashboard/page.js       # Dashboard home
    users/
      page.js               # Users list (table, search, pagination)
      [id]/page.js          # Single user detail
    products/
      page.js               # Products grid (search, category, pagination)
      [id]/page.js          # Single product (carousel, specs, reviews)
  api/auth/[...nextauth]/
    route.js                # NextAuth route handler
  layout.js                 # Root layout (MUI ThemeRegistry + SessionProvider)
  providers.js              # Client-side providers wrapper
  theme-registry.js         # MUI AppRouterCacheProvider + ThemeProvider

lib/
  auth.js                   # NextAuth config (DummyJSON credentials)
  store/
    auth-store.js           # Zustand auth store (persisted)
    users-store.js          # Zustand users store (in-memory cache)
    products-store.js       # Zustand products store (in-memory cache)

proxy.js                    # Route protection (Next.js 16 middleware)
```

---

## State Management — Why Zustand?

> Zustand was chosen over Redux for this project because:
>
> - **Zero boilerplate** — no actions, reducers, or slices; state and async logic live in one `create()` call.
> - **Built-in async** — `fetch` calls can be made directly inside store setters without middleware like redux-thunk.
> - **Tiny footprint** — < 1 kB gzipped, versus Redux Toolkit's ~15 kB.
> - **Persist middleware** — one-line localStorage sync with `persist()`.
> - **No Provider required** — state is accessible anywhere via a hook, without wrapping the tree.
>
> Redux Toolkit is a better choice for very large teams or apps with complex cross-slice relationships. For a small-to-medium dashboard like this, Zustand keeps things fast and readable.

---

## Caching Strategy

Each Zustand store (users, products) keeps an in-memory `cache` object keyed by a composite string of the current query parameters (search term + category + page offset). Before any network request, the store checks for a cache hit and loads data from it immediately — no spinner, no latency.

**Trade-off**: the cache is intentionally in-memory only (not persisted to localStorage) so stale data from a previous session is never shown. It resets on page reload, which is an acceptable cost for a dashboard consuming a live API.
