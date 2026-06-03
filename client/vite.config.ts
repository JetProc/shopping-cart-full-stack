import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL ?? ''),
    },
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5173,
    },
  };
});
