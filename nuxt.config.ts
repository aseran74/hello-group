// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
  },

  app: {
    head: {
      title: 'Hello Group',
      htmlAttrs: { lang: 'es' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Syne:wght@500;600;700;800&display=swap',
        },
        { rel: 'icon', type: 'image/png', href: '/brand/logo.png' },
      ],
      meta: [
        { name: 'description', content: 'Hello Group — casas rurales en Asturias' },
        { name: 'theme-color', content: '#0c0c0c' },
      ],
    },
  },

  i18n: {
    locales: [
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'en', language: 'en-GB', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'es',
    lazy: true,
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      cookieKey: 'ha_locale',
      redirectOn: 'root',
    },
  },

  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    adminNotifyEmail: process.env.ADMIN_NOTIFY_EMAIL || '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    public: {
      siteName: 'Hello Group',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
    },
  },

  nitro: {
    preset: 'vercel',
    prerender: {
      crawlLinks: false,
    },
  },
})
