import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages base path configuration: './' makes assets relative and portable
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    host: true
  }
});
