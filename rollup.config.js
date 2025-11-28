import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json'; // Handles bundling of the JSON data
import { terser } from 'rollup-plugin-terser';

const commonPlugins = [
	// Keep JSON as a basic shared plugin
	json(),
];

// Browser-specific plugin set — resolve MUST come before commonjs
const browserPlugins = [
	...commonPlugins,
	resolve({ browser: true, preferBuiltins: false }),
	commonjs({
		include: /node_modules/,
		transformMixedEsModules: true
	}),
];

// Node-specific plugin set — resolve before commonjs for Node build too
const nodePlugins = [
	...commonPlugins,
	resolve(),
	commonjs({
		include: /node_modules/,
		transformMixedEsModules: true
	}),
];

export default [
	// --- 1. CDN / Browser Build (UMD/IIFE) ---
	{
		input: 'index.js',
		plugins: browserPlugins,
		output: {
			file: 'dist/zip-coords-us.min.js',
			format: 'umd',               // Universal Module Definition
			name: 'ZipCoordsUS',         // global var: window.ZipCoordsUS
			// removed forced `exports: 'default'` so Rollup will infer exports (avoids the error)
			plugins: [terser()],         // Minify the output
		},
	},

	// --- 2. Node.js/Module Build (CommonJS) ---
	{
		input: 'index.js',
		plugins: nodePlugins,
		output: {
			file: 'dist/index.js',
			format: 'cjs',
			exports: 'auto'
		},
	},
];