# NCreate Site

Production frontend for the NCreate Minecraft server. It reuses the existing NCEA Supabase Auth, `profiles`, and `user_roles`, while all NCreate content and forum data live in isolated additive `ncreate_*` tables.

## Stack

TanStack Start/Router, React 19, TypeScript, Vite, Tailwind CSS 4, TanStack Query, Supabase JS, Zod, React Hook Form, Motion.

## Local development

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Environment variables (values are never committed):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Only the browser-safe publishable key is accepted. Never expose `service_role` in this application.

## Checks and build

```bash
pnpm check
pnpm start
```

Database migrations are in `supabase/migrations`. Deployments use the separate Vercel project `ncreate-site` in the existing AdminPanelHunmaster team.
