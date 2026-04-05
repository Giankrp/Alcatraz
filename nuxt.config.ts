// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@sidebase/nuxt-auth', '@nuxt/fonts', '@nuxt/image'],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: ''
  },
  auth: {
    baseURL: "http://localhost:3000/api/auth",
    provider: {
      type: "authjs"
    },
    globalAppMiddleware: false
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8080' // Se puede sobrescribir con NUXT_PUBLIC_API_BASE en .env,
    },
    secret: '',
    auth: {
      github: {
        clientId: '',
        clientSecret: ''
      },
      google: {
        clientId: '',
        clientSecret: ''
      }
    }
  },
  app: {
    head: {
      titleTemplate: '%s · Alcatraz',
      htmlAttrs: { lang: 'es' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Gestor de contraseñas y notas cifradas con enfoque en seguridad y privacidad.' },
        { name: 'theme-color', content: '#000000' },
        { property: 'og:site_name', content: 'Alcatraz' },
        { property: 'og:type', content: 'website' }
      ]
    }
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["zod"]
    }
  },
})
