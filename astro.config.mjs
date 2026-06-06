import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://reaxsol.com", // cambiar por su dominio final
  trailingSlash: "never",
  build: {
    assets: "_assets",
  },
  vite: {
    css: {
      preprocessorOptions: {
        css: { charset: false },
      },
    },
  },
});
