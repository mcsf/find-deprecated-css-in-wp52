( function() {
/**
 * WordPress dependencies
 */
const { registerStore, createRegistryControl } = wp.data;
 
const requestIdleCallback = window.requestIdleCallback || window.setTimeout;

// Generated from the component list at
// https://make.wordpress.org/core/2019/04/09/the-block-editor-javascript-module-in-5-2/
const movedComponents = [ 'autocomplete', 'alignment-toolbar', 'block-alignment-toolbar', 'block-controls', 'block-edit', 'block-editor-keyboard-shortcuts', 'block-format-controls', 'block-icon', 'block-inspector', 'block-list', 'block-mover', 'block-navigation-dropdown', 'block-selection-clearer', 'block-settings-menu', 'block-title', 'block-toolbar', 'color-palette', 'contrast-checker', 'copy-handler', 'create-custom-colors-hoc', 'default-block-appender', 'font-size-picker', 'get-color-class-name', 'get-color-object-by-attribute-values', 'get-color-object-by-color-value', 'get-font-size', 'get-font-size-class', 'inserter', 'inner-blocks', 'inspector-advanced-controls', 'inspector-controls', 'panel-color-settings', 'plain-text', 'rich-text', 'rich-text-shortcut', 'rich-text-toolbar-button', 'rich-text-inserter-item', 'unstable-rich-text-input-event', 'media-placeholder', 'media-upload', 'media-upload-check', 'multi-blocks-switcher', 'multi-select-scroll-into-view', 'navigable-toolbar', 'observe-typing', 'preserve-scroll-in-reorder', 'skip-to-selected-block', 'url-input', 'url-input-button', 'url-popover', 'warning', 'writing-flow', 'with-color-context', 'with-colors', 'with-font-sizes' ];

const storeKey = 'css-deprecations';

const DEFAULT_STATE = {
	pendingStyleSheets: [],
	deprecations: [],
	processedSheetsCount: 0,
	initialSheetsCount: 0,
};
 
const actions = {
	init( pendingStyleSheets ) {
		return { type: 'INIT', pendingStyleSheets };
	},
	receiveDeprecations( deprecations ) {
		return { type: 'RECEIVE_DEPRECATIONS', deprecations };
	},
	advance() {
		return { type: 'ADVANCE' };
	},
	* run() {
		yield { type: 'RUN' };
	},
	* start( pendingStyleSheets = document.styleSheets ) {
		yield actions.init( pendingStyleSheets );
		yield actions.run();
	},
	* next( styleSheet ) {
		if ( isAllowedStyleSheet( styleSheet ) ) {
			const deprecations = offendingMatches( styleSheet ).filter( Boolean );
			yield actions.receiveDeprecations( deprecations );
		}
		yield actions.advance();
	},
};
 
const store = registerStore( storeKey, {
    reducer( state = DEFAULT_STATE, action ) {
        switch ( action.type ) {
			case 'INIT':
				const pendingStyleSheets = Array.from( action.pendingStyleSheets );
				return {
					...state,
					pendingStyleSheets,
					processedSheetsCount: 0,
					initialSheetsCount: pendingStyleSheets.length,
				};

			case 'RECEIVE_DEPRECATIONS':
				return {
					...state,
					deprecations: [
						...state.deprecations,
						...action.deprecations,
					],
				};
 
			case 'ADVANCE':
				return {
					...state,
					processedSheetsCount: state.processedSheetsCount + 1,
					pendingStyleSheets: state.pendingStyleSheets.slice( 1 ),
				};
        }
 
        return state;
    },
 
    actions,

	controls: {
		RUN: createRegistryControl( ( registry ) => () => {
			const { getNextStyleSheet } = registry.select( storeKey );
			const { next, run } = registry.dispatch( storeKey );
			const nextStyleSheet = getNextStyleSheet();
			if ( nextStyleSheet ) {
				next( nextStyleSheet );
				requestIdleCallback( run );
			}
		} ),
	},
 
    selectors: {
        getProgress( state ) {
            const { processedSheetsCount, initialSheetsCount } = state;
			return initialSheetsCount ? processedSheetsCount / initialSheetsCount : null;
        },
		getNextStyleSheet( state ) {
			return state.pendingStyleSheets[ 0 ];
		},
		getDeprecations( state ) {
			return state.deprecations;
		},
    },
} );

function main() {
	const { select, dispatch } = wp.data;
	const { getDeprecations, getProgress } = select( storeKey );
	const { start } = dispatch( storeKey );
	store.subscribe( () => {
		const progress = getProgress();
		console.log( formatPercentage( progress ) );
		if ( progress === 1 ) {
			getDeprecations().forEach( warnDeprecation );
		}
	} );
	start();
}

function warnDeprecation( { rule, match }, i ) {
	const origin = rule.parentStyleSheet.href ?
		`stylesheet ${ rule.parentStyleSheet.href }` :
		`inline stylesheet`;
	const warning = `Deprecated class \`${ match }\` found in ${ origin }.`;
	const details = `For debugging, see \`wp.data.select( '${ storeKey }' ).getDeprecations()[ ${ i } ]\`.`;
	console.warn( warning, details );
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
		return match ? { rule, match } : null;
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

function formatPercentage( n ) {
	return `${ Math.floor( n * 100 ) }%`;
}

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
} )();
