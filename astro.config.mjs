import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://reaxsol.com", // Cambia por tu dominio final
  trailingSlash: "never",
  adapter: netlify(), // El adaptador se encarga del modo server
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
