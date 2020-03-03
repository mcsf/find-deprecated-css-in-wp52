export default {
	input: 'src/index.js',
	external: ['@wordpress/data'],
	output: {
		file: 'find-deprecated-css-in-wp52.js',
		format: 'iife',
		name: 'CssDeprecations',
		globals: {
			'@wordpress/data': 'wp.data'
		}
	}
};
