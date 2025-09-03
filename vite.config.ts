import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `game.js`,
        chunkFileNames: `game.js`,
        assetFileNames: (assetInfo) => {
          return 'assets/[name][extname]';
        },
        manualChunks: undefined
      }
    }
  },
  server: { port: 5173, open: true }
});