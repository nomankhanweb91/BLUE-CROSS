import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          donations: path.resolve(__dirname, 'donations.html'),
          learning: path.resolve(__dirname, 'learning.html'),
          english: path.resolve(__dirname, 'english.html'),
          hindi: path.resolve(__dirname, 'hindi.html'),
          words: path.resolve(__dirname, 'words.html'),
          numbers: path.resolve(__dirname, 'numbers.html'),
          science: path.resolve(__dirname, 'science.html'),
          arts: path.resolve(__dirname, 'arts.html'),
          games: path.resolve(__dirname, 'games.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          news: path.resolve(__dirname, 'news.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          privacy: path.resolve(__dirname, 'privacy-policy.html'),
          terms: path.resolve(__dirname, 'terms.html'),
          racing: path.resolve(__dirname, 'racing.html'),
          poem: path.resolve(__dirname, 'poem.html'),
          slate: path.resolve(__dirname, 'slate.html'),
          piano: path.resolve(__dirname, 'piano.html'),
          pahada: path.resolve(__dirname, 'pahada.html'),
          hindiClass: path.resolve(__dirname, 'hindi-class.html'),
          englishHindi: path.resolve(__dirname, 'english-hindi.html'),
          learnAz: path.resolve(__dirname, 'learn-az.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
