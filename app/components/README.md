# app/components

Componentes reutilizables de UI para la aplicación.

## Propósito

- Centralizar piezas de interfaz reutilizables con estilos coherentes.
- Mejorar mantenibilidad separando concerns de presentación.

## Componentes

- `AuthHeader.vue`: encabezado accesible para vistas de autenticación.
- `SecurityCard.vue`: tarjeta informativa usada en la landing.

## Dependencias específicas

- `@nuxt/ui`: `UIcon`, `UCard`, `UContainer`, `UButton`, etc.
- `tailwindcss`: utilidades de estilo.

## Ejemplo de uso: `AuthHeader`

```vue
<template>
  <AuthHeader
    title="Inicia sesión"
    subtitle="Protegemos tus datos con máxima seguridad"
    icon="i-heroicons-lock-closed"
    align="center"
  />
</template>
```

## Ejemplo de uso: `SecurityCard`

```vue
<template>
  <SecurityCard
    title="Gestor de Contraseñas"
    description="Genera y almacena contraseñas seguras"
    icon="i-heroicons-key"
  />
</template>
```

## Consideraciones

- Mantener props claras y tipadas; no mezclar lógica de negocio.
- Revisar accesibilidad (roles, `aria-*`, foco visible).

## Troubleshooting

- Íconos no aparecen: confirma `@nuxt/ui` y nombres de íconos.
- Estilos inesperados: valida clases de Tailwind y herencia de estilos.