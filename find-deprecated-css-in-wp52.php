<?php
/**
 * Plugin Name: Find deprecated CSS in WordPress 5.2
 */

function fdcw52_assets() {
	wp_enqueue_style(
		'fdcw52-style',
		plugins_url( 'style.css', __FILE__ )
	);
	wp_enqueue_script(
		'fdcw52-find-css-deprecations',
		plugins_url( 'dist.js', __FILE__ ),
		array( 'wp-data' )
	);
}
add_action( 'enqueue_block_assets', 'fdcw52_assets' );
