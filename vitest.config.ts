import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    dir: './__tests__',
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}', 'services/**/*.{ts,tsx}'],
      // Exclude prisma client and UI components from coverage (UI components are generated and not manually written)
      exclude: ['lib/prisma.ts', 'components/ui/**/*.{ts,tsx}'],
    },
  },
});
