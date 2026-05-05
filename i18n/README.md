# i18n/

Directorio para la gestión de la internacionalización (i18n) de Alcatraz. Define los diccionarios de texto utilizados en toda la interfaz de usuario para soportar múltiples idiomas de forma dinámica y reactiva.

## Arquitectura de Localización

Utiliza el módulo `@nuxtjs/i18n` para resolver los textos. Los idiomas están estructurados en el subdirectorio `locales/`.

```text
i18n/
└── locales/
    ├── en.json      # Diccionario principal en Inglés
    └── es.json      # Diccionario principal en Español
```

## Convenciones de uso

- Los archivos JSON contienen claves anidadas lógicamente por dominio o página (ej. `pricing.plans.free`, `landing.features`, `auth.login`).
- En los componentes de Vue, los textos se obtienen mediante la función `$t('clave.del.texto')` en las plantillas.
- En los scripts y composables, se invoca a través de `const { t } = useI18n()` (ej: `t('auth.error.unauthorized')`).
- Los componentes que requieran selectores de idioma deben hacer uso del componente compartido `LocaleSwitcher.vue` ubicado en `app/components/`.

## Añadir un nuevo idioma

1. Crear un nuevo archivo `<codigo-iso>.json` en la carpeta `locales/` (ej. `fr.json`).
2. Copiar la estructura de `es.json` o `en.json` y traducir los valores.
3. Registrar el nuevo archivo y la configuración regional (`locale`) dentro de la sección de `i18n` en el archivo raíz `nuxt.config.ts`.
