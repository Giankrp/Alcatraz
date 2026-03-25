# app/components/

Componentes reutilizables de UI para Alcatraz.

## Estructura

```text
components/
├── AuthHeader.vue          # Header de autenticación
├── SecurityCard.vue        # Card informativa (landing)
├── Footer.vue              # Pie de página global
└── vault/forms/            # Formularios de la bóveda
    ├── TypeSelector.vue    # Selector de tipo de ítem
    ├── FormLayout.vue      # Layout compartido para forms
    ├── PasswordForm.vue    # Formulario de contraseñas
    ├── NoteForm.vue        # Formulario de notas cifradas
    ├── CardForm.vue        # Formulario de tarjetas bancarias
    └── IdentityForm.vue    # Formulario de identidades
```

---

## Componentes globales

### `AuthHeader.vue`

Encabezado accesible para vistas de autenticación (login, registro).

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|------------|
| `title` | `string` | — | Título principal (requerido) |
| `subtitle` | `string?` | — | Subtítulo descriptivo |
| `icon` | `string?` | `i-heroicons-lock-closed` | Icono de `@nuxt/ui` |
| `align` | `'left' \| 'center'` | `'center'` | Alineación del contenido |
| `inverted` | `boolean?` | — | Invertir colores |

**Slots:** Default slot para contenido adicional.

**Accesibilidad:** `role="banner"`, `aria-label="Encabezado de autenticación"`.

```vue
<AuthHeader
  title="Inicia sesión"
  subtitle="Protegemos tus datos con máxima seguridad"
  icon="i-heroicons-lock-closed"
/>
```

---

### `SecurityCard.vue`

Tarjeta informativa utilizada en la sección de características de la landing.

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|------------|
| `title` | `string` | — | Título de la card |
| `description` | `string` | — | Descripción |
| `icon` | `string?` | `i-heroicons-information-circle` | Icono |

```vue
<SecurityCard
  title="Cifrado AES-256"
  description="Tus contraseñas se cifran con estándar militar"
  icon="i-heroicons-shield-check"
/>
```

Usa la clase `.landing-card` del design system con hover effect (elevación).

---

### `Footer.vue`

Pie de página global con 4 columnas:

| Columna | Enlaces |
|---------|---------|
| **Marca** | Logo + descripción |
| **Producto** | Características, Seguridad, Precios, Descargas |
| **Empresa** | Sobre Nosotros, Blog, Carreras, Contacto |
| **Legal** | Privacidad, Términos, Cookies, Licencias |

Se renderiza solo en el layout `default` y se oculta automáticamente en rutas `/boveda/*`.

---

## Componentes de la bóveda (`vault/forms/`)

Formularios para crear y editar los 4 tipos de ítems de la bóveda. Todos emiten los mismos eventos:

| Evento | Payload | Descripción |
|--------|---------|------------|
| `@save` | `object` | Datos del formulario listos para guardar |
| `@back` | — | Navegación hacia atrás |
| `@select` | `string` | Solo TypeSelector: tipo seleccionado |

### `TypeSelector.vue`

Pantalla de selección del tipo de ítem a crear. Muestra 4 botones con iconos que emiten `@select` con el tipo elegido.

### `FormLayout.vue`

Layout compartido que envuelve a todos los formularios. Proporciona estructura consistente (título, botón volver, botón guardar).

### `PasswordForm.vue`

Formulario para contraseñas con campos: `title`, `username`, `password`, `url`, `folder`.

### `NoteForm.vue`

Formulario para notas cifradas con campos: `title`, `note`, `folder`.

### `CardForm.vue`

Formulario para tarjetas bancarias con campos: `title`, `holder`, `number`, `expiry`, `cvv`, `folder`.

### `IdentityForm.vue`

Formulario para identidades con campos: `title`, `firstName`, `lastName`, `email`, `phone`, `address`, `licenseNumber?`, `passportNumber?`, `folder`.

---

## Props comunes en formularios

Todos los formularios (excepto TypeSelector) aceptan:

| Prop | Tipo | Descripción |
|------|------|------------|
| `initialData` | `Partial<VaultItem>?` | Datos para modo edición |
| `loading` | `boolean?` | Estado de guardado |
