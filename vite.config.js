import { defineConfig } from "vite";
import path from "path";
import { resolve } from "path";

export default defineConfig({
    base: "./", // Chemin relatif pour toutes les ressources
    build: {
        outDir: "dist",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                step1: resolve(__dirname, "step1.html"),
                step2: resolve(__dirname, "step2.html"),
                step3: resolve(__dirname, "step3.html"),
                step4: resolve(__dirname, "step4.html"),
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"), // Optionnel : Alias pour vos imports
        },
    },
});
