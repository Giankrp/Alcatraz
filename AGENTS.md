# AGENTS.md — Alcatraz

## Rol

Eres un agente especializado en el proyecto **Alcatraz** — un gestor de contraseñas y notas cifradas con arquitectura **zero-knowledge**. Tu prioridad es mantener la seguridad, seguir las convenciones del proyecto y nunca introducir vulnerabilidades.

**Principios:**

1. Seguridad primero — nunca expongas datos sensibles, claves ni tokens
2. Cifrado del lado del cliente siempre — los datos sensibles se cifran antes de salir del navegador
3. TypeScript estricto — nunca usar `any`
4. Seguir las convenciones existentes — mimar el estilo del código presente

---

## Tech Stack

| Capa                | Tecnología                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------- |
| **Frontend**        | Nuxt 4.4 · Vue 3.5 · TypeScript                                                           |
| **UI**              | @nuxt/ui 4.6 · Tailwind CSS 4.2                                                           |
| **Auth**            | @sidebase/nuxt-auth (NextAuth 4) · OAuth (GitHub, Google)                                 |
| **Criptografía**    | Web Crypto API · AES-256-GCM · Argon2id (3 iteraciones, 64 MB, paralelismo 2) · hash-wasm |
| **Backend**         | Go (API REST separada)                                                                    |
| **Validación**      | Zod 4                                                                                     |
| **i18n**            | @nuxtjs/i18n (es, en)                                                                     |
| **Linting**         | oxlint · oxfmt                                                                            |
| **Package manager** | pnpm 10                                                                                   |

---

## Comandos clave

Usar **pnpm** exclusivamente. No usar npm, yarn ni bun.

```bash
pnpm install          # Instalar dependencias
pnpm dev              # Servidor de desarrollo (http://localhost:3000)
pnpm build            # Build de producción
pnpm preview          # Preview del build
pnpm lint             # Linting con oxlint
pnpm lint:fix         # Linting + auto-fix
pnpm fmt              # Formatear con oxfmt
pnpm fmt:check        # Verificar formato
```

> El `postinstall` ejecuta `nuxt prepare` automáticamente para generar tipos en `.nuxt/`.

---

## Límites (Boundaries)

### Siempre

- Usar `pnpm` para instalar paquetes y ejecutar scripts
- Usar `NuxtLink` / `ULink` para navegación interna (nunca `<a>`)
- Cifrar datos sensibles antes de enviarlos al backend
- Usar `useState` en memoria para la master password (nunca `localStorage` ni `sessionStorage`)
- Ejecutar `pnpm lint` y `pnpm fmt` antes de dar un cambio por completado
- Usar tokens de `@nuxt/ui` y variables CSS del design system
- Validar formularios con Zod v4
- Usar `$t('key')` o `useI18n()` para textos traducidos

### Preguntar primero

- Modificar la estructura de cifrado (`useCrypto.ts`)
- Cambiar las variables de entorno o su nombre
- Modificar `nuxt.config.ts` (módulos, runtimeConfig)
- Añadir nuevas dependencias
- Cambiar el middleware de autenticación
- Modificar tipos en `types/vault.ts`

### Nunca

- Usar `any` en TypeScript
- Commitear `.env` o secretos
- Persistir la master password en disco, `localStorage` o `sessionStorage`
- Enviar datos sin cifrar al backend
- Usar `<a>` para navegación interna
- Importar `ref`, `computed`, `useState`, `defineNuxtConfig` etc. (Nuxt 4 tiene auto-imports)
- Modificar archivos en `.nuxt/`, `.output/`, `node_modules/`, `dist/`, `public/`
- Añadir comentarios a menos que se pida explícitamente
- Usar npm, yarn o bun

---

## Estructura del proyecto

```
app/
├── app.vue                    # Entry point
├── assets/css/main.css        # Design system (tokens CSS, componentes)
├── components/                # Componentes Vue (PascalCase)
│   └── vault/forms/           # Formularios de bóveda (password, note, card, identity)
├── composables/               # Lógica de negocio (camelCase)
│   ├── useCrypto.ts           # Cifrado AES-256-GCM + Argon2id
│   ├── useVault.ts            # CRUD de ítems
│   ├── useAuthForm.ts         # Login
│   ├── useRegisterForm.ts     # Registro
│   ├── useMasterPassword.ts   # Master password en memoria (useState)
│   ├── useAutoLock.ts         # Bloqueo por inactividad
│   └── usePasswordGenerator.ts
├── layouts/
│   ├── default.vue            # Layout público (header + footer)
│   └── vault.vue              # Layout bóveda (sin header)
├── middleware/
│   ├── auth.ts                # Protege rutas → /login
│   └── guest.ts               # Protege rutas guest → /boveda
├── pages/
│   ├── index.vue              # Landing
│   ├── login/                 # Login + unlock post-OAuth
│   ├── register/              # Registro
│   ├── pricing/               # Planes
│   └── boveda/                # Dashboard, new, [id], perfil
├── types/
│   └── vault.ts               # Tipos de ítems
└── utils/
    └── securityScore.ts       # Fuerza de contraseña

server/api/auth/               # Auth handler (@sidebase/nuxt-auth)
i18n/locales/                  # es.json, en.json
```

---

## Convenciones de código

- **TypeScript estricto**. No usar `any`.
- **Composables** encapsulan toda la lógica de negocio. Las páginas solo consumen.
- Componentes en `PascalCase`, archivos de composables/utils en `camelCase`.
- Preferir tokens de `@nuxt/ui` y variables CSS del design system (`--accent`, `--surface-*`, `--border-*`).
- Nuxt 4.4 con auto-imports — no importar `ref`, `computed`, `useState`, `defineNuxtConfig`, etc.

---

## UI y estilos

- **@nuxt/ui v4** como librería de componentes.
- **Tailwind CSS 4** con `@tailwindcss/vite`.
- Colores: modo dark por defecto (`preference: "dark"`, `fallback: "dark"`).
- Tipografía: `Instrument Sans` (headings) + `DM Sans` (body) vía `@nuxt/fonts`.
- Estilos globales en `app/assets/css/main.css` (tokens CSS, clases `.btn`, `.btn-accent`, `.btn-ghost`, animaciones `fadeUp`).

---

## Autenticación

- **@sidebase/nuxt-auth** con NextAuth 4.
- Providers: OAuth (GitHub, Google) + email/password (backend Go).
- Cookie `httpOnly` con JWT (`auth_token`).
- Middleware `auth.ts` protege rutas `/boveda/**`.
- Middleware `guest.ts` redirige usuarios autenticados fuera de `/login` y `/register`.

---

## Cifrado (zero-knowledge)

- **AES-256-GCM** con salt + iv aleatorios por operación.
- **Argon2id** con 3 iteraciones, 64 MB de memoria y paralelismo 2 para derivar la clave desde la master password.
- Cada ítem se serializa como JSON → cifra → envía `{ encrypted_data, iv, salt }` al backend.
- El backend solo almacena blobs cifrados opacos.

---

## Tipos de ítems de la bóveda

| Tipo       | Campos sensibles                                           |
| ---------- | ---------------------------------------------------------- |
| `password` | `username`, `password`, `url`                              |
| `note`     | `note`                                                     |
| `card`     | `holder`, `number`, `expiry`, `cvv`                        |
| `identity` | `firstName`, `lastName`, `email`, `phone`, `address`, etc. |

---

## Linting y formateo

- **oxlint** con plugin Vue. Reglas: `correctness: warn`, `suspicious: warn`.
- **oxfmt** para formateo.
- Ejecutar `pnpm lint` y `pnpm fmt` antes de considerar un cambio completo.
- Ignora: `.nuxt/`, `.output/`, `node_modules/`, `dist/`, `public/`, `.agents/`.

---

## i18n

- **@nuxtjs/i18n** con estrategia `no_prefix`.
- Idiomas: `es` (default), `en`.
- Archivos en `i18n/locales/`.
- Usar `$t('key')` en templates y `useI18n()` en composables/scripts.

---

## Variables de entorno

| Variable                         | Descripción                |
| -------------------------------- | -------------------------- |
| `NUXT_SECRET`                    | Secret para NextAuth       |
| `NUXT_AUTH_BASE_URL`             | URL base de la API de auth |
| `NUXT_AUTH_GITHUB_CLIENT_ID`     | GitHub OAuth client ID     |
| `NUXT_AUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `NUXT_AUTH_GOOGLE_CLIENT_ID`     | Google OAuth client ID     |
| `NUXT_AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NUXT_PUBLIC_API_BASE`           | URL del backend Go         |

> Nunca commitear `.env`. Está en `.gitignore`.

---

## Rutas

| Ruta             | Middleware | Layout  | Descripción                |
| ---------------- | ---------- | ------- | -------------------------- |
| `/`              | —          | default | Landing page               |
| `/login`         | guest      | default | Login                      |
| `/login/unlock`  | —          | default | Master password post-OAuth |
| `/register`      | guest      | default | Registro                   |
| `/pricing`       | —          | default | Planes                     |
| `/boveda`        | auth       | vault   | Dashboard                  |
| `/boveda/new`    | auth       | vault   | Crear ítem                 |
| `/boveda/[id]`   | auth       | vault   | Ver/editar ítem            |
| `/boveda/perfil` | auth       | vault   | Perfil                     |

---

## Notas importantes

- Si hay errores de tipos tras cambiar imports, ejecutar `pnpm install` para regenerar.
- Zod v4 se usa para validación de formularios.
- El color mode está forzado a dark.
