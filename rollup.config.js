import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.ts',
	output: {
		sourcemap: true,
		format: 'umd', 	//'umd', 'cjs'
		name: 'cx',
		file: 'out/cx.min.js'
	},
	plugins: [
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({ browser: true }),
		commonjs(),
		typescript({
			sourceMap: true, // !production,
			inlineSources: !production,
			// compilerOptions: {
			// 	"moduleResolution": "node",
			// 	"target": "es2017",
			// 	"isolatedModules": true,
			// }
		}),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
