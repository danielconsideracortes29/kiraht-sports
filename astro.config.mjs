import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Raiz deste projeto (preview-astro). Tudo o que o build lê está aqui dentro,
// então a pasta pode ser a raiz do repositório no GitHub/Netlify.
const PROJECT_ROOT = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: "static", // site 100% estático: HTML, CSS, JS e mídia em dist/
  outDir: "./dist",
  vite: { define: { __PROJECT_ROOT__: JSON.stringify(PROJECT_ROOT) } },
});
