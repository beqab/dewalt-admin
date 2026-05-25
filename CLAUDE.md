# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev       # start development server (localhost:3000)
pnpm build     # production build
pnpm lint      # run ESLint
```

There is no test suite. The package manager is **pnpm**.

## Architecture

### Stack
Next.js 16 (App Router) · TypeScript · TanStack Query v5 · next-auth v5 · Tailwind CSS v4 · Radix UI / shadcn-style components · Sonner (toasts) · TipTap (rich text) · Vercel Blob (image storage)

### Route structure
All protected pages live under `app/dashboard/`. The root `app/page.tsx` redirects to `/dashboard`. Auth lives at `app/login/`. The only API route in this app is `app/api/upload/route.ts` (proxies file uploads to Vercel Blob). All other data comes from the external backend.

### Auth (`lib/auth.ts`, `proxy.ts`)
- next-auth v5 with `Credentials` provider. Login hits `POST /admin/login` on the backend.
- JWT strategy: access token stored in the session, refresh token stored in an `httpOnly` cookie.
- Token refresh runs inside the `jwt` callback when `Date.now() > tokenExpiresAt`. A deduplication map (`refreshPromises`) prevents concurrent refresh races.
- `proxy.ts` is actually the **Next.js middleware** (misnamed). It protects all routes except `/login` and `/api/auth/*`. A 401 response from the API triggers `signOut` and redirects to `/login`.

### API layer (`lib/apiClient.ts`, `lib/apiRoutes.ts`)
`APIClient` is a generic class that wraps axios. Instantiate it with `createApiClient(API_ROUTES.SOME_ROUTE)` and call `.get()`, `.post()`, `.put()`, `.patch()`, `.patchById()`, `.delete()`. The axios interceptor attaches the bearer token from the next-auth session to every request.

All backend endpoint paths are defined as constants in `lib/apiRoutes.ts`. Add new routes there first.

In development the base URL is `http://localhost:3000/` (the dev proxy). In production it reads `NEXT_PUBLIC_API_URL`.

### Feature modules (`features/`)
Every domain area follows the same structure:

```
features/<domain>/
  index.ts          ← barrel export (types, service, hooks, components)
  types/            ← TypeScript interfaces / DTOs
  services/         ← APIClient calls, one service object per domain
  hooks/            ← TanStack Query hooks (useQuery / useMutation wrappers)
  components/       ← React components scoped to this feature
  schemas/          ← Yup/Zod validation schemas (where present)
```

Pages import everything from the barrel (`@/features/<domain>`). Do not import from sub-paths directly.

### TanStack Query
- All query keys are defined in `lib/querykeys.ts`. Always use `QUERY_KEYS.*` — never inline string arrays.
- `QueryProvider` wraps the app at `components/queryProvider.tsx`.

### Category hierarchy
The `categories` feature manages three nested levels: **Brand → Category → Child Category**. The slug `"all"` is reserved for child categories.

### Shared components
- `components/ui/` — Radix-based primitives (Button, Input, Dialog, Table, Sidebar, etc.)
- `components/rich-text-editor.tsx` — TipTap editor, dynamically imported (no SSR) to avoid hydration issues
- `components/uploadImage/` — image picker that POSTs to `/api/upload` and returns a Vercel Blob URL
- `components/pagination.tsx` — shared pagination control
- `components/dashboard-layout.tsx` — sidebar + shell for all dashboard pages

### UI language
All user-facing strings in the UI are in **Georgian**. Keep this consistent when adding new UI text.

### Environment variables
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL in production |
| `NEXTAUTH_SECRET` | next-auth JWT signing secret |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token |
