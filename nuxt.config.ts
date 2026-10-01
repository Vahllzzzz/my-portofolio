// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  app: {
    head: {
      script: [
        {
          innerHTML:
            "try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}",
        },
      ],
      title: 'Reihan Azka Vahlepy - Portfolio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Frontend Developer, 3D Artist, and Game Developer portfolio showcasing interactive projects and creative work.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  vite: {
    optimizeDeps: {
      include: ['gsap', 'three']
    },
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: tag => tag === 'Suspense'
        }
      }
    }
  }
})
