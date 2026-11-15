import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        builder: fileURLToPath(new URL('./lc-builder.html', import.meta.url)),
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        contact: fileURLToPath(new URL('./contact.html', import.meta.url)),
      },
    },
  },
});
