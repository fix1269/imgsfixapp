import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:      resolve(__dirname, 'index.html'),
        p404:      resolve(__dirname, 'pages/404.html'),
        about:     resolve(__dirname, 'pages/about.html'),
        editor:    resolve(__dirname, 'pages/advanced-editor.html'),
        contact:   resolve(__dirname, 'pages/contact.html'),
        cookies:   resolve(__dirname, 'pages/cookies.html'),
        disclaimer:resolve(__dirname, 'pages/disclaimer.html'),
        faq:       resolve(__dirname, 'pages/faq.html'),
        privacy:   resolve(__dirname, 'pages/privacy-policy.html'),
        qr:        resolve(__dirname, 'pages/qr-reader.html'),
        services:  resolve(__dirname, 'pages/services.html'),
        terms:     resolve(__dirname, 'pages/terms.html'),
        cartoon:   resolve(__dirname, 'pages/tools/cartoon.html'),
        compress:  resolve(__dirname, 'pages/tools/compress.html'),
        convert:   resolve(__dirname, 'pages/tools/convert.html'),
        crop:      resolve(__dirname, 'pages/tools/crop.html'),
        enhance:   resolve(__dirname, 'pages/tools/enhance.html'),
        filters:   resolve(__dirname, 'pages/tools/filters.html'),
        removebg:  resolve(__dirname, 'pages/tools/remove-bg.html'),
        resize:    resolve(__dirname, 'pages/tools/resize.html'),
      }
    }
  }
});
