<?php
/**
 * Plugin Name: Find deprecated CSS in WordPress 5.2
 * Plugin URI: https://github.com/mcsf/find-deprecated-css-in-wp52
 * Description: Helps developers spot selectors in their sites' CSS that rely on classes deprecated in WordPress 5.2. Once installed, open your browser console as you navigate to the block editor or the front end. For context, see dev note <a href="https://make.wordpress.org/core/2019/04/09/the-block-editor-javascript-module-in-5-2/ for context">The Block Editor JavaScript module in 5.2</a>.
 * Author: Miguel Fonseca
 * Author URI: https://github.com/mcsf
 */

function fdcw52_assets() {
	wp_enqueue_script(
		'fdcw52-find-css-deprecations',
		plugins_url( 'find-deprecated-css-in-wp52.js', __FILE__ ),
		array( 'wp-data' )
	);
}
add_action( 'enqueue_block_assets', 'fdcw52_assets' );
