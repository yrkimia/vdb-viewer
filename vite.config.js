import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: './',              // Ensures relative paths for assets
    build: {
        outDir: 'dist',      // Output directory for production build
        assetsDir: 'assets', // Directory to store static assets
    },
    server: {
        host: true,
        port: 3000,
    },
});
