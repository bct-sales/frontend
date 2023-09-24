import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteSingleFile } from "vite-plugin-singlefile";


// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // command === 'serve' on npm run dev
  // command === 'build' on npm run build
  const devBuild = command === 'serve';

  return {
    plugins: [
      react(),
      viteSingleFile(),
      tsconfigPaths()
    ],
    define: {
      ROOT_URL: (devBuild ? JSON.stringify('http://localhost:8000/api/v1') : JSON.stringify('/api/v1')),
    }
  };
});
