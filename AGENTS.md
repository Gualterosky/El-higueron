# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router project. Route pages live in `app/`, with feature routes such as `app/muro/`, `app/camping/`, `app/evento/`, and auth under `app/login/` (and future `app/auth/` callbacks). Shared UI lives in `components/`; reusable shadcn/Radix primitives are in `components/ui/`. Shared logic belongs in `lib/`, including the Neon + Drizzle database layer in `lib/db/` and event configuration in `lib/eventos/`. Static images, videos, logos, and route-guide text files are stored under `public/`, especially `public/media/`.

## Build, Test, and Development Commands

Use pnpm because this repo includes `pnpm-lock.yaml`.

- `pnpm install` installs dependencies.
- `pnpm dev` starts the local Next.js development server.
- `pnpm build` creates a production build and catches many route/type issues.
- `pnpm start` serves the production build after `pnpm build`.
- `pnpm lint` runs `eslint .`.
- `pnpm db:generate` generates SQL migrations from `lib/db/schema.ts`.
- `pnpm db:migrate` applies migrations to Neon.
- `pnpm db:push` pushes the schema directly (handy while prototyping).
- `pnpm db:studio` opens Drizzle Studio against `DATABASE_URL`.

## Coding Style & Naming Conventions

Write TypeScript and TSX with strict type checking enabled. Prefer the `@/` path alias for local imports, for example `@/components/ui/button` or `@/lib/utils`. Use lowercase, hyphenated route folders in `app/` for public URLs, and keep route-specific components close to their route when they are not reused elsewhere. Shared React components use PascalCase exports from kebab-case files, such as `components/whatsapp-button.tsx`.

Follow the existing shadcn configuration: `new-york` style, Radix primitives, Tailwind CSS variables, and lucide icons. Keep utility class composition readable and use helpers from `lib/utils.ts` where appropriate.

## Testing Guidelines

No dedicated test framework is currently configured. For now, validate changes with `pnpm lint` and `pnpm build`. When adding tests, place them near the code they cover using clear names such as `component-name.test.tsx` or add an explicit test directory only if a broader test setup is introduced.

## Commit & Pull Request Guidelines

Recent history uses short, imperative or descriptive commit messages, sometimes in Spanish, for example `Update page.tsx` and `Base de datos y pagina de login`. Keep commits focused and describe the visible change.

Pull requests should include a concise summary, relevant screenshots for UI changes, notes about affected routes, and any required environment variables (especially `DATABASE_URL` for Neon). Link issues when applicable and mention the commands run, especially `pnpm lint` and `pnpm build`.

## Security & Configuration Tips

Do not commit secrets or local environment files. Copy `.env.example` to `.env.local` and set `DATABASE_URL` (Neon Postgres URI) and other keys there. Database access lives in `lib/db/` and is server-only — use it from Server Components, Server Actions, or Route Handlers, never from client components. Store public assets in `public/`, but avoid adding oversized media unless it is required by a page.
