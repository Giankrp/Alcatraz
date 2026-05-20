// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@sidebase/nuxt-auth", "@nuxt/fonts", "@nuxt/image", "@nuxtjs/i18n"],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
  },
  auth: {
    provider: {
      type: "authjs",
    },
    globalAppMiddleware: false,
  },
  runtimeConfig: {
    // Config privada (solo server). Sobrescribir con NUXT_BACKEND_BASE en producción.
    // En prod: https://alcatraz-back.vercel.app
    // En dev: http://localhost:8080 (cuando se usa el proxy local)
    backendBase: "",
    secret: "",
    auth: {
      github: {
        clientId: "",
        clientSecret: "",
      },
      google: {
        clientId: "",
        clientSecret: "",
      },
    },
    public: {
      // En producción, setear a "/api/go" para rutear por el proxy Nuxt.
      // En dev, setear a "http://localhost:8080" para llamadas directas al backend.
      apiBase: "",
      auth: {
        // @ts-ignore
        baseURL: "",
        // @ts-ignore
        origin: "",
      },
    },
  },
  app: {
    head: {
      titleTemplate: "%s · Alcatraz",
      htmlAttrs: { lang: "es" },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "description",
          content: "Gestor de contraseñas y notas cifradas con enfoque en seguridad y privacidad.",
        },
        { name: "theme-color", content: "#000000" },
        { property: "og:site_name", content: "Alcatraz" },
        { property: "og:type", content: "website" },
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["zod", "qrcode.vue", "hash-wasm"],
    },
  },

  i18n: {
    locales: [
      { code: "es", file: "es.json" },
      { code: "en", file: "en.json" },
    ],
    defaultLocale: "es",
    langDir: "locales/",
    strategy: "no_prefix",
  },
})
