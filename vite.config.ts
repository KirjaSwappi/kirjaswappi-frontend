import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    host: '0.0.0.0',
  },
  define: {
    global: 'globalThis',
  },
});
