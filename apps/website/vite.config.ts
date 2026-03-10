import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks: undefined,
      },
    },
    // We want to make sure css is included or inline. Setting cssCodeSplit to false helps.
    cssCodeSplit: false,
  },
})
