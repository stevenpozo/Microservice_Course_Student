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
<<<<<<< HEAD
  server: {
    port: 5173, // Fijar el puerto del frontend
=======
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
>>>>>>> a81e6539a8c54bcac6e1ccc900f98289e1834546
  },
});
