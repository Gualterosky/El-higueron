# Arquitectura del sistema — El Higuerón

> **Este documento es la fuente de verdad de la arquitectura.**
> Ver la directiva obligatoria para agentes de IA en `AGENTS.md`: antes de tocar
> Usuarios, Reservas o Comentarios/Publicaciones hay que leer este archivo, y
> después de cualquier cambio significativo hay que actualizarlo.

Última auditoría/refactor: 2026-09-18 (índices de BD aplicados a nivel de esquema, ver sección 14).
Auditoría anterior: 2026-09-15 (limpieza de errores de tipos reales, ver sección 13).
Auditoría anterior: 2026-09-06 (fix de detección de idioma, ver sección 2.1).

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

Solo hay **un** servidor/app en el repo (raíz): todo lo descrito en este
documento.

~~**`corporate-ai-chatbot/`**~~ — eliminado el 2026-09-15 (ver sección 13).
Era un sub-proyecto Vite/React de un prototipo de chatbot exportado de Google
AI Studio, con su propio `package.json`/servidor Express, nunca importado
desde la app principal (0 referencias en `app/`, `components/`, `lib/`). El
chatbot real que ven los visitantes es `components/chat-bot.tsx` +
`app/api/chat/route.ts` (ver sección 8), sin relación con ese subproyecto.

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
  storage/r2.ts             Cliente de Cloudflare R2 (imágenes estáticas del sitio, sección 15)
i18n/                       Configuración de next-intl (routing, request, navigation)
messages/                   es.json / en.json — todos los textos de la UI
drizzle/                    Migraciones SQL generadas + snapshot de metadatos
proxy.ts                    Middleware: locale routing + guard de cookie de sesión
```

---

## 2.1 Detección de idioma (i18n)

Rutas siempre con prefijo (`localePrefix: "always"` en `i18n/routing.ts`): toda
página vive bajo `/es/...` o `/en/...`.

**Prioridad de resolución de idioma** (implementada en `proxy.ts`, que envuelve
al middleware de `next-intl`):

1. Prefijo explícito ya presente en la URL (`/es/...`, `/en/...`).
2. Cookie propia `USER_LOCALE` (constante `USER_LOCALE_COOKIE` en
   `i18n/routing.ts`) — **solo se escribe cuando el usuario elige manualmente**
   un idioma con el botón ES/EN (`components/language-switcher.tsx`, función
   `rememberUserLocale`). Si existe, `proxy.ts` redirige a esa versión antes de
   invocar el middleware de `next-intl`.
3. Si no hay prefijo ni cookie propia, el middleware de `next-intl` detecta por
   el header `Accept-Language` del navegador/SO (`localeDetection: true`,
   default).
4. `defaultLocale: "es"` como último recurso.

⚠️ **Importante**: `i18n/routing.ts` tiene `localeCookie: false` a propósito.
Por defecto, `next-intl` guarda automáticamente una cookie `NEXT_LOCALE` la
primera vez que resuelve un idioma (aunque sea por detección automática), y esa
cookie queda fija para siempre en ese navegador, ignorando cambios futuros del
idioma real del dispositivo. Esto causaba el bug reportado: un usuario
colombiano con teléfono en español que alguna vez abría un link que caía en
`/en/...` (link compartido desde un navegador en inglés, resultado de Google
indexado en `/en`, navegador in-app de WhatsApp/Instagram con
`Accept-Language` poco confiable, etc.) quedaba con el sitio en inglés para
siempre, y viceversa con turistas extranjeros. Al desactivar
`localeCookie` y manejar la persistencia nosotros mismos solo en la elección
manual, cualquier visita nueva sin idioma en la URL siempre vuelve a confiar en
el idioma real del sistema operativo/navegador, salvo que el usuario haya
elegido explícitamente lo contrario.

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
| `siteAnnouncement` | Fila única (`id = "default"`) con el pop-up de noticias: `enabled`, textos es/en (título, subtítulo, cuerpo, CTA), `ctaUrl`/`ctaNewTab`, `imageUrl`/`imageAlt`, ventana `startsAt`/`endsAt`, `frequency`, `delaySeconds`, `version` | `version` se auto-incrementa al cambiar el contenido para volver a mostrar el pop-up a quien ya lo cerró |
| `climbPost` | Publicación de ascenso en el Muro | `routeId` referencia lógica a `MURO_ROUTES` (no FK real) |
| `campingPost` | Publicación de experiencia de camping | — |
| `boulderPost` | Publicación de ascenso en Boulder | `problemIds` (array) es la fuente de verdad desde 2026-09; `boulderName`/`routeName` son legacy (texto libre en filas viejas, ids crudos en filas nuevas) — ver sección 7 |
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

**Índices aplicados (2026-09-18, ver sección 14):** `schema.ts` ahora declara
explícitamente, vía el 3er argumento de `pgTable`, los índices que antes eran
solo una recomendación:
- `postReply(post_type, post_id)` + `postReply(status)`.
- `climbPost(route_id)` + `climbPost(status)`.
- `boulderPost(boulder_name)` + `boulderPost(status)`.
- `campingPost(status)`, `reservation(status)`.
- `chatMessage(session_id)`, `session(user_id)`.

Migración generada en `drizzle/0012_cultured_cardiac.sql` (solo `CREATE INDEX`,
no destructiva, no reescribe datos) y **ya aplicada a Neon** con `pnpm db:push`
(autorizado explícitamente por el usuario el 2026-09-18).

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

**Categorías de publicación (`category` + `urgencyLevel`, añadido 2026-09):**
Las 3 tablas de posts (`climbPost`/`campingPost`/`boulderPost`) tienen además
`category` (`text`, default `"review"`) y `urgencyLevel` (`text`, nullable).
`lib/posts/shared.ts` centraliza:
- `POST_CATEGORIES` = `incident | review | tip | question` — se elige en el
  formulario público (`components/posts/post-category-field.tsx`, reutilizado
  por `ascent-form.tsx`, `camping-post-form.tsx` y `boulder-post-form.tsx`).
  ⚠️ **Cambio 2026-09:** existía una 5ª categoría, `"suggestion"`, con su
  propio botón en el selector. Se fusionó dentro de `"review"` (reseña y
  sugerencia son la misma retroalimentación del visitante — el formulario de
  reseña ahora invita explícitamente a incluir sugerencias de mejora en el
  comentario) y se eliminó el botón. Como `category` es una columna `text`
  sin `CHECK` (ver nota de diseño arriba), cualquier fila antigua que ya
  tenga `category = "suggestion"` sigue en la base de datos; para no
  romper su renderizado, `lib/posts/shared.ts::normalizePostCategory(value)`
  es la única forma correcta de leer `category` desde la BD — mapea
  `"suggestion"` (y cualquier valor inesperado) a `"review"`. Se usa en los
  4 Server Components de publicaciones (`route-publications.tsx`,
  `camping-publications.tsx`, `boulder-publications.tsx`,
  `boulder-block-publications.tsx`) y en `admin-posts-panel.tsx`, en vez del
  cast `as PostCategory` que había antes. Los formularios y el zod del
  servidor (`postCategorySchema`) ya no aceptan `"suggestion"` como valor de
  entrada nuevo.
- `CATEGORY_REQUIRES_RATING` (`"review"`) y `CATEGORY_REQUIRES_URGENCY`
  (`"incident"`) — solo esas categorías muestran/exigen, respectivamente, el
  selector de estrellas o el selector de urgencia (`UrgencyLevelField`); el
  resto guarda `rating = 0` y `urgencyLevel = null`. La validación condicional
  vive tanto en el zod del cliente (cada formulario) como en el zod del
  servidor (`lib/{muro,camping,boulder}/post-actions.ts`, vía `superRefine`) —
  nunca confiar solo en el cliente.
- `URGENCY_LEVELS` (`low | medium | high | critical`) + `URGENCY_RANK` — usado
  para ordenar los incidentes de mayor a menor urgencia.

**Feed público con prioridad de incidentes:** `components/posts/post-feed.tsx`
(`PostFeed`, client component) es el listado compartido por
`route-publications.tsx`, `camping-publications.tsx`, `boulder-publications.tsx`
y `boulder-block-publications.tsx`. Cada Server Component sigue haciendo el
fetch (`getApproved*`) y arma un array de `FeedPost` (con `meta`/`media`/
`replies` ya renderizados como JSX) que le pasa a `PostFeed`. `PostFeed`
agrega tabs de filtro por categoría y, en la vista "todas", ordena los
incidentes primero (por `URGENCY_RANK`) manteniendo el resto en el orden que
ya trae la query (`createdAt desc`). `admin-posts-panel.tsx` aplica la misma
lógica de orden (`sortPostsByPriority`) y muestra un badge de
categoría/urgencia junto al badge de estado, para que administración y staff
vean los reportes urgentes primero.

**Filtro por categoría en el panel de administración (añadido 2026-09):**
`admin-posts-panel.tsx` reutiliza el mismo vocabulario (`PostCategories` en
`messages/*.json`) que el feed público para exponer el mismo filtrado en el
panel de moderación:
- El hook interno `useCategoryFilter(posts)` calcula conteos por categoría
  (normalizando con `normalizePostCategory`) y filtra + ordena por prioridad
  (`sortPostsByPriority`) según la categoría activa. Se usa igual en las 3
  listas (`MuroPostsList`/`CampingPostsList`/`BoulderPostsList`).
- `CategoryFilterBar` (chips "Todas/Incidente/Reseña/Tip/Pregunta" con
  conteo) se renderiza arriba de cada lista, igual que en `PostFeed`.
- Cada `TabsTrigger` de nivel superior (Muro/Camping/Boulder) muestra además
  un `IncidentCountBadge` (ícono de alerta + número) cuando esa familia tiene
  incidentes pendientes de revisar, para que el admin note prioridad sin
  necesidad de abrir la pestaña.
- No hubo cambios de esquema ni de Server Actions: es solo UI/filtrado en el
  cliente sobre datos que ya llegaban con `category`/`urgencyLevel`.

**Recomendaciones de rutas/bloques por dificultad (añadido 2026-09):** cada
página de detalle de una ruta del Muro (`/muro/[routeId]`) y de un bloque de
Boulder (`/boulder/[boulderId]`) muestra, **debajo de las publicaciones y
antes del formulario de registro**, un bloque de hasta 3 categorías de
sugerencias — "nivel similar", "sube de nivel" (progresión) y "para
descansar" (relax) — calculadas en el servidor a partir del grado de
dificultad, sin ningún dato de usuario:

- **Muro** (`lib/muro/route-recommendations.ts` +
  `components/muro/route-recommendations.tsx`): parsea el grado YDS de cada
  `MuroRouteMeta.level` (`parseGradeRank`, letra a/b/c/d como fracción del
  tier) y agrupa por tier entero. Rutas con `subLevels` (`MBS14`, `MBS15`)
  usan el más fácil de sus sub-niveles para compararse (`getEffectiveRank`).
  Las rutas `level: "Proyecto"` (`MBS03`, `MBS06`) no tienen grado numérico:
  se tratan como el tier más difícil pero indefinido — solo hacen match
  "similar" entre sí, y son la sugerencia de "progresión" para quien esté en
  la ruta numerada más difícil (`5.13a`). `getRouteRecommendations(routeId)`
  se llama desde `RoutePageLayout` (`RouteRecommendations` justo después de
  `RoutePublications`).
- **Boulder** (`lib/boulder/boulder-recommendations.ts` +
  `components/boulder/boulder-recommendations.tsx`): a diferencia de una
  ruta del Muro, un bloque de boulder (`BoulderMeta`) agrupa varios
  problemas que pueden tener grados V distintos (ej. `BLDR04` tiene
  V4/V6/V8), así que no hay un solo grado por bloque sino un **rango**
  (`getBoulderGradeRange` = mín/máx de los V-grades parseables de sus
  `problems`, vía `parseVGrade`). "Similar" = otros bloques cuyo rango se
  solapa con el actual; "progresión" = bloques cuyo mínimo está por encima
  del máximo actual (el más cercano primero); "relax" = bloques cuyo máximo
  está por debajo del mínimo actual. Se llama desde `BoulderPageLayout`
  (`BoulderRecommendations` dentro de la misma columna que
  `BoulderBlockPublications`, justo debajo).
- **Sin historial de usuario:** no existe ninguna tabla que vincule un
  usuario/sesión con ascensos completados (las publicaciones son anónimas,
  ver sección 7). Ambas funciones (`getRouteRecommendations`/
  `getBoulderRecommendations`) aceptan un parámetro opcional
  `completedRouteIds`/`completedBoulderIds` que, si se pasa, empuja esos ids
  al final de cada categoría en vez de excluirlos — la firma queda lista
  para una futura función de historial, pero **ningún caller la usa hoy**.
  Implementar esa personalización real requeriría relacionar `user`/sesión
  con ascensos, lo cual es un cambio de flujo de Usuarios/Reservas que debe
  decidirse explícitamente antes de tocarlo (ver directiva en `AGENTS.md`).
- Sin cambios de esquema ni de Server Actions: toda la lógica es derivada en
  memoria de `MURO_ROUTES`/`BOULDERS` (datos estáticos en `lib/`), no de la
  base de datos.

**Vista agregada de publicaciones del muro + selector multi-ruta (añadido
2026-09):** hasta ahora cada publicación de `climbPost` estaba atada a
exactamente una ruta (`routeId`, `NOT NULL`), y la única forma de ver
publicaciones era entrar a la página de esa ruta específica
(`/muro/[routeId]`). Se agregó una vista agregada en la página principal
`/muro` que muestra **todas** las publicaciones de las 15 rutas en un solo
lugar, con filtro por tipo (igual que en cada ruta) y además filtro por
ruta, e indica en cada publicación a qué ruta(s) pertenece (con link directo
a esa ruta). Esto requirió permitir que una publicación pueda etiquetar
0, 1 o varias rutas a la vez:

- **Esquema:** `climbPost` ganó una columna nueva `routeIds` (`text[]`,
  nullable). La columna `routeId` (legacy, `NOT NULL`) se conserva por
  compatibilidad: sigue guardando la primera ruta seleccionada (o `""` si
  el visitante no marcó ninguna), pero **ya no es la fuente de verdad** — es
  `routeIds` quien guarda el conjunto completo. Cualquier código nuevo que
  necesite saber a qué rutas pertenece un post debe usar `routeIds` con
  fallback a `[routeId]` si `routeIds` es null (ver
  `getApprovedPostsByRoute`/`AllRoutesPublications` para el patrón). Los
  valores son ids de `MURO_ROUTES`, opcionalmente con sufijo `-<subLevel>`
  (ej. `"MBS14-5.9"`) para las rutas con niveles (`MBS14`, `MBS15`).
  - ⚠️ La migración se generó con `pnpm db:generate` pero `pnpm db:migrate`
    falló en este entorno porque el migrador de `drizzle-kit` usa un driver
    por websocket que requiere el paquete `ws` (no instalado). Se aplicó con
    `pnpm db:push` en su lugar (mismo resultado para este cambio aditivo de
    una sola columna). Si se necesita `db:migrate` en el futuro, instalar
    `ws` como dependencia de desarrollo.
- **Formulario (`components/muro/ascent-form.tsx`):** el campo de ruta pasó
  de un `<Select>` de una sola ruta obligatoria a un multi-select opcional
  (`routeIds: string[]`, puede quedar vacío = "comentario general"). La UI es
  un dropdown (`components/posts/multi-select-popover.tsx`, Popover + Command
  con checkboxes) donde el visitante puede marcar varias rutas sin que la
  lista se cierre en cada clic; al cerrarla, las rutas elegidas quedan como
  chips removibles debajo. Este mismo componente se reutiliza para el filtro
  por ruta en la vista agregada.
  - Cuando el formulario se usa dentro de una página de ruta específica
    (`RoutePageLayout` → `/muro/[routeId]`), se le pasa
    `defaultRouteIds={[routeId]}` para preseleccionar esa ruta (el visitante
    puede añadir más o quitarla). En la página agregada `/muro` se usa sin
    `defaultRouteIds` (arranca vacío).
  - `lib/muro/routes.ts::getMuroRouteOptions()` centraliza la lista de
    valores seleccionables (una entrada por ruta, o por sub-nivel en
    `MBS14`/`MBS15`); `getRouteBaseId`/`getRouteSubLevel` separan el id base
    del sufijo de sub-nivel para volver a armar links/traducciones.
- **Validación (`lib/muro/post-actions.ts`):** `submitSchema.routeIds` es un
  array opcional (`.default([])`, máx. 20). Al insertar, `routeId` (legacy)
  se rellena con `routeIds[0] ?? ""` y `routeIds` se guarda completo (o
  `null` si el array quedó vacío).
- **Queries (`lib/muro/post-queries.ts`):** `getApprovedPostsByRoute(routeId)`
  ahora hace `EXISTS (SELECT 1 FROM unnest(route_ids) ...)` además del match
  legacy sobre `route_id`, para que una ruta específica siga mostrando tanto
  posts viejos (un solo `routeId`) como nuevos (con varias `routeIds`). Se
  agregó `getApprovedPosts()` (sin filtrar por ruta) para la vista agregada.
- **Vista agregada (`components/muro/all-routes-publications.tsx` +
  `app/[locale]/muro/page.tsx`):** sigue el mismo patrón que ya usaban
  `/boulder` y `/camping` (sección con `<PostFeed>` a la izquierda y el
  formulario a la derecha), pero es la primera en pasarle a `<PostFeed>` las
  nuevas props opcionales `routeFilters`/`routeFilterLabel`/
  `routeFilterPlaceholder` y en poblar `FeedPost.routeIds`. Cada publicación
  muestra un link (`next-intl` `<Link>`) por cada ruta etiquetada hacia
  `/muro/<baseId>`; si no tiene ninguna, muestra la etiqueta
  "Comentario general" (`Muro.posts.noRoute`).
  - `components/posts/post-feed.tsx` (compartido por muro/camping/boulder)
    ganó ese segundo filtro de forma **opt-in**: si el caller no pasa
    `routeFilters`, el comportamiento es idéntico al de antes (camping no lo
    usa). Cuando sí se pasa, se renderiza el mismo `MultiSelectPopover`
    arriba de los tabs de categoría, y el filtrado es por intersección de
    conjuntos (`post.routeIds` ∩ rutas activas). Boulder reutiliza este mismo
    mecanismo (ver más abajo).
- **Panel de administración:** `admin-posts-panel.tsx` muestra ahora todas
  las rutas etiquetadas de un post de muro (`formatPostRoutes`, con fallback
  a `routeId` legacy y a "Sin ruta específica" si no hay ninguna), en vez de
  solo `post.routeId`.

**Lo mismo para boulder — vista agregada en /boulder + selector multi-problema
(añadido 2026-09):** aplica el mismo patrón que en muro, con una diferencia
importante de punto de partida: `boulderPost` **nunca tuvo una lista fija**
de bloques/problemas — `boulderName`/`routeName` siempre fueron campos de
texto libre que el visitante escribía a mano (a diferencia de `climbPost`,
que siempre tuvo `routeId` como id válido de `MURO_ROUTES`). Por eso este
cambio no es 100% sin pérdida hacia atrás:

- **Esquema:** `boulderPost` ganó `problemIds` (`text[]`, nullable), con
  valores tipo `"BLDR01-PP01"` (`boulderId-problemId`, ids de `BOULDERS` en
  `lib/boulder/boulders.ts`). `boulderName`/`routeName` (legacy, `NOT NULL`)
  se conservan: para filas nuevas ahora guardan los ids crudos del primer
  problema etiquetado (`"BLDR01"` / `"PP01"`, no el texto libre de antes), o
  `""` si no se etiquetó ninguno. **Las filas anteriores a este cambio siguen
  con texto libre** (ej. `boulderName = "El Higuerón"`) que no necesariamente
  coincide con ningún id real de `BOULDERS` — esas filas antiguas no se
  pueden filtrar/enlazar por bloque de forma confiable, pero **sí siguen
  apareciendo** en la vista agregada (como comentario sin bloque enlazable,
  mostrando su texto libre original tal cual).
- **Formulario (`components/boulder/boulder-post-form.tsx`):** los dos
  `Input` de texto libre (`boulderName`, `routeName`) fueron reemplazados por
  un único `MultiSelectPopover` (`problemIds: string[]`, opcional) con todas
  las combinaciones bloque+problema (`lib/boulder/boulders.ts::
  getBoulderProblemOptions()`). Las etiquetas se resuelven con
  `useTranslations("BoulderRoute")` (`${boulderId}.name` +
  `${boulderId}.problems[index].name`, igual que ya hacía
  `boulder-page-layout.tsx`). `getBoulderBaseId`/`getBoulderProblemId`
  separan el id de bloque del id de problema.
  - En la página de un bloque específico (`BoulderPageLayout` →
    `/boulder/[boulderId]`) el formulario **no preselecciona nada**
    (a diferencia de muro): un bloque puede tener varios problemas y no hay
    un default obvio, así que se deja vacío y el visitante elige libremente
    de la lista completa (puede etiquetar problemas de otros bloques
    también). El prop `defaultProblemIds` existe para paridad de API con
    `AscentForm` pero hoy ningún caller lo usa.
- **Validación (`lib/boulder/post-actions.ts`):** `submitSchema.problemIds`
  es un array opcional (`.default([])`, máx. 20); `boulderName`/`routeName`
  se derivan de `problemIds[0]` vía `getBoulderBaseId`/`getBoulderProblemId`.
- **Queries (`lib/boulder/post-queries.ts`):**
  `getApprovedBoulderPostsByBoulderId(boulderId)` (antes
  `getApprovedBoulderPostsByBoulderName`, que comparaba por el nombre
  *traducido* — un bug latente: un post creado con el sitio en inglés nunca
  aparecía en la versión en español del bloque) hace match por
  `boulderName = boulderId` (filas nuevas) o `EXISTS (SELECT 1 FROM
  unnest(problem_ids) ...)`. `getApprovedBoulderPosts()` (sin filtrar) sigue
  igual, usada por la vista agregada.
- **Vistas:**
  - `boulder-block-publications.tsx` (página de un bloque) y
    `boulder-publications.tsx` (vista agregada en `/boulder`, ahora con
    `routeFilters` por bloque + link a `/boulder/<boulderId>` por cada
    problema etiquetado) resuelven las etiquetas vía `BoulderRoute` y
    solo enlazan bloques que existen en `BOULDERS`; cualquier valor que no
    matchee (texto libre antiguo) se muestra como texto plano no enlazable.
  - `BoulderPageLayout`/`BoulderBlockPublications` pasan `boulderId` en vez
    de `boulderName` (el nombre traducido ya no se usa como parámetro de
    query, solo para mostrar el hero de la página).
- **Panel de administración:** `admin-posts-panel.tsx` gana
  `formatPostProblems`, mismo patrón que `formatPostRoutes` en muro.

**Renombre de ids de bloque `HIG0X` → `BLDR0X` (añadido 2026-09):** los 4
bloques de boulder cambiaron de id, ej. `/boulder/HIG01` → `/boulder/BLDR01`.
Cambió: las carpetas de ruta (`app/[locale]/boulder/HIG0X` →
`.../BLDR0X`, con su `page.tsx` pasando `boulderId="BLDR0X"`), los ids en
`BOULDERS` (`lib/boulder/boulders.ts`, incluyendo el tipo `` `BLDR${string}` ``
y `padBoulderId`), y las claves de traducción `BoulderRoute.HIG0X` →
`BoulderRoute.BLDR0X` en `messages/es.json`/`en.json`. La tabla `boulder_post`
estaba vacía al hacer este cambio, así que no hubo que migrar datos; si en el
futuro ya existen filas con `problemIds`/`boulderName` en formato `"HIG0X"`,
habría que actualizarlas a mano (`UPDATE boulder_post SET ...`) para que
sigan enlazando correctamente.

---

## 6.b Flujo de datos — Inventario y rentas de equipos (añadido 2026-09)

Sistema de inventario para equipo rentable (cascos, arneses, crash pads, pies
de gato, botas, carpas...), con página pública de catálogo y panel de
administración/staff para gestionar stock y registrar movimientos de renta.

**Esquema (`lib/db/schema.ts`):**
- `equipment`: catálogo de tipos de equipo (`name`, `slug` único, `category`
  — `escalada`\|`boulder`\|`camping`\|`otro`, `description`, `pricePerDay`
  nullable en COP, `imageUrl` nullable — imagen cuadrada 1:1, `active`).
- `equipmentVariant`: variante/talla rentable de un equipo (`label`,
  `totalQuantity`). **Todo equipo tiene al menos una variante**, incluso si no
  maneja tallas reales (se crea con `label = "Única"` al crear el equipo) —
  esto mantiene uniforme la lógica de disponibilidad y de registro de rentas,
  sin casos especiales.
- `equipmentRental`: movimiento de renta (`equipmentId`, `variantId`,
  `renterName`/`renterContact` — **texto libre, no requiere cuenta de
  usuario**, decisión de diseño explícita: los clientes de renta de equipo son
  mayormente visitantes sin cuenta), `quantity`, `rentedAt`/`expectedReturnAt`
  (fechas ISO `YYYY-MM-DD`, mismo formato que `reservation`), `status`
  (`activa`\|`devuelta`\|`cancelada`, columna `text` sin `CHECK` — mismo
  patrón de diseño que `reservation.status`, ver nota de la sección 3),
  `registeredByUserId` (FK `user`, quién de staff/admin la registró).

**Disponibilidad — regla central:** nunca se guarda un contador de stock
disponible. Siempre se calcula como
`totalQuantity - SUM(quantity) de equipmentRental con status = "activa"` para
esa variante (`lib/equipos/queries.ts::getActiveQuantitiesByVariant`). Esto
evita que el número se desincronice si una renta se cancela, se marca como
devuelta, o se edita el stock total manualmente.

```
components/admin/admin-equipment-panel.tsx (client, usado en /admin/equipos y /staff/equipos)
   │ Tab "Inventario": crear/editar/eliminar equipment + equipmentVariant,
   │   subir imagen cuadrada (uploadEquipmentImageAction)
   │ Tab "Movimientos": createRentalAction (valida stock disponible antes de
   │   insertar), markRentalReturnedAction, cancelRentalAction
   ▼
lib/equipos/actions.ts ("use server")
   │ TODAS las acciones verifican getModeratorSession() (admin + staff, igual
   │ que moderación de contenido — ver sección 4). uploadEquipmentImageAction
   │ sigue el mismo patrón que uploadAnnouncementImageAction (sección 7.b):
   │ escribe en public/media/Equipos/, devuelve error "read_only" en hosting
   │ de solo lectura.
   ▼
Neon Postgres: equipment / equipment_variant / equipment_rental
   ▲
   │ lib/equipos/queries.ts::getEquipmentCatalog() — solo equipo/variantes
   │   activos, para /equipos (público)
   │ lib/equipos/queries.ts::getAllEquipmentForAdmin() / getAllRentals() —
   │   incluye inactivos + historial completo, para el panel
   ▼
app/[locale]/equipos/page.tsx (público)
   muestra imagen cuadrada (o ícono placeholder si `imageUrl` es null — las
   fotos reales se suben después desde el panel), precio si está definido, y
   un chip de disponibilidad EXACTA por variante ("M: 3 disponibles") — es
   decisión explícita mostrar el número exacto, no solo disponible/no
   disponible.
```

- Rutas duplicadas admin/staff (`app/[locale]/admin/equipos/page.tsx` y
  `app/[locale]/staff/equipos/page.tsx`) reutilizan el mismo
  `AdminEquipmentPanel`, mismo patrón que reservas/publicaciones/contenido
  (sección 2). Ítem de navegación "Equipos" agregado en
  `components/panel/panel-shell.tsx` (`ADMIN_ITEMS`/`STAFF_ITEMS`) y en los
  home panels (`admin-home-panel.tsx`/`staff-home-panel.tsx`).
- El flag existente `siteSettings.hideEquipos` sigue controlando la
  visibilidad de la sección pública (`assertSectionVisible("equipos", locale)`
  en `app/[locale]/equipos/page.tsx`), sin cambios.
- Después de cualquier mutación se llama `revalidatePath("/", "layout")` para
  que la página pública refleje el nuevo stock de inmediato.
- Seed inicial de inventario: `scripts/seed-equipment.ts` (`pnpm
  db:seed-equipment`), idempotente (omite equipos cuyo `slug` ya existe).
  Carga los datos reales que dio el propietario: Casco (2), Arnés (2),
  Crashpad (3 totales, 2 marcados "en uso" con una renta activa de arranque),
  Pies de gato (15, variante "Única" — el propietario decidió empezar sin
  desglose por talla y ajustarlo después desde el panel), Botas (0), Carpas
  de camping (0).

---

## 7.b Flujo de datos — Pop-up de noticias/novedades

```
components/admin/admin-announcement-section.tsx (client, dentro de AdminContentPanel)
  → lib/announcement/actions.ts ("use server", requireAdmin)
      setAnnouncementEnabledAction / saveAnnouncementAction
        → lib/announcement/queries.ts (saveAnnouncement)
            → tabla site_announcement (fila única "default")
            → updateTag("site-announcement") + revalidatePath("/", "layout")
      uploadAnnouncementImageAction → escribe en public/media/Novedades/<slug>-<ts>.<ext>
      listMediaImagesAction → lista imágenes existentes de public/media

app/[locale]/layout.tsx (server)
  → getLiveAnnouncement(locale)  // enabled + ventana de fechas + contenido mínimo
      → components/layout-shell.tsx → components/announcement-modal.tsx (solo rutas públicas)
```

Notas:
- El texto se guarda duplicado es/en; `toAnnouncementPayload` resuelve el idioma
  y hace fallback al otro si uno está vacío.
- La frecuencia (`always` | `once` | `daily`) se aplica en el cliente con
  `localStorage` bajo la clave `higueron:announcement:v<version>`.
- La subida escribe en el sistema de archivos: **solo funciona en entornos con
  disco escribible** (local / servidor propio). En hosting serverless de solo
  lectura la acción devuelve `read_only` y el admin debe subir la imagen al
  repositorio en `public/media` y pegar la ruta.

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
- ~~`corporate-ai-chatbot/`~~: eliminado el 2026-09-15 (ver secciones 1 y 13).
- Página de **aviso legal** (`/aviso-legal`): solicitada como **borrador
  pendiente**. Los datos del prestador ya están centralizados en
  `lib/legal-info.ts` y exhibidos en el footer (`Footer.legal.line`) y en
  `/contacto` (`Contacto.legal`); falta crear la página legal y enlazarla
  desde el footer.
- Página de **historia** (`app/[locale]/historia/page.tsx`, namespace
  `Historia` en `messages/*.json`): **borrador/en construcción a propósito**.
  El Higuerón tiene más de 70 años de historia que todavía no está
  documentada/verificada; por eso la página solo muestra: un aviso
  "página en construcción", un placeholder de imagen para la futura historia
  de origen, los dos festivales recientes que sí están confirmados (Choachí
  Flash Festival 2024, Choachí Boulder Festival 2025 — mismos datos que
  `public/Memoria_Camping_El_Higueron.md`) y un grid de placeholders para
  fotos de archivo. **No tiene entrada en el navbar ni en el footer a
  propósito** — solo se llega desde el botón "Conoce nuestra historia" en la
  nueva sección `history` de `app/[locale]/el-lugar/page.tsx`. Pendiente:
  reemplazar los placeholders cuando se recopile la historia de origen y las
  fotos de archivo.
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
| Cambiar el pop-up de noticias/novedades | `lib/announcement/types.ts` (forma y reglas de visibilidad) + `lib/announcement/queries.ts` (lectura cacheada y guardado) + `lib/announcement/actions.ts` (Server Actions admin, incluida la subida de imagen) + `components/announcement-modal.tsx` (UI pública) + `components/admin/admin-announcement-section.tsx` (panel) |
| Cambiar el esquema de la base de datos | `lib/db/schema.ts` → `pnpm db:generate` → `pnpm db:migrate` |
| Cambiar catálogo/stock de equipos rentables o su disponibilidad | `lib/equipos/types.ts` (vocabulario) + `lib/equipos/actions.ts` (mutaciones, solo admin+staff) + `lib/equipos/queries.ts` (cálculo de disponibilidad) |
| Ver/modificar contactos acumulados y su vínculo con cuentas | `lib/contacts/*` (normalización, upsert, link, queries) + `components/admin/admin-contacts-panel.tsx` + `scripts/backfill-contacts.ts` |
| Cambiar el algoritmo de recomendaciones por dificultad (Muro/Boulder) | `lib/muro/route-recommendations.ts` / `lib/boulder/boulder-recommendations.ts` |
| Cambiar reglas de acceso a rutas por rol | `lib/auth/roles.ts` (`canAccessPath`, `homePathForRole`) + `proxy.ts` (prefijos protegidos) |
| Ver todos los textos/traducciones de la UI | `messages/es.json`, `messages/en.json` |
| Configurar el evento activo de `/evento` | `lib/eventos/config.ts` (estructura) + `messages/*.json` bajo `Evento.content` (textos) |
| Cambiar datos legales del prestador (razón social, NIT, RNT) | `lib/legal-info.ts` — fuente única; los textos/etiquetas viven en `messages/*.json` (`Footer.legal`, `Contacto.legal`) |
| Cambiar el agregador de reseñas (dashboard admin y sección pública en home) | `lib/reviews/types.ts` (vocabulario) + `lib/reviews/aggregate.ts` (une las 4 tablas de posts en memoria, nunca las muta) — ver sección 11.b |
| Subir/listar imágenes estáticas del sitio (galería, equipos, novedades) en Cloudflare R2 | `lib/storage/r2.ts` (cliente) + `scripts/migrate-media-to-r2.ts` (migración masiva, `pnpm migrate:media-to-r2`) + `lib/equipos/actions.ts::uploadEquipmentImageAction` / `lib/announcement/actions.ts::uploadAnnouncementImageAction`/`listMediaImagesAction` — ver sección 15 |
| Cambiar las fotos de la galería pública | `app/[locale]/galeria/page.tsx` (array `galleryImages`, URLs de R2) |

---

## 11. Comandos de verificación

```
pnpm lint             # ESLint (eslint-config-next 16, flat config en eslint.config.mjs)
pnpm build            # Next build — falla si hay errores de compilación/páginas
pnpm db:generate      # Genera migración SQL desde lib/db/schema.ts
pnpm db:migrate       # Aplica migraciones en Neon
pnpm db:push          # Sincroniza schema directamente (uso limitado en prototipos)
pnpm db:backfill-contacts # Vincula contactos históricos (idempotente)
pnpm db:seed-equipment # Seed idempotente del inventario inicial de equipos (sección 6.b)
pnpm migrate:media-to-r2 # Sube public/media/** a Cloudflare R2 (idempotente, sección 15)
```

`next.config.mjs` tiene `typescript.ignoreBuildErrors: true`: **el build NO
falla por errores de tipos**, solo por errores de compilación/bundling. Es
deuda técnica pre-existente; para atraparlos hay que correr `tsc --noEmit`
manualmente (no hay script `pnpm typecheck` todavía — considerar añadirlo).

---

## 11.b Flujo de datos — Reseñas unificadas (Muro, Camping, Boulder, Equipos)

No existe una tabla `review` nueva. Las 4 tablas de posts ya existentes
(`climbPost`, `campingPost`, `boulderPost`, `equipmentPost`) siguen siendo la
fuente de verdad; cada una mantiene su propio flujo de moderación
(`lib/{muro,camping,boulder,equipos}/post-actions.ts`) sin cambios. Solo se
agregó una capa de lectura que las une en memoria para mostrar analítica y una
vista pública consolidada.

```
lib/reviews/types.ts       — vocabulario (ReviewSource, UnifiedReview, ReviewStats)
lib/reviews/aggregate.ts
   │ getAllReviewsUnified(filters?) — 4 selects (uno por tabla), normaliza a
   │   UnifiedReview, filtra category="review" (climbPost/campingPost/
   │   boulderPost) — equipmentPost no tiene columna category, así que sus
   │   filas siempre cuentan como reseña.
   │ getPublicReviews(filters?) — igual, pero solo status "pending"|"approved"
   │   (nunca "hidden"), mismo criterio que getApproved*() de cada fuente.
   │ getReviewStats(filters?) — promedio general, promedio por servicio,
   │   distribución 1-5, tendencia mensual, alerta de reseñas <= 2 estrellas.
   ▼
components/admin/admin-reviews-panel.tsx (client) — app/[locale]/admin/resenas/page.tsx
   dashboard con recharts (components/ui/chart.tsx) + tabla filtrable.
   Solo lectura: para aprobar/ocultar/borrar una reseña se usa la acción de
   su tabla de origen desde /admin/publicaciones — no se duplica lógica de
   mutación aquí.
   ▼
components/reviews/public-reviews-section.tsx (server) +
components/reviews/public-reviews-client.tsx (client, filtros/orden/"ver más")
   Montado en app/[locale]/page.tsx (home), después de la Galería y antes del
   CTA final. Usa getPublicReviews(); si no hay ninguna reseña, la sección no
   se renderiza (return null).
```

Notas:
- Sin paginación en BD (mismo patrón que el resto del proyecto, ver sección 3):
  el filtrado/orden se hace en memoria sobre el resultado ya traído.
- Ítem de navegación "Reseñas" agregado en `components/panel/panel-shell.tsx`
  (`ADMIN_ITEMS`, solo admin) y en `app/[locale]/admin/layout.tsx` (traducción
  de nav). No se agregó a `STAFF_ITEMS` — es una vista analítica pensada para
  administración, no para moderación diaria de staff.
- Textos en `messages/{es,en}.json` bajo `Panel.reviews` (panel admin) y
  `Home.reviews` (sección pública).

---

## 12. Contactos e identidad progresiva

### 12.1 Modelo de datos

- `contact` es una tabla independiente de `user`. Representa a una persona
  identificable (por correo o teléfono) con o sin cuenta de autenticación.
- Las tablas `climbPost`, `campingPost`, `boulderPost`, `postReply`,
  `reservation` y `equipmentRental` conservan su campo de contacto original
  (`contactInfo` / `renterContact`) y ahora tienen una FK nullable `contactId`
  que apunta a `contact`.
- `contact.userId` se llena al crear una cuenta, vinculando datos anónimos
  previos con el usuario de Better Auth.

### 12.2 Normalización y autodetección

- `lib/contacts/normalize.ts` detecta si una cadena es un correo válido o un
  número de teléfono (WhatsApp), normaliza el correo a minúsculas y el
  teléfono a formato E.164 (+573...).
- `components/contact-field.tsx` es el campo único reutilizable en todos los
  formularios públicos; muestra un indicador de correo o teléfono mientras el
  usuario escribe.
- `lib/contacts/upsert.ts` busca o crea el registro `contact` y actualiza
  `lastSeenAt` y `submissionCount`. Falla de forma silenciosa: nunca bloquea
  el envío original.

### 12.3 Flujo de registro

- El login (`components/auth/login-form.tsx`) acepta un solo campo
  "Correo o WhatsApp" y llama a `signIn.email` o `signIn.phoneNumber` de
  Better Auth según la detección.
- El registro (`lib/auth/actions.ts::registerWithEmailOrPhone`) permite crear
  cuenta con correo o teléfono. Para teléfono se genera un correo técnico
  placeholder (`phone-<digitos>@phone.elhigueron.xyz`) porque Better Auth aún
  requiere un email en el registro base; el `phoneNumber` del usuario se
  escribe después en la fila `user`.
- Tras crear el usuario, `lib/contacts/link.ts` asocia los contactos
  existentes que coincidan por correo o teléfono.

### 12.4 Verificación (PENDIENTE)

- La arquitectura está preparada para verificación obligatoria de correo y
  teléfono, pero **no se activó envío real de OTP/WhatsApp** porque aún no se
  cuenta con proveedor de email/SMS/WhatsApp.
- `contactVerification` (`lib/db/schema.ts`) guarda tokens de reclamación
  cuando se implemente el envío.
- El plugin `phoneNumber` de Better Auth está habilitado (`lib/auth.ts` y
  `lib/auth-client.ts`) con `sendOTP` documentado como pendiente.

### 12.5 Paneles y backfill

- `/cuenta/publicaciones` y `/cuenta/reservas` consultan a través de
  `contact.userId` y muestran datos reales del visitante autenticado
  (`lib/cuenta/queries.ts`).
- `/admin/contactos` es un directorio de contactos con conteo de
  interacciones y estado de vinculación a cuenta.
- `pnpm db:backfill-contacts` (`scripts/backfill-contacts.ts`) recorre los
  datos históricos de las 6 fuentes, normaliza contactos y llena las FK
  `contactId` de forma idempotente (salta filas ya vinculadas).

### 12.6 Privacidad

- Los contactos son PII. El backfill y los formularios públicos preservan el
  texto original sin revelar si un contacto ya existe.
- Solo los administradores pueden ver el directorio de contactos; el panel
  `/cuenta` solo expone las interacciones del usuario autenticado.
- El contacto puede eliminarse desde `/admin/contactos`; las filas
  relacionadas (posts, reservas, rentas) mantienen su campo de contacto
  original como histórico, pero la FK `contactId` se pone en `NULL`.

---

## 13. Auditoría 2026-09-15

Pasada de auditoría enfocada en verificación con herramientas (no solo lectura
manual): se corrió `pnpm lint`, `npx tsc --noEmit` y `pnpm build` sobre todo el
repo, algo que no estaba documentado como hecho en las auditorías anteriores.
El código de negocio de Usuarios/Reservas/Comentarios ya estaba en buen estado
(validación server-side con zod, guardas de autorización, sin N+1 evidentes en
`lib/reservas/*`, `lib/replies/*`, `lib/{muro,camping,boulder,comunidad}/post-actions.ts`
— confirmado leyendo cada uno). Se encontraron y corrigieron 3 problemas reales:

1. **Bug real (rompía el panel admin/staff):**
   `components/panel/panel-shell.tsx` usaba el ícono `Star` (item de nav
   "Reseñas", agregado en la sección 11.b) sin importarlo de `lucide-react` —
   `tsc` lo marcaba como `Cannot find name 'Star'`. Como
   `next.config.mjs` tiene `typescript.ignoreBuildErrors: true`, esto no
   rompía `pnpm build`, pero sí habría roto el render en producción
   (`ReferenceError: Star is not defined`) apenas alguien con rol
   administrador abriera el panel. Corregido agregando el import.
2. **Deuda de tipos en `lib/auth/user-actions.ts::createUserAction`:** el
   `role` que pasa esta app a `auth.api.createUser` (`"administrador" |
   "staff" | "visitante"`, definido en `lib/auth.ts` vía
   `user.additionalFields.role`) no coincide con el tipo `"user" | "admin"`
   que espera el plugin `admin()` de Better Auth para su propio concepto de
   rol (no usado por esta app). Funcionaba en runtime porque el plugin solo
   escribe el string recibido en la columna `role`, pero rompía `tsc
   --noEmit`. Se documentó con un comentario y un cast explícito en vez de
   `any`.
3. **`tsconfig.json` no excluía `corporate-ai-chatbot/`** (sub-proyecto Vite
   independiente, ver sección 1), así que `tsc --noEmit` sobre la raíz fallaba
   con un error de ese sub-proyecto (`allowImportingTsExtensions`) que no
   tiene nada que ver con la app principal. Se agregó `corporate-ai-chatbot`
   al `exclude`.

Después de estos 3 cambios: `pnpm lint` → 0 errores (23 warnings, todas del
React Compiler sobre patrones de `react-hook-form`/`useRef`/componentes
`ui/*` de shadcn preexistentes, no relacionadas con Usuarios/Reservas/
Comentarios); `npx tsc --noEmit` → 0 errores; `pnpm build` → compila y
genera las 118 páginas correctamente.

**Pendiente identificado, no aplicado (requiere acceso a la base de datos de
producción y ventana de mantenimiento, ver nota de rendimiento en la sección
3):** los índices recomendados en `postReply(post_type, post_id)`,
`climbPost(route_id)`, `boulderPost(boulder_name)` y las columnas `status` de
las tablas de posts/reservas siguen sin aplicarse. Es una operación de
esquema sobre Neon en producción — no se ejecutó `pnpm db:generate` /
`pnpm db:migrate` en esta pasada por no tener autorización explícita para
tocar la base de datos real; queda igual de priorizada que antes.

**Actualización 2026-09-15 (2):** un usuario reportó en runtime
`MISSING_MESSAGE: Could not resolve 'Comunidad.form.title'` al abrir
`/comunidad`. Causa: `app/[locale]/comunidad/page.tsx` llama a
`t("form.title")` pero el objeto `Comunidad.form` en `messages/es.json` y
`messages/en.json` nunca tuvo una key `title` (sí tenía todos los demás
campos del formulario). Corregido agregando `"title"` a `Comunidad.form` en
ambos idiomas ("Publica tu plan" / "Publish your plan").

Este tipo de bug (key de traducción faltante) **no lo detectan** `tsc`,
`eslint` ni `pnpm build` — `next-intl` resuelve las keys en runtime, no en
build time. Se corrió un script ad-hoc de una sola vez (no se dejó en el
repo) que compara, para archivos con un único `useTranslations`/
`getTranslations(<string literal>)` sin ambigüedad de scope, cada `t("...")`
contra `es.json`/`en.json`: no encontró más keys faltantes bajo ese criterio.
No cubre llamadas con namespace dinámico/objeto (`getTranslations({ locale,
namespace })`) ni archivos con varios `t` en distintos scopes — para esos
casos no hay una forma barata y confiable de verificar estáticamente; si se
quiere blindar esto a futuro, la opción real es tipar los mensajes con
`next-intl` (`declare module 'next-intl' { interface AppConfig { Messages:
... } }`) para que `tsc` sí marque las keys faltantes como error de tipos.

**Actualización 2026-09-15 (3):** el usuario confirmó explícitamente eliminar
`corporate-ai-chatbot/` (era la única operación destructiva pendiente de
confirmación de las auditorías anteriores). Antes de borrar se verificó de
nuevo, con el repo ya sin esa carpeta:
- 0 referencias a `corporate-ai-chatbot` en `app/`, `components/`, `lib/` o
  `package.json` de la raíz (ya se sabía, pero se re-confirmó justo antes de
  borrar).
- El chatbot real (`components/chat-bot.tsx`, montado desde
  `components/layout-shell.tsx`, y su endpoint `app/api/chat/route.ts`) no
  vive dentro de esa carpeta ni depende de ella en absoluto.
- Se limpiaron las 2 referencias de configuración que solo existían para
  *excluir* esa carpeta del tooling de la app principal:
  `tsconfig.json` (`exclude`) y `eslint.config.mjs` (`ignores`) — ya no hacen
  falta.
- Después de borrar: `npx tsc --noEmit` → 0 errores, `pnpm lint` → 0 errores,
  `pnpm build` → compila y genera las 118 páginas, incluida `/api/chat`
  (el endpoint del chatbot real) sin cambios.

**Observación menor, no bloqueante:** `pnpm build` (Turbopack) emite una
advertencia de "Encountered unexpected file in NFT list" con traza hacia
`lib/equipos/actions.ts` (por `path.join(process.cwd(), ...)` en
`uploadEquipmentImageAction`, mismo patrón ya usado en
`lib/announcement/actions.ts`). Es solo una advertencia de tracing de
Turbopack, no falla el build ni afecta el resultado; si se quiere eliminar el
ruido, se podría marcar esa línea con `/* turbopackIgnore: true */`, pero no
se tocó en esta pasada para no arriesgar el comportamiento de subida de
imágenes en producción sin poder probarlo contra un hosting real.

---

## 14. Auditoría 2026-09-15 (2ª) → 2026-09-18 (índices de BD)

Re-auditoría completa siguiendo el mismo criterio de la sección 13 (verificación
con herramientas, no solo lectura manual):

- `pnpm lint` → **0 errores** (mismos 23 warnings ya documentados en la sección
  13: patrones `react-hook-form`/`useRef`/`Math.random`/`setState` en efecto de
  componentes `ui/*` de shadcn y hooks preexistentes — ninguno nuevo, ninguno en
  el flujo de Usuarios/Reservas/Comentarios).
- `npx tsc --noEmit` → **0 errores**, antes y después del cambio de esquema.
- Revisión manual dirigida (sin cambios, ya cumplían buenas prácticas):
  - `lib/reservas/actions.ts` — validación zod server-side completa (fechas ISO,
    llegada no pasada, salida ≥ llegada, límites de longitud), no confía en el
    cliente. Sin hallazgos.
  - `lib/replies/reply-actions.ts` — guardas de moderador presentes en las 2
    Server Actions de mutación, validación zod en el submit público. Sin
    hallazgos.
  - `lib/cuenta/queries.ts::getMyPublications` — 4 selects vía `Promise.all`
    (no secuenciales), cada uno con `inArray(contactId, contactIds)`: no es N+1.
  - `lib/equipos/queries.ts::buildCatalog` — 3 queries en paralelo
    (`Promise.all`) + un solo `GROUP BY` para la disponibilidad agregada, unión
    en memoria con `Map`: no es N+1.
  - `lib/reviews/aggregate.ts::fetchAllRawReviews` — 4 selects en paralelo, sin
    loops con queries dentro. Sin hallazgos.
  - `lib/contacts/upsert.ts` — 1 select + 1 update/insert por submission (no
    hay loop), falla silenciosamente sin bloquear el submit original. Sin
    hallazgos.
  - `lib/replies/reply-queries.ts::getApprovedRepliesByPosts` — ya documentado
    como "no es N+1" en su propio comentario (una sola query con `inArray`
    sobre todos los ids de la página); confirmado.

**Cambio aplicado — índices de base de datos (el único pendiente de rendimiento
que quedaba abierto desde la sección 3/13):**

- `lib/db/schema.ts`: se agregó el 3er argumento de `pgTable` (array de
  `index()`) a `session`, `climbPost`, `chatMessage`, `reservation`,
  `campingPost`, `boulderPost` y `postReply`, cubriendo exactamente los
  candidatos que ya estaban priorizados (ver sección 3 actualizada).
- `pnpm db:generate` generó `drizzle/0012_cultured_cardiac.sql` — 10
  `CREATE INDEX`, ninguna otra operación. Es aditivo y no destructivo (no
  reescribe filas, no cambia tipos, no puede romper una query existente).
- El usuario autorizó explícitamente aplicarlo contra Neon: se corrió
  `pnpm db:push`, que confirmó `[✓] Pulling schema from database...` /
  `[✓] Changes applied` sin errores. Los 10 índices ya existen en la base de
  datos real de producción.

**No se encontró deuda técnica nueva** de las categorías pedidas (código
muerto, validaciones faltantes en reservas/comentarios, fugas de memoria,
renderizados excesivos): el código de negocio de Usuarios/Reservas/Comentarios
ya estaba, y sigue estando, en buen estado tras las auditorías de las secciones
2.1, 4 y 13. Los borradores de la sección 9 (`staff-reservas-panel`,
`cuenta-reservas-panel`, `cuenta-publicaciones-panel`,
`admin-reservations-panel` sin `updateReservationStatusAction`, `/aviso-legal`,
`/historia`) siguen intactos y sin tocar, como exige la regla de ejecución del
usuario de no completar borradores sin confirmación.

---

## 15. Auditoría 2026-09-20/22 — Almacenamiento de imágenes/media → migrado a Cloudflare R2

Auditoría solicitada por el usuario sobre rendimiento de carga de imágenes.
**Migración completada e implementada** (238 archivos subidos, código
actualizado, `public/media` eliminado del working tree).

### 15.1 Estado encontrado (diagnóstico inicial, 2026-09-20)

- **`next.config.mjs` tiene `images: { unoptimized: true }`**: la
  optimización de imágenes de Next.js (`next/image`) está completamente
  desactivada en todo el sitio. Cada `<Image>` se sirve en su resolución y
  formato original, sin redimensionar ni convertir a WebP/AVIF ni cachear vía
  el Image Optimizer de Vercel. Es la causa principal del problema de
  rendimiento reportado.
- **`public/media/` pesa ~143 MB en 238 archivos** (JPG en su mayoría,
  promedio ~626 KB/archivo, picos de ~2.4 MB), commiteados directamente al
  repo. Esto ya infló `.git` a **~1.4 GB**, lo que hace más lentos los
  clones/checkouts y cada build/deploy en Vercel que empaqueta `public/`.
- **Rutas hardcodeadas a `/media/...`** en al menos 13 archivos:
  `app/[locale]/galeria/page.tsx` (232 entradas hardcodeadas, es la fuente
  principal), `boulder/page.tsx`, `camping/page.tsx`, `el-lugar/page.tsx`,
  `visita/page.tsx`, `escalada/page.tsx`, `equipos/page.tsx`, `historia/page.tsx`,
  `contacto/page.tsx`, `[locale]/page.tsx` (home), `muro/page.tsx` +
  `RouteGuideSection.tsx`, y en `lib/`: `lib/boulder/boulders.ts`,
  `lib/eventos/{config,plantillas}.ts`, `lib/equipos/actions.ts`,
  `lib/announcement/actions.ts`, `components/navbar.tsx`,
  `components/admin/admin-announcement-section.tsx`.
- **El Muro (contenido generado por visitantes) ya usa Cloudinary**
  (`components/muro/media-uploader.tsx`, subida sin firmar desde el
  navegador vía `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`/`UPLOAD_PRESET`) — es la
  única parte del sitio que ya resolvió correctamente el problema de
  almacenamiento externo, pero no se extendió al resto.
- **Confirmación de una limitación ya documentada (secciones 6.b y 7.b):**
  `uploadEquipmentImageAction` (`lib/equipos/actions.ts`) y
  `uploadAnnouncementImageAction` (`lib/announcement/actions.ts`) escriben
  con `fs.writeFile` directamente en `public/media/Equipos/` y
  `public/media/Novedades/` respectivamente. Ya estaba documentado que esto
  "solo funciona en entornos con disco escribible" y que en hosting
  serverless de solo lectura (Vercel) devuelve el error `read_only` — esta
  auditoría lo confirma como un problema activo (no solo teórico) que se
  resuelve de raíz con la misma migración de almacenamiento externo.

### 15.2 Decisión — dos almacenamientos de imágenes a propósito

El usuario decidió **Cloudflare R2** para las imágenes estáticas del sitio
(galería, boulder, camping, naturaleza, equipos, novedades), manteniendo
**todo el código en Vercel** (no se migra el hosting de la app). El Muro
(contenido generado por visitantes) **se queda en Cloudinary** — es una
decisión explícita de mantener dos almacenamientos distintos, no una
inconsistencia:

| | Qué guarda | Quién sube | Dónde |
|---|---|---|---|
| **Cloudflare R2** | Fotos propias del sitio (galería, boulder, camping, naturaleza, logos, fotos de equipos, imágenes de novedades) | El equipo/admin, vía panel o el script de migración | `lib/storage/r2.ts` |
| **Cloudinary** | Fotos/videos que suben los visitantes en sus publicaciones del Muro | Cualquier visitante, sin cuenta | `components/muro/media-uploader.tsx` |

### 15.3 Implementación

**Cliente R2 (`lib/storage/r2.ts`):** wrapper sobre `@aws-sdk/client-s3`
(API S3-compatible de R2). `getEnv()` valida cada variable requerida
(`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
`R2_BUCKET_NAME`, `R2_PUBLIC_URL`) al usarla, para fallar con un mensaje
claro en vez de un error críptico del SDK. Expone `uploadToR2(key, buffer,
contentType)`, `r2ObjectExists(key)`, `listR2Objects(prefix)` y
`getR2PublicUrl(key)` (construye la URL pública a partir de `R2_PUBLIC_URL` +
key, con cada segmento de ruta `encodeURIComponent`-eado para soportar
nombres con espacios como `"Muro bendito sea"`).

**Migración de las 238 imágenes existentes (`scripts/migrate-media-to-r2.ts`,
`pnpm migrate:media-to-r2`):** script de una sola vez, ejecutado ya contra el
bucket de producción. Recorre `public/media/` recursivamente, sube cada
archivo a R2 usando la misma ruta relativa como key (ej.
`"Boulders/Img17.jpg"`), es **idempotente** (usa `HeadObjectCommand` para
saltar objetos que ya existen, salvo que se pase `--force`), y escribe
`scripts/media-r2-mapping.json` (`"/media/<path>" → "<URL pública de R2>"`)
para poder scriptear el reemplazo de referencias en el código. Resultado real
de la corrida: **238/238 archivos subidos**, verificado además con un
`curl` directo a la URL pública (200 OK, mismo tamaño en bytes que el
archivo original).

**Reemplazo de referencias hardcodeadas:** se reemplazaron las rutas
`/media/...` por la URL pública de R2 correspondiente en los 17 archivos
identificados en la sección 15.1 (`galeria/page.tsx`, `boulder/page.tsx`,
`camping/page.tsx`, `el-lugar/page.tsx`, `visita/page.tsx`,
`escalada/page.tsx`, `equipos/page.tsx`, `historia/page.tsx`,
`contacto/page.tsx`, `[locale]/page.tsx`, `muro/page.tsx` +
`RouteGuideSection.tsx`, `navbar.tsx`, `lib/boulder/boulders.ts`,
`lib/eventos/{config,plantillas}.ts`), usando el mapeo generado por el
script de migración (script temporal, no se dejó en el repo). El único caso
que no era un literal estático (`app/[locale]/camping/page.tsx`, la galería
de fogatas, que construía la ruta con un template literal
`` `/media/Camping/${img}` ``) se reescribió como un array de URLs completas
de R2, igual que el resto.

**Hallazgo durante la migración — 23 imágenes de la galería ya estaban
rotas:** al cruzar cada `src` de `galeria/page.tsx` contra los archivos
reales de `public/media` antes de subirlos, aparecieron **23 entradas
(de las 232) que apuntaban a archivos que ya no existían en disco** —
imágenes borradas del repo en algún momento sin quitar su entrada del array,
en las categorías escalada, boulder, camping y naturaleza. Ya estaban rotas
en producción (ícono de imagen caída) antes de esta migración, no es algo
que haya causado la migración. Se optó por **eliminar esas 23 entradas** del
array (mostrar un espacio vacío/broken es peor que mostrar una foto menos) en
vez de dejarlas o inventar una URL. La galería quedó con **209 fotos reales**
en vez de 232. Si el propietario tiene esas fotos originales, puede volver a
agregarlas subiéndolas con `pnpm migrate:media-to-r2` y añadiendo la entrada
correspondiente al array.

**`uploadEquipmentImageAction`/`uploadAnnouncementImageAction` migradas a
R2:** ya no usan `fs.writeFile`/`mkdir` (que fallaban con `EROFS` en Vercel,
ver secciones 6.b/7.b) — ahora llaman `uploadToR2(`Equipos/<archivo>`, ...)` /
`uploadToR2(`Novedades/<archivo>`, ...)` y devuelven la URL pública de R2
directamente. El tipo de error `"read_only"` se quitó de ambos result types
y de `messages/{es,en}.json` (`Panel.equipos.uploadErrors`,
`Panel.announcement.uploadErrors`) porque ya no puede ocurrir. **Este bug
está resuelto de raíz**, no solo documentado: subir una foto de equipo o de
una novedad desde el panel admin en producción ahora funciona.

**`listMediaImagesAction` (`lib/announcement/actions.ts`):** en vez de
recorrer `public/media` con `readdir`, llama `listR2Objects("")` y devuelve
las URLs públicas completas (antes devolvía rutas `/media/...`. El selector
"Elegir imagen existente" de `admin-announcement-section.tsx` se actualizó
para mostrar solo el nombre de archivo (`image.split("/").pop()`) en vez de
hacer `.replace("/media/", "")` sobre una URL absoluta.

**`next.config.mjs`:** se quitó `images.unoptimized: true`. Ahora
`images.remotePatterns` se calcula leyendo el hostname de `R2_PUBLIC_URL` en
tiempo de build (`new URL(process.env.R2_PUBLIC_URL).hostname`), así que
funciona igual con el subdominio `pub-xxxx.r2.dev` o con un dominio propio
conectado más adelante sin tocar código. Con esto, Next.js/el Image
Optimizer de Vercel **sí redimensiona y convierte a WebP/AVIF** cada
`<Image>` que apunta a R2 (antes se servía el original tal cual). El Muro
sigue usando `<img>` plano hacia Cloudinary (`post-media-gallery.tsx`), no
necesita `remotePatterns`.

**`public/media/` eliminado del working tree** (238 archivos, ~143 MB) tras
verificar que todo el código ya apunta a R2. **El historial de git (~1.4 GB
en `.git`) NO se reescribió** — sigue conteniendo esas imágenes en commits
viejos. Reducir eso requeriría `git filter-repo`/BFG, una operación
destructiva e irreversible (fuerza a re-clonar a cualquier colaborador) que
el usuario decidió no ejecutar en esta pasada; si se quiere hacer más
adelante, requiere su aprobación explícita puntual antes de correrla.

**Verificación:** `pnpm lint` → 0 errores (mismos 23 warnings preexistentes
de la sección 13, ninguno nuevo). `npx tsc --noEmit` → 0 errores. `pnpm
build` → compila y genera las 118 páginas, incluida `/galeria`. Prueba
manual contra el bucket real: `curl` a una URL de R2 migrada devuelve `200
image/jpeg` con el mismo tamaño en bytes que el archivo original.

**Variables de entorno nuevas (`.env.example`):** `R2_ACCOUNT_ID`,
`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`,
`R2_PUBLIC_URL`, y se documentaron también las de Cloudinary
(`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`/`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`,
ya usadas por el Muro pero que no estaban en el archivo de ejemplo). Faltan
configurar en Vercel (Production/Preview) para que el build/runtime de
producción tenga acceso a R2.
