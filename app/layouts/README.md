# app/layouts/

Layouts de Nuxt que envuelven las páginas de la aplicación.

## Layouts disponibles

### `default.vue`

Layout principal para las **páginas públicas** (landing, login, register, pricing).

**Incluye:**
- **Header** sticky con logo, navegación (Características, Seguridad), botones de login
- **Footer** (`<Footer />` component)
- **Menú móvil** con `USlideover` (hamburger menu)

**Comportamiento:**
- El header y footer se **ocultan** automáticamente en rutas que empiezan por `/boveda` (`showHeader = !route.path.startsWith('/boveda')`)
- Menú móvil se abre con botón hamburger (visible en `< md`)

**Estructura:**
```
┌──────────────────────┐
│ Header (sticky)      │  ← se oculta en /boveda
├──────────────────────┤
│ <slot /> (contenido) │
├──────────────────────┤
│ Footer               │  ← se oculta en /boveda
└──────────────────────┘
```

---

### `vault.vue`

Layout minimalista para las **páginas de la bóveda** (dashboard, perfil).

**Incluye:**
- Contenedor `min-h-screen bg-black text-white`
- Solo renderiza `<slot />` sin header ni footer

**Se selecciona explícitamente en las páginas:**
```ts
definePageMeta({ layout: 'vault' })
```

**Estructura:**
```
┌──────────────────────┐
│ <slot /> (contenido) │
└──────────────────────┘
```

## ¿Cuándo usar cada layout?

| Layout | Rutas | Header | Footer |
|--------|-------|--------|--------|
| `default` | `/`, `/login`, `/register`, `/pricing` | ✅ | ✅ |
| `vault` | `/boveda`, `/boveda/perfil` | ❌ | ❌ |
| *(sin layout)* | `/boveda/new`, `/boveda/[id]` | ❌ | ❌ |

> Las páginas `/boveda/new` y `/boveda/[id]` no especifican layout — usan el default pero el header se oculta por la regla `/boveda*`.
