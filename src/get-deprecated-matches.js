/**
 * External dependencies
 */
import diff from 'fast-diff';

/**
 * Internal dependencies
 */
import once from './once';

// Generated from the component list at
// https://make.wordpress.org/core/2019/04/09/the-block-editor-javascript-module-in-5-2/
const movedComponents = [ 'autocomplete', 'alignment-toolbar', 'block-alignment-toolbar', 'block-controls', 'block-edit', 'block-editor-keyboard-shortcuts', 'block-format-controls', 'block-icon', 'block-inspector', 'block-list', 'block-mover', 'block-navigation-dropdown', 'block-selection-clearer', 'block-settings-menu', 'block-title', 'block-toolbar', 'color-palette', 'contrast-checker', 'copy-handler', 'create-custom-colors-hoc', 'default-block-appender', 'font-size-picker', 'get-color-class-name', 'get-color-object-by-attribute-values', 'get-color-object-by-color-value', 'get-font-size', 'get-font-size-class', 'inserter', 'inner-blocks', 'inspector-advanced-controls', 'inspector-controls', 'panel-color-settings', 'plain-text', 'rich-text', 'rich-text-shortcut', 'rich-text-toolbar-button', 'rich-text-inserter-item', 'unstable-rich-text-input-event', 'media-placeholder', 'media-upload', 'media-upload-check', 'multi-blocks-switcher', 'multi-select-scroll-into-view', 'navigable-toolbar', 'observe-typing', 'preserve-scroll-in-reorder', 'skip-to-selected-block', 'url-input', 'url-input-button', 'url-popover', 'warning', 'writing-flow', 'with-color-context', 'with-colors', 'with-font-sizes' ];

export default function getDeprecatedMatches( styleSheet ) {
	if ( ! isAllowedStyleSheet( styleSheet ) ) {
		return [];
	}

	return Array.from( styleSheet.cssRules ).map( ( rule ) => {
		const match = rule.selectorText ? matchDeprecations( rule.selectorText ) : null;
		if ( ! match ) return null;
		const backwardsCompatible = isBackwardsCompatible( rule.selectorText );
		return { rule, match, backwardsCompatible };
	} ).filter( Boolean );
}

export function matchDeprecations( selectorText ) {
	const matches = selectorText.match( generateDeprecationsRegExp() );
	if ( ! matches ) return null;
	return matches[ 0 ];
}

function isBackwardsCompatible( selectorText ) {
	const parts = selectorText.split( ',' );
	if ( parts.length !== 2 ) return false;

	const additions = diff( ...parts )
		// Keep insertions and deletions
		.filter( ( [ type ] ) => type !== 0 )
		// Ignore whitespace hunks
		.filter( ( [ _, text ] ) => text.trim() );

	return additions.length === 1 && additions[ 0 ][ 1 ] === 'block-';
}

function isAllowedStyleSheet( styleSheet ) {
	try {
		styleSheet.cssRules;
	} catch ( e ) {
		return false;
	}
	return true;
}

const generateDeprecationsRegExp = once( () => {
	const disjunction = movedComponents
		.map( ( component ) => `\\.editor-${ component }(?![A-z0-9])[A-z0-9_-]*` )
		.concat( [
			// https://github.com/WordPress/gutenberg/pull/19010
			'.block-editor-block-list__block-edit',
		] )
		.join( '|' );
	return new RegExp( `(${ disjunction })` );
} );
