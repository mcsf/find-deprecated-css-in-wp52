// Generated from the component list at
// https://make.wordpress.org/core/2019/04/09/the-block-editor-javascript-module-in-5-2/
const movedComponents = [
	'autocomplete',
	'alignment-toolbar',
	'block-alignment-toolbar',
	'block-controls',
	'block-edit',
	'block-editor-keyboard-shortcuts',
	'block-format-controls',
	'block-icon',
	'block-inspector',
	'block-list',
	'block-mover',
	'block-navigation-dropdown',
	'block-selection-clearer',
	'block-settings-menu',
	'block-title',
	'block-toolbar',
	'color-palette',
	'contrast-checker',
	'copy-handler',
	'create-custom-colors-hoc',
	'default-block-appender',
	'font-size-picker',
	'get-color-class-name',
	'get-color-object-by-attribute-values',
	'get-color-object-by-color-value',
	'get-font-size',
	'get-font-size-class',
	'inserter',
	'inner-blocks',
	'inspector-advanced-controls',
	'inspector-controls',
	'panel-color-settings',
	'plain-text',
	'rich-text',
	'rich-text-shortcut',
	'rich-text-toolbar-button',
	'rich-text-inserter-item',
	'unstable-rich-text-input-event',
	'media-placeholder',
	'media-upload',
	'media-upload-check',
	'multi-blocks-switcher',
	'multi-select-scroll-into-view',
	'navigable-toolbar',
	'observe-typing',
	'preserve-scroll-in-reorder',
	'skip-to-selected-block',
	'url-input',
	'url-input-button',
	'url-popover',
	'warning',
	'writing-flow',
	'with-color-context',
	'with-colors',
	'with-font-sizes',
];

function main() {
	const requestIdleCallback = window.requestIdleCallback ||
		window.requestAnimationFrame ||
		window.setTimeout;

	requestIdleCallback( () => {
		rejectDeprecatedCss( document.styleSheets );
	} );
}

function rejectDeprecatedCss( styleSheets ) {
	CSS_DEPRECATIONS = [];
	Array.from( styleSheets )
		.filter( isAllowedStyleSheet )
		.flatMap( offendingMatches )
		.filter( Boolean )
		.forEach( ( [ rule, match ] ) => {
			CSS_DEPRECATIONS.push( { match, rule } );
			const origin = rule.parentStyleSheet.href ?
				`stylesheet ${ rule.parentStyleSheet.href }` :
				`inline stylesheet`;
			const warning = `Deprecated class \`${ match }\` found in ${ origin }.`;
			const details = `For debugging, see \`CSS_DEPRECATIONS[${ CSS_DEPRECATIONS.length - 1 }]\`.`;
			console.warn( warning, details );
		} );
}

function isAllowedStyleSheet( styleSheet ) {
	try {
		styleSheet.cssRules;
	} catch ( e ) {
		return false;
	}
	return true;
}

function offendingMatches( styleSheet ) {
	return Array.from( styleSheet.cssRules ).map( ( rule ) => {
		const match = rule.selectorText ? matchDeprecations( rule.selectorText ) : null;
		return match ?  [ rule, match ] : null;
	} );
}

function matchDeprecations( selectorText ) {
	const matches = selectorText.match( generateDeprecationsRegExp() );
	if ( ! matches ) return null;
	return matches[ 0 ];
}

const generateDeprecationsRegExp = once( () => {
	const disjunction = movedComponents
		.map( ( component ) => `\\.editor-${ component }($|(\\S+))` )
		.join( '|' );
	return new RegExp( `(${ disjunction })` );
} );

function once( fn ) {
	let result, hasRun = false;
	return ( ...args ) => {
		if ( ! hasRun ) {
			result = fn( ...args );
			hasRun = true;
		}
		return result;
	};
}

main();
