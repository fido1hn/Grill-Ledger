// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@nuxtjs/google-fonts",
    "@nuxt/image",
    "@vueuse/motion/nuxt",
  ],

  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: undefined,
      exclude: [],
      cookieRedirect: false,
    },
  },

  googleFonts: {
    families: {
      Inter: "200..700",
    },
  },

  // runtimeConfig: {
  //   public: {
  //     motion: {
  //       directives: {
  //         "press-down": {
  //           initial: {
  //             scale: 1,
  //           },
  //           pressed: {
  //             scale: 0.95,
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
});
