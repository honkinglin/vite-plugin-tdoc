import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import pkg from './package.json';

export default [
	{
		input: 'src/main.js',
		output: [
			{ file: pkg.main, format: 'cjs', exports: "auto" },
			{ file: pkg.module, format: 'es', exports: "auto" },
		],
		plugins: [
			resolve({ preferBuiltins: true }),
			commonjs(),
			json(),
		]
	}
];
