const esmRequire = require( 'esm' )( module );

const getDeprecatedMatches = esmRequire( '../src/get-deprecated-matches' ).default;
const { matchDeprecations } = esmRequire( '../src/get-deprecated-matches' );

test( 'matchDeprecations', () => {
	// Directly corresponds to component namespace `autocomplete`
	expect( matchDeprecations( '.editor-autocomplete foo' ) )
		.toEqual( '.editor-autocomplete' );
	// Belongs to component namespace `autocomplete`
	expect( matchDeprecations( '.editor-autocomplete--inner foo' ) )
		.toEqual( '.editor-autocomplete--inner' );
	// Despite string match, is unrelated to component namespace `autocomplete`
	expect( matchDeprecations( '.editor-autocompleters__block foo' ) )
		.toEqual( null );
} );

test( 'getDeprecatedMatches', () => {
	const styleSheet = {
		cssRules: [
			{ id: 0, selectorText: '' },
			{ id: 1, selectorText: '.editor-autocomplete foo' },
			{ id: 2, selectorText: '.editor-autocomplete--inner foo' },
			{ id: 3, selectorText: '.editor-autocompleters__block .block-editor-block-icon' },
			{ id: 4, selectorText: '.block-editor-autocomplete--inner foo, .editor-autocomplete--inner foo' },
		],
	};
	expect( getDeprecatedMatches( styleSheet ) ).toEqual( [
		{
			match: '.editor-autocomplete',
			rule: styleSheet.cssRules[ 1 ],
			backwardsCompatible: false,
		},
		{
			match: '.editor-autocomplete--inner',
			rule: styleSheet.cssRules[ 2 ],
			backwardsCompatible: false,
		},
		{
			match: '.editor-autocomplete--inner',
			rule: styleSheet.cssRules[ 4 ],
			backwardsCompatible: true,
		},
	] );
} );
