<?php
/**
 * Plugin Name: S1
 */

function s1_init() {
	if ( function_exists( 'register_block_style' ) ) {
		register_block_style(
			'core/list',
			array(
				'name' => 'dashed-list',
				'label' => 'Dashed',
				'inline_style' => '[data-type="core/list"] .is-style-dashed-list { list-style: none; } [data-type="core/list"] .is-style-dashed-list li::marker { content: "\2013\202f\202f"; }',
			)
		);
	}
}
add_action( 'init', 's1_init' );

function s1_assets() {
	wp_enqueue_style(
		's1-style',
		plugins_url( 'style.css', __FILE__ )
	);
	wp_enqueue_script(
		's1-find-css-deprecations',
		plugins_url( 'dist.js', __FILE__ ),
		array( 'wp-data' )
	);
}
add_action( 'enqueue_block_assets', 's1_assets' );
