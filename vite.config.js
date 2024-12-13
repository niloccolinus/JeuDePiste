import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/", // Chemin de base pour votre application
  build: {
    outDir: "dist", // Dossier de sortie pour Netlify
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Optionnel : Alias pour vos imports
    },
  },
});
