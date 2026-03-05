import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    include: ['tests/**/*.test.{js,jsx}'],
    environment: 'jsdom',
    setupFiles: './client/src/test-setup.js',
  },
});
