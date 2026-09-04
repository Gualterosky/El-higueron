# Arquitectura del sistema — El Higuerón

> **Este documento es la fuente de verdad de la arquitectura.**
> Ver la directiva obligatoria para agentes de IA en `AGENTS.md`: antes de tocar
> Usuarios, Reservas o Comentarios/Publicaciones hay que leer este archivo, y
> después de cualquier cambio significativo hay que actualizarlo.

Última auditoría/refactor: 2026-08-31.

---

## 1. Visión general

Next.js 16 (App Router, Turbopack) + TypeScript + Neon Postgres (serverless) vía
Drizzle ORM + Better Auth (sesiones por cookie) + next-intl (es/en) + Tailwind v4
+ shadcn/Radix. Despliegue objetivo: Vercel.

```
Navegador
   │  (Server Components / Server Actions / fetch a /api/*)
   ▼
Next.js App Router (app/[locale]/**, app/api/**)
   │  server actions "use server" en lib/**/actions.ts
   │  queries de solo lectura en lib/**/queries.ts
   ▼
Drizzle ORM (lib/db/index.ts) ── HTTP ──▶ Neon Postgres (DATABASE_URL)
   ▲
   └─ Better Auth (lib/auth.ts) gestiona user/session/account/verification
      sobre las mismas tablas Drizzle (drizzleAdapter)
```

Dos servidores completamente separados conviven en el repo:
- **App principal** (raíz del repo): todo lo descrito en este documento.
- **`corporate-ai-chatbot/`**: sub-proyecto Vite/React independiente, con su
  propio `package.json`/`package-lock.json`/`vite.config.ts`. **No se importa
  desde ninguna parte de la app principal** (verificado por búsqueda de
  `corporate-ai-chatbot` en `app/`, `components/`, `lib/`: 0 resultados).
  ⚠️ **Observación / borrador sin terminar**: parece una prueba de concepto de
  chatbot corporativo, no integrada. No se ha borrado en esta pasada de
  limpieza porque eliminar un subproyecto completo con su propio historial es
  una operación destructiva que requiere confirmación explícita del equipo.
  Queda pendiente decidir si se integra, se archiva o se borra.

---

## 2. Estructura del proyecto

```
app/
  [locale]/                 Rutas públicas + paneles, todas bajo prefijo de idioma (/es, /en)
    admin/                  Panel administrador (requiere role="administrador")
    staff/                  Panel staff (requiere role="staff"|"administrador") — en borrador
    cuenta/                 Panel del visitante autenticado — en borrador
    muro/, boulder/, camping/  Páginas públicas de contenido + formularios de publicación
    reservas/               Formulario público de reservas
    login/, registro/, cambiar-contrasena/  Flujo de autenticación
  api/
    auth/[...all]/route.ts  Handler de Better Auth (todas las rutas /api/auth/*)
    chat/route.ts           Endpoint del chatbot (OpenAI) con persistencia opcional
components/
  admin/, staff/, cuenta/, panel/   Paneles por rol (client components)
  muro/, camping/, boulder/, posts/ UI de publicaciones y respuestas (comentarios)
  auth/                    Formularios de login/registro/cambio de contraseña
  ui/                      Primitivas shadcn/Radix (no editar salvo necesidad real)
lib/
  auth.ts, auth-client.ts   Instancia de Better Auth (servidor) y su cliente
  auth/                     session.ts (guardas de página), guards.ts (guardas de
                            Server Actions), roles.ts, actions.ts, user-actions.ts
  db/                       schema.ts (Drizzle) + index.ts (cliente Neon)
  muro/, camping/, boulder/ post-actions.ts (mutaciones) + post-queries.ts (lecturas)
  replies/                  Comentarios/respuestas a publicaciones (todas las familias)
  reservas/                 actions.ts, queries.ts, types.ts
  posts/shared.ts           Vocabulario y validación compartida entre las 3 familias de posts
  site-settings*.ts         Modo mantenimiento + secciones ocultas del sitio
  chat/                     Server actions/queries del historial del chatbot
  eventos/                  Sistema de eventos configurable para /evento
i18n/                       Configuración de next-intl (routing, request, navigation)
messages/                   es.json / en.json — todos los textos de la UI
drizzle/                    Migraciones SQL generadas + snapshot de metadatos
proxy.ts                    Middleware: locale routing + guard de cookie de sesión
```

---

## 3. Modelos de datos (`lib/db/schema.ts`)

Todas las tablas son Postgres `pgTable` vía Drizzle. Los `id` son `text` (uuid
generado con `crypto.randomUUID()`), no hay `serial`.

| Tabla | Rol | Relaciones / notas |
|---|---|---|
| `user` | Cuenta de usuario (Better Auth + campos propios) | `role` (`administrador`\|`staff`\|`visitante`), `banned`, `mustChangePassword` |
| `session` | Sesión activa (Better Auth) | FK `userId → user.id` (cascade) |
| `account` | Credenciales por proveedor (Better Auth) | FK `userId → user.id` (cascade) |
| `verification` | Tokens de verificación (Better Auth) | — |
| `siteSettings` | Fila única (`id = "default"`) con `maintenanceMode` y flags `hide*` por sección | — |
| `climbPost` | Publicación de ascenso en el Muro | `routeId` referencia lógica a `MURO_ROUTES` (no FK real) |
| `campingPost` | Publicación de experiencia de camping | — |
| `boulderPost` | Publicación de ascenso en Boulder | `boulderName`/`routeName` referencian `BOULDERS` (no FK real) |
| `postReply` | Comentario/respuesta a **cualquier** publicación | `postType` (`muro`\|`camping`\|`boulder`) + `postId` — clave lógica compuesta, sin FK real (las publicaciones viven en 3 tablas distintas) |
| `reservation` | Solicitud de reserva (camping/muro/boulder) | `type`, `status` (`pending`\|`confirmed`\|`cancelled`) |
| `chatSession` / `chatMessage` | Historial del chatbot público | FK `chatMessage.sessionId → chatSession.id` (cascade) |

**Nota de diseño importante:** `climbPost`/`campingPost`/`boulderPost`/`postReply`
usan columnas `text` para `status`/`postType`/`type` en vez de `pgEnum`. Esto es
intencional (Better Auth y Drizzle push/generate son más simples así), pero
significa que **la validez de esos valores se garantiza solo en la capa de
aplicación** (`lib/posts/shared.ts`, `lib/reservas/types.ts`), nunca en la BD.
Cualquier función que lea estas columnas debe tratarlas como `string` no
confiable y usar los type guards (`isReservationStatus`, `postStatusSchema`,
etc.) antes de usarlas como si fueran el union type — así se evita que un valor
inesperado en BD rompa el render (ver `admin-reservations-panel.tsx`).

**Pendiente de rendimiento (no aplicado en esta pasada, requiere decisión sobre
ventana de mantenimiento):** ninguna tabla tiene índices explícitos más allá de
la PK. Candidatos priorizados:
- `postReply(post_type, post_id)` — es el filtro principal de `getApprovedRepliesByPosts`.
- `climbPost(route_id)`, `boulderPost(boulder_name)` — filtro principal de las páginas públicas.
- `climbPost(status)`, `campingPost(status)`, `boulderPost(status)`, `postReply(status)`, `reservation(status)` — usados en casi toda query pública (`ne(status, "hidden")`).
- `chatMessage(session_id)`, `session(user_id)` — ya cubiertos parcialmente por el uso como FK pero sin índice explícito en Postgres (las FK no crean índice automáticamente).

Para aplicarlos: añadir `.index()`/`index()` en `schema.ts`, luego
`pnpm db:generate` y `pnpm db:migrate`.

---

## 4. Autorización — cómo proteger código nuevo

Hay **dos capas independientes** y ambas son necesarias:

1. **Guardas de página** (`lib/auth/session.ts`): `requireRole(locale, roles)`
   se llama en `layout.tsx`/`page.tsx` de rutas protegidas y **redirige** si no
   corresponde. Protege la navegación, no las Server Actions.
2. **Guardas de Server Action** (`lib/auth/guards.ts`): `getModeratorSession()`
   (admin+staff) y `getAdminSession()` (solo admin) — devuelven `null` si no
   autorizado, **sin redirigir** (una Server Action no puede redirigir al
   caller, debe devolver un resultado de error).

   ⚠️ **Regla crítica:** una Server Action exportada (`"use server"`) es un
   endpoint HTTP público independiente del árbol de componentes que la
   importa. Que solo se use desde una página protegida **no la protege**.
   Toda Server Action que lea datos sensibles o mute contenido debe empezar
   verificando `getModeratorSession()`/`getAdminSession()`. Antes de esta
   auditoría, `updatePostStatusAction`, `deletePostAction` y sus equivalentes
   en camping/boulder/replies, además de `getChatMessagesAction`, no tenían
   ninguna verificación — corregido en este refactor.

- Moderación de contenido (aprobar/ocultar/borrar publicaciones y respuestas):
  **administrador y staff** (`MODERATOR_ROLES` en `lib/auth/guards.ts`).
- Gestión de usuarios (`lib/auth/user-actions.ts`) y configuración del sitio
  (`lib/site-settings/actions.ts`): **solo administrador**.
- Historial del chatbot (`getChatMessagesAction`): **solo administrador**
  (puede contener datos de contacto de visitantes).

---

## 5. Flujo de datos — Usuarios

```
components/admin/admin-users-panel.tsx (client)
   │ createUserAction / updateUserAction / deleteUserAction / resetUserPasswordAction
   ▼
lib/auth/user-actions.ts ("use server")
   │ requireAdmin() vía auth.api.getSession (Better Auth)
   │ - createUserAction  → auth.api.createUser (Better Auth admin plugin)
   │ - updateUserAction  → valida "no quitar admin al último admin" → db.update(user)
   │ - resetUserPasswordAction → auth.api.setUserPassword + mustChangePassword=true
   │ - deleteUserAction  → bloquea borrar administradores → db.delete(user)
   ▼
Neon Postgres: tabla `user` (+ `session`/`account` en cascade)
```

- El login/registro/cambio de contraseña usan `authClient` (`lib/auth-client.ts`,
  cliente de Better Auth) directamente desde `components/auth/*`, sin pasar por
  Server Actions propias, excepto el cambio de contraseña forzado
  (`lib/auth/actions.ts::completeForcedPasswordChange`).
- `proxy.ts` (middleware) es la primera línea de defensa: si la cookie de
  sesión de Better Auth no existe y la ruta empieza por `/admin`, `/staff`,
  `/cuenta` o `/cambiar-contrasena`, redirige a `/login` **antes** de que se
  renderice cualquier Server Component.
- La página ya renderizada vuelve a verificar con `requireRole` (defensa en
  profundidad: cookies pueden ser manipuladas, el middleware solo revisa que
  exista, no que sea válida).

---

## 6. Flujo de datos — Reservas

```
components/reservation-form.tsx (client, usado en /reservas y como CTA en /camping)
   │ react-hook-form + zod (validación instantánea en el navegador)
   │ submitReservationAction(input)
   ▼
lib/reservas/actions.ts ("use server")
   │ reservationSchema (zod) — MISMA fuente de verdad de validación, no confía
   │ en lo que ya validó el cliente. Verifica:
   │   - tipo ∈ RESERVATION_TYPES, fechas ISO válidas, fecha de llegada no pasada,
   │     salida >= llegada, límites de longitud/cantidad de personas
   │ db.insert(reservation) con status="pending"
   ▼
Neon Postgres: tabla `reservation`
   ▲
   │ lib/reservas/queries.ts::getAllReservations() (solo lectura, sin paginar)
   │
app/[locale]/admin/reservas/page.tsx → components/admin/admin-reservations-panel.tsx
   (tabla de solo lectura; los botones "confirmar"/"cancelar" están deshabilitados
    — ver sección "Borradores" más abajo)
```

- `lib/reservas/types.ts` centraliza `RESERVATION_TYPES`, `ACTIVITY_CATEGORIES`
  y `RESERVATION_STATUSES` — es el único lugar que hay que tocar si se agrega
  un nuevo tipo de reserva o estado.
- `staff/reservas` y `cuenta/reservas` son **paneles de borrador** (tablas
  esqueleto, sin conexión a `getAllReservations`) — ver sección 9.

---

## 7. Flujo de datos — Comentarios y publicaciones (Muro / Camping / Boulder)

Hay dos conceptos relacionados pero distintos:
- **Publicación** ("post"): reseña con calificación de 1-5 estrellas, enviada
  desde la página de una ruta/experiencia (`climbPost`, `campingPost`,
  `boulderPost`).
- **Respuesta/comentario** ("reply"): comentario sin calificación, enviado como
  respuesta a una publicación concreta (`postReply`, compartida entre las 3
  familias vía `postType` + `postId`).

```
components/muro/ascent-form.tsx (o camping-post-form / boulder-post-form)
   │ submit*PostAction(data)     [público, sin auth — cualquier visitante puede publicar]
   ▼
lib/{muro,camping,boulder}/post-actions.ts ("use server")
   │ zod schema (lib/posts/shared.ts: httpsUrlSchema, mediaUrlsSchema)
   │ db.insert(*Post) con status="pending"
   ▼
Neon Postgres: climbPost / campingPost / boulderPost
   ▲
   │ lib/{muro,camping,boulder}/post-queries.ts::getApproved*()
   │   WHERE status != 'hidden'   (pendientes SÍ se muestran públicamente hoy;
   │   solo lo "hidden" se oculta — comportamiento intencional existente)
   ▼
components/{muro,camping,boulder}/*-publications.tsx (Server Component, noStore())
   │ + lib/replies/reply-queries.ts::getApprovedRepliesByPosts(postType, postIds)
   │   (una sola query SQL con `inArray` + `eq(postType)`, no trae toda la tabla)
   ▼
components/posts/post-reply-section.tsx (client)
   │ submitReplyAction(data)     [público, sin auth]
   ▼
lib/replies/reply-actions.ts ("use server") → postReply
```

Moderación (solo administrador/staff, ver sección 4):

```
components/admin/admin-posts-panel.tsx
   │ update*PostStatusAction(id, status) / delete*PostAction(id)
   │ updateReplyStatusAction(id, status) / deleteReplyAction(id)
   ▼
lib/{muro,camping,boulder}/post-actions.ts y lib/replies/reply-actions.ts
   │ getModeratorSession() → si null, aborta (ver sección 4)
   │ zod postStatusSchema valida el status recibido
   ▼
Neon Postgres → revalidatePath("/", "layout")
```

**Vocabulario compartido:** `lib/posts/shared.ts` define `POST_STATUSES`,
`POST_TYPES` y los schemas zod reutilizados por las 3 familias de posts y por
replies. Si se agrega una 4ª familia de contenido moderable, debe usar este
archivo en vez de redefinir su propio enum de status.

---

## 8. Flujo del Chatbot (contexto, no forma parte del alcance de Usuarios/Reservas/Comentarios pero comparte infraestructura)

```
components/chat-bot.tsx (client) → POST /api/chat
   ▼
app/api/chat/route.ts
   │ valida longitud de mensaje y recorta el historial (MAX_MESSAGE_LENGTH,
   │ MAX_HISTORY_MESSAGES)
   │ getSystemInstructions(locale) — lee public/Memoria_Camping_El_Higueron*.md
   │   una sola vez por locale y lo cachea en memoria (knowledgeCache)
   │ getOpenAiClient() — cliente OpenAI singleton (no se recrea por request)
   │ openai.chat.completions.create(...)
   │ logChatMessage() — best-effort, nunca rompe la respuesta al usuario
   ▼
Neon Postgres: chatSession / chatMessage
   ▲
   │ lib/chat/chat-queries.ts::getAllChatSessions() (admin, con conteo de mensajes)
   │ lib/chat/chat-actions.ts::getChatMessagesAction(sessionId) — SOLO ADMIN
   ▼
components/admin/admin-chat-panel.tsx
```

Los mensajes de error devueltos al navegador son genéricos (`chatErrors`
localizados); no se reenvían mensajes internos de la API de OpenAI ni stack
traces al cliente.

---

## 9. Borradores / trabajo en progreso (no completar sin pedir confirmación)

Detectado durante la auditoría — **no se ha tocado la lógica de negocio de
estos paneles**, solo se documenta su estado:

- `components/staff/staff-reservas-panel.tsx` y
  `components/cuenta/cuenta-reservas-panel.tsx`: tablas 100% esqueleto
  (`SKELETON_ROWS` hardcodeado), no leen `getAllReservations()`. Badge
  "comingSoon" visible en la UI.
- `components/cuenta/cuenta-publicaciones-panel.tsx`: estado vacío estático,
  sin conexión a ninguna query real.
- `components/admin/admin-reservations-panel.tsx`: los botones de
  confirmar/cancelar reserva están con `disabled` — **no existe todavía**
  `updateReservationStatusAction`. Si se implementa, debe seguir el mismo
  patrón de guardas que `lib/replies/reply-actions.ts` (verificar
  `getModeratorSession()`/`getAdminSession()` según a quién se le quiera dar
  permiso).
- `corporate-ai-chatbot/`: sub-proyecto Vite no integrado (ver sección 1).
- Página de **aviso legal** (`/aviso-legal`): solicitada como **borrador
  pendiente**. Los datos del prestador ya están centralizados en
  `lib/legal-info.ts` y exhibidos en el footer (`Footer.legal.line`) y en
  `/contacto` (`Contacto.legal`); falta crear la página legal y enlazarla
  desde el footer.
- `app/[locale]/evento`: el sistema de eventos (`lib/eventos/*`) soporta un
  flag `esBorrador` por evento (`EventoBorradorAviso`) — es una funcionalidad
  completa, no un borrador de código, pero vale la pena saber que un evento
  puede marcarse como borrador desde `lib/eventos/config.ts`.

---

## 10. Glosario rápido — dónde está la lógica de negocio

| Necesito... | Está en... |
|---|---|
| Cambiar reglas de quién puede moderar contenido | `lib/auth/guards.ts` (`MODERATOR_ROLES`) |
| Cambiar validación de un formulario público (reservas, posts, replies) | `lib/reservas/actions.ts`, `lib/{muro,camping,boulder}/post-actions.ts`, `lib/replies/reply-actions.ts` — el zod schema en cada archivo es la fuente de verdad del servidor |
| Agregar un nuevo tipo/estado de reserva | `lib/reservas/types.ts` |
| Agregar un nuevo status/tipo de publicación | `lib/posts/shared.ts` |
| Cambiar qué secciones del sitio se pueden ocultar / modo mantenimiento | `lib/site-settings/types.ts` (lista) + `lib/site-settings.ts` (lógica) + `lib/site-settings/actions.ts` (Server Actions, solo admin) |
| Cambiar el esquema de la base de datos | `lib/db/schema.ts` → `pnpm db:generate` → `pnpm db:migrate` |
| Cambiar reglas de acceso a rutas por rol | `lib/auth/roles.ts` (`canAccessPath`, `homePathForRole`) + `proxy.ts` (prefijos protegidos) |
| Ver todos los textos/traducciones de la UI | `messages/es.json`, `messages/en.json` |
| Configurar el evento activo de `/evento` | `lib/eventos/config.ts` (estructura) + `messages/*.json` bajo `Evento.content` (textos) |
| Cambiar datos legales del prestador (razón social, NIT, RNT) | `lib/legal-info.ts` — fuente única; los textos/etiquetas viven en `messages/*.json` (`Footer.legal`, `Contacto.legal`) |

---

## 11. Comandos de verificación

```
pnpm lint    # ESLint (eslint-config-next 16, flat config en eslint.config.mjs)
pnpm build   # Next build — falla si hay errores de compilación/páginas
```

`next.config.mjs` tiene `typescript.ignoreBuildErrors: true`: **el build NO
falla por errores de tipos**, solo por errores de compilación/bundling. Es
deuda técnica pre-existente; para atraparlos hay que correr `tsc --noEmit`
manualmente (no hay script `pnpm typecheck` todavía — considerar añadirlo).
