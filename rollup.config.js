export default {
	input: 'src/index.js',
	external: ['@wordpress/data'],
	output: {
		file: 'dist.js',
		format: 'iife',
		name: 'CssDeprecations',
		globals: {
			'@wordpress/data': 'wp.data'
		}
	}
};
