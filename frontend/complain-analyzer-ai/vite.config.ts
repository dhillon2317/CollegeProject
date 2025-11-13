import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      postcss: './postcss.config.cjs',
    },
    define: {
      'process.env': {},
      'import.meta.env': JSON.stringify(env),
    },
    server: {
      port: 3000,
      strictPort: true,
      host: true,
      open: true,
    },
    preview: {
      port: 3000,
      strictPort: true,
      open: true,
    },
    build: {
      target: 'esnext',
      cssMinify: 'esbuild',
      sourcemap: true,
    },
  };
});