import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
        },
        manifest: {
          id: "/",
          scope: "./",
          name: "M.A.P.A.™ Mujer",
          short_name: "M.A.P.A.",
          description: "Mapa de Activación y Protección Emocional - Experiencia interactiva de autodescubrimiento emocional para comprender la ansiedad.",
          start_url: "./",
          display: "standalone",
          background_color: "#040c16",
          theme_color: "#040c16",
          categories: ["health", "lifestyle", "education"],
          orientation: "portrait-primary",
          prefer_related_applications: false,
          icons: [
            {
              src: "icono-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "icono-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable"
            },
            {
              src: "icono-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable"
            }
          ],
          shortcuts: [
            {
              name: "Diario de Emociones",
              short_name: "Diario",
              description: "Registra y comprende tus emociones hoy",
              url: "./",
              icons: [
                {
                  src: "icono-192x192.png",
                  sizes: "192x192",
                  type: "image/png"
                }
              ]
            },
            {
              name: "Ver Mi Progreso",
              short_name: "Progreso",
              description: "Accede al mapa de tus 7 días",
              url: "./",
              icons: [
                {
                  src: "icono-192x192.png",
                  sizes: "192x192",
                  type: "image/png"
                }
              ]
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
