# Repository Guidelines

> **INSTRUCCIÓN CRÍTICA PARA AGENTES DE IA:**
> Antes de proponer o ejecutar cualquier cambio arquitectónico, crear nuevas funciones, o modificar el flujo de datos de Usuarios, Reservas o Comentarios, DEBES leer obligatoriamente el archivo `system_architecture.md` para entender el contexto global del sistema.
> Además, por cada cambio significativo que realices en el código (nuevas entidades, cambio en los flujos, nuevas dependencias), DEBES actualizar `system_architecture.md` para reflejar la realidad del sistema. Nunca dejes que el código y la documentación se desincronicen.

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

**Do NOT run any `git` commands** — no `git add`, `git commit`, `git push`, or similar. The developer handles all commits and pushes to GitHub manually. Only write and edit files; leave version control entirely to the user.

## Security & Configuration Tips

Do not commit secrets or local environment files. Copy `.env.example` to `.env.local` and set `DATABASE_URL` (Neon Postgres URI) and other keys there. Database access lives in `lib/db/` and is server-only — use it from Server Components, Server Actions, or Route Handlers, never from client components. Store public assets in `public/`, but avoid adding oversized media unless it is required by a page.

## Comando `/optimizacion`

Cuando el usuario escriba en el chat exactamente `/optimizacion`, trátalo como si hubiera enviado el siguiente prompt completo y ejecútalo:

> Anteriormente desarrollaste este proyecto web, el cual ya cuenta con módulos funcionales de gestión de usuarios, sistema de reservas, comentarios entre muchas mas funciones. El código actual funciona, pero necesita ser auditado y preparado para escalar.
>
> **Tu Tarea:**
> Realizar una refactorización profunda y optimización del código existente, eliminando la deuda técnica, y simultáneamente crear una documentación viva de la arquitectura.
>
> Ejecuta los siguientes pasos en orden:
>
> ### 1. Auditoría y Refactorización (Optimización del Código)
> Analiza toda la base de código actual e implementa mejoras directas:
> *   **Código Muerto:** Identifica y elimina variables, importaciones, funciones o componentes que ya no se utilizan.
> *   **Eficiencia:** Reescribe funciones ineficientes (ej. consultas N+1 en la base de datos, bucles anidados innecesarios, o renderizados excesivos en el frontend).
> *   **Prevención de Bugs:** Busca edge cases no manejados, posibles fugas de memoria, o validaciones faltantes en los endpoints de reservas y comentarios, y soluciónalos.
> *   **Rendimiento:** Aplica buenas prácticas de optimización (lazy loading, indexación de BD, memoización, limpieza de dependencias).
>
> ### 2. Actualizacion de Documentación Arquitectónica (`system_architecture.md`)
> A medida que analizas y limpias el código, modifica un archivo llamado `system_architecture.md` en la raíz del proyecto. Este archivo debe ser extremadamente detallado y contener:
> *   **Estructura del Proyecto:** Árbol de directorios principal y propósito de cada capa.
> *   **Flujo de Datos (Data Flow):** Explicación paso a paso de cómo viaja la información desde el frontend hasta la base de datos en los 3 flujos principales (Usuarios, Reservas, Comentarios).
> *   **Modelos de Datos:** Estructura de las tablas/colecciones clave y sus relaciones.
> *   **Glosario de Funciones Core:** Dónde encontrar la lógica de negocio crítica para facilitar futuros cambios.
>
> **Reglas de Ejecución:**
> *   Procede a realizar los cambios en el código archivo por archivo.
> *   Si encuentras un bug crítico o un cambio que rompa la compatibilidad (breaking change), explícamelo brevemente antes de aplicar la solución.
> *   No rompas la funcionalidad actual de la gestión de usuarios, reservas, comentarios u otras funciones durante la optimización.
> *   Hay cosas que estan en borrador, funciones en desarrollo no terminadas que aun estan en proceso, si los encuentras deja la observacion para tenerlo en cuenta mas adelante.
