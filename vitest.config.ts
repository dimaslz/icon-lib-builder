import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './test/setup.ts',
		css: true,
		exclude: [
			'**/playwright-tests',
			'**/node_modules',
			'**/.next',
		],
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './'),
		},
	},
});
