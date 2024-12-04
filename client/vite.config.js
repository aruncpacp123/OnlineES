// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from "path"
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Enables `@` as alias for `src`
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'], // Ensures compatibility for different file extensions
  },
  build: {
    //outDir: 'dist', // Specify the output directory for production build
    //assetsDir: 'assets', // Directory for static assets
    rollupOptions: {
      output: {
        //entryFileNames: 'assets/[name].js', // File naming conventions for entry files
        //chunkFileNames: 'assets/[name].js', // File naming conventions for chunks
        //assetFileNames: 'assets/[name].[ext]', // File naming conventions for assets
        format: 'es', // Ensure ES module format for JavaScript
      },
    },
  },
});

