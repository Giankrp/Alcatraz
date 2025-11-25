# Alcatraz

Aplicación construida con Nuxt 4 (Vue 3) que presenta una landing y un flujo de autenticación moderno usando `@nuxt/ui` y validación con `zod`. Orientada a un gestor de contraseñas y notas cifradas, con foco en accesibilidad, rendimiento y un modo oscuro consistente.

Para guía oficial de Nuxt revisa la [documentación](https://nuxt.com/docs/getting-started/introduction).

## Setup

Instala las dependencias:

```bash
# pnpm
pnpm install

# npm / yarn / bun
npm install
yarn install
bun install
```

## Development Server

Arranca el servidor de desarrollo en `http://localhost:3000`:

```bash
# pnpm
pnpm dev

# npm / yarn / bun
npm run dev
yarn dev
bun run dev
```

## Production

Construye la aplicación para producción:

```bash
# pnpm
pnpm build

# npm / yarn / bun
npm run build
yarn build
bun run build
```

Previsualiza el build de producción localmente:

```bash
# pnpm
pnpm preview

# npm / yarn / bun
npm run preview
yarn preview
bun run preview
```

Consulta la [documentación de despliegue](https://nuxt.com/docs/getting-started/deployment) para más información.

## Estado del proyecto

- Framework: Nuxt 4 + Vue 3
- UI: `@nuxt/ui` con Tailwind v4 (`@tailwindcss/vite`)
- Validación: `zod`
- Tipado: TypeScript

## Propósito del proyecto

- Proveer una base sólida en Nuxt 4 con `@nuxt/ui` para construir interfaces de alta calidad.
- Implementar un formulario de acceso con `UAuthForm`, validación (`zod`) y estilos oscuros.
- Mostrar una landing de producto con componentes reutilizables (`SecurityCard`, `AuthHeader`).

## Requisitos del sistema

- Node.js 18 o superior (recomendado 18.18+)
- pnpm 10 (o npm/yarn/bun)
- Navegador moderno (Chrome, Firefox, Edge, Safari)

Dependencias principales:

- `nuxt` ^4.2.1
- `@nuxt/ui` ^4.1.0
- `tailwindcss` ^4.1.17 + `@tailwindcss/vite`
- `zod` ^3.24.0

## Instalación paso a paso

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd Alcatraz

# Instalar dependencias (recomendado)
pnpm install

# Alternativas
npm install    # o
yarn install   # o
bun install
```

> Nota: El script `postinstall` ejecuta `nuxt prepare` y genera tipos en `.nuxt` automáticamente.

## Configuración inicial requerida

- No se requieren variables de entorno para arrancar el proyecto.
- La configuración de módulos se encuentra en `nuxt.config.ts` y carga `@nuxt/ui` y `tailwindcss/vite`.
- Los estilos globales están en `app/assets/css/main.css` y deben importarse en `nuxt.config.ts` con `css: ["~/app/assets/css/main.css"]`.

Si vas a integrar autenticación real (OAuth/sesiones), añade la configuración correspondiente en tiempo de ejecución y variables de entorno.

## Ejemplos de uso básico

Arrancar el servidor de desarrollo en `http://localhost:3000`:

```bash
pnpm dev
# npm run dev / yarn dev / bun run dev
```

Construir para producción y previsualizar:

```bash
pnpm build && pnpm preview
# npm run build && npm run preview
```

Rutas de ejemplo:

- Landing: `/` (`app/pages/index.vue`).
- Inicio de sesión: `/login` (`app/pages/login.vue`).

Formulario de autenticación (extracto):

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import type { AuthFormField, ButtonProps, FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  // Usa default(false) si quieres evitar undefined en el checkbox
  remember: z.boolean().default(false)
})

const fields = ref<AuthFormField[]>([
  { name: 'email', type: 'email', label: 'Email', placeholder: 'tu@correo.com' },
  { name: 'password', type: 'password', label: 'Contraseña', placeholder: '••••••••' },
  { name: 'remember', type: 'checkbox', label: 'Recordar credenciales' }
])

const providers = ref<ButtonProps[]>([
  { label: 'Google', icon: 'i-logos-google-icon', color: 'neutral', variant: 'soft' },
  { label: 'GitHub', icon: 'i-logos-github-icon', color: 'neutral', variant: 'soft' }
])

function onSubmit(e: FormSubmitEvent<any>) {
  // Integrar aquí tu lógica de autenticación real
}
</script>

<template>
  <UAuthForm
    title="Inicia sesión"
    :schema="schema"
    :fields="fields"
    :providers="providers"
    @submit="onSubmit"
  />
</template>
```

## Arquitectura y estructura

```text
Alcatraz/
├─ app/
│  ├─ pages/
│  │  ├─ index.vue
│  │  └─ login.vue
│  ├─ components/
│  │  ├─ AuthHeader.vue
│  │  └─ SecurityCard.vue
│  └─ assets/
│     └─ css/main.css
├─ public/
│  └─ robots.txt
├─ nuxt.config.ts
├─ package.json
├─ tsconfig.json
└─ README.md
```

Diagrama (simplificado):

```mermaid
flowchart TD
flowchart TD
  A["nuxt.config.ts<br>modules: @nuxt/ui, tailwindcss/vite<br>css: ~/app/assets/css/main.css"] --> B[app/pages]
  A --> C[app/assets/css]
  B --> D[index.vue]
  B --> E[login.vue]
  E --> F[UAuthForm + zod]
  D --> G[Landing + componentes]
  G --> H[AuthHeader]
  G --> I[SecurityCard]

```

## Convenciones del proyecto

- Usa `NuxtLink` para navegación interna; reserva `<a>` para enlaces externos.
- Prefiere tokens de `@nuxt/ui` (`bg-background`, `text-foreground`) en vez de overrides globales del `body`.
- Mantén componentes en `app/components` y páginas en `app/pages`.
- Evita añadir `vue-router`: Nuxt provee routing automáticamente.

## Checklist rápida

- Node 18+ instalado y gestor `pnpm` configurado.
- Dependencias instaladas con `pnpm install`.
- `nuxt.config.ts` incluye `css: ["~/app/assets/css/main.css"]`.
- Rutas funcionales: `/` y `/login`.
- Validación `zod` coherente con los nombres de campos del formulario.

## Problemas conocidos y recomendaciones

- Estilos globales: si los colores no corresponden al tema, elimina overrides de `body` y usa tokens de `@nuxt/ui`.
- Dependencias: retira `vue-router` si no hay importaciones; no es necesario en Nuxt.
- Enlaces del Footer: evita enlaces a rutas no existentes para prevenir 404.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Si necesitas una copia formal, añade un archivo `LICENSE` con el texto de la licencia MIT.

## Troubleshooting (problemas comunes)

- Node incompatible: asegúrate de usar Node 18+ (`node -v`).
- Dependencias no instaladas: ejecuta `pnpm install` y verifica que no haya errores.
- Tipos/auto-imports de Nuxt: si ves errores, ejecuta `pnpm run postinstall` o `nuxt prepare` para regenerar `.nuxt`.
- Estilos/Íconos de `@nuxt/ui`: confirma que el módulo está habilitado en `nuxt.config.ts` y que tu navegador soporta los iconos.
- Validación con `zod`: verifica que el esquema corresponda con los `name` de los campos.
- Botón de submit no responde: valida que estés usando `@submit="onSubmit"` en `UAuthForm` y sin interferencias de `state/validate` personalizados.

Para despliegue, consulta la guía oficial de Nuxt: https://nuxt.com/docs/getting-started/deployment
