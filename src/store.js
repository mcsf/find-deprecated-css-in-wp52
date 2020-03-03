/**
 * WordPress dependencies
 */
import { registerStore, createRegistryControl } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getDeprecatedMatches from './get-deprecated-matches';

export const storeKey = 'css-deprecations';

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
	* start( pendingStyleSheets ) {
		yield actions.init( pendingStyleSheets );
		yield actions.run();
	},
	* next( styleSheet ) {
		const deprecations = getDeprecatedMatches( styleSheet );
		yield actions.receiveDeprecations( deprecations );
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

export default store;
