import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory and all parent directories
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    css: {
      postcss: './postcss.config.cjs',
    },
    // Expose environment variables to the client
    define: {
      'import.meta.env': JSON.stringify(env)
    },
    server: {
      port: 3000,
      strictPort: true,
      host: true,
    },
    preview: {
      port: 3000,
      strictPort: true,
    },
  };
});