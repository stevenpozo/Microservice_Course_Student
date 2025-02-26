import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Aquí estamos configurando el alias @
    },
  },
  server: {
    port: 5173, // Fijar el puerto del frontend
  },
});
