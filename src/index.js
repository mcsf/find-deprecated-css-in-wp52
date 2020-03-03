/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/*
 * Internal dependencies
 */
import store, { storeKey } from './store';
import formatPercentage from './format-percentage';

store.subscribe( () => {
	const { getDeprecations, getProgress } = select( storeKey );
	const progress = getProgress();
	console.log( `Scanning CSS… ${ formatPercentage( progress ) }` );
	if ( progress === 1 ) {
		getDeprecations().forEach( warnDeprecation );
	}
} );

function warnDeprecation( { rule, match, backwardsCompatible }, i ) {
	const origin = rule.parentStyleSheet.href ?
		`stylesheet ${ rule.parentStyleSheet.href }` :
		`inline stylesheet`;
	const warning = `Deprecated class \`${ match }\` found in ${ origin }.`;
	const details = `For debugging, see \`wp.data.select( '${ storeKey }' ).getDeprecations()[ ${ i } ]\`.`;
	console[ backwardsCompatible ? 'info' : 'warn' ]( warning, details );
}

dispatch( storeKey ).start( document.styleSheets );
