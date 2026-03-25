# server/

Capa de servidor de Alcatraz (Nitro). Contiene las rutas API que actúan como **proxy de autenticación** entre el frontend Nuxt y el backend Go.

## Propósito

- Manejar OAuth (GitHub, Google) mediante NextAuth (`@sidebase/nuxt-auth`).
- Verificar la autenticación del usuario a través de la cookie `auth_token`.
- Decodificar el JWT para obtener datos básicos del usuario sin llamar al backend Go.

## Arquitectura

```text
server/
└── api/
    └── auth/
        ├── [...].ts        # NuxtAuthHandler — catch-all de NextAuth
        ├── check.get.ts    # GET /api/auth/check
        └── me.get.ts       # GET /api/auth/me
```

## Rutas API

### `GET /api/auth/check`

Comprueba si existe la cookie `auth_token`. No valida el JWT, solo verifica presencia.

**Respuesta:**
```json
{ "authenticated": true }
```

**Uso:** Middleware `auth.ts` y `guest.ts` del frontend consultan este endpoint para decidir redirecciones.

---

### `GET /api/auth/me`

Decodifica el payload del JWT almacenado en `auth_token` (sin verificar firma — el backend Go gestiona la autenticación real).

**Respuesta (200):**
```json
{
  "email": "user@example.com",
  "createdAt": "2026-03-01T12:00:00.000Z"
}
```

**Error (401):**
```json
{ "statusMessage": "Not authenticated" }
```

**Campos extraídos del JWT:**
- `email` → `payload.email` o `payload.sub`
- `createdAt` → `payload.iat` convertido a ISO string

---

### `[...].ts` — NuxtAuthHandler (catch-all)

Handler de NextAuth que gestiona todo el flujo OAuth. Registra dos proveedores:

| Proveedor | Config key |
|-----------|-----------|
| **GitHub** | `runtimeConfig.auth.github.{clientId, clientSecret}` |
| **Google** | `runtimeConfig.auth.google.{clientId, clientSecret}` |

Las credenciales se inyectan vía variables de entorno:
- `NUXT_AUTH_GITHUB_CLIENT_ID` / `NUXT_AUTH_GITHUB_CLIENT_SECRET`
- `NUXT_AUTH_GOOGLE_CLIENT_ID` / `NUXT_AUTH_GOOGLE_CLIENT_SECRET`
- `NUXT_SECRET` — secret de sesión de NextAuth

**Callback URLs:**
- Login OAuth → `/login/unlock` (requiere master password)
- Register OAuth → `/login/unlock?mode=register`

## Cookie `auth_token`

- Establecida por el **backend Go** como `httpOnly`.
- El frontend **nunca** puede leerla directamente desde JavaScript.
- El servidor Nuxt la lee mediante `getCookie(event, 'auth_token')`.
- Contiene un JWT firmado con claims: `email`, `sub`, `iat`, `exp`.

## Dependencias

- `@sidebase/nuxt-auth` 1.2.0
- `next-auth` 4.21.1

## Consideraciones de seguridad

- El endpoint `/api/auth/me` **no verifica** la firma del JWT — confía en que el backend Go ya lo validó al emitirlo.
- Si necesitas verificar la firma, importa la clave pública del backend y valida con `jose` o similar.
- La cookie `auth_token` debe configurarse con `Secure`, `SameSite=Strict` en producción.
