const esmRequire = require( 'esm' )( module );

const getDeprecatedMatches = esmRequire( '../src/get-deprecated-matches' ).default;

test( 'getDeprecatedMatches', () => {
	const styleSheet = {
		cssRules: [
			{ id: 0, selectorText: '' },
			{ id: 1, selectorText: '.editor-autocomplete foo' },
			{ id: 2, selectorText: '.editor-autocomplete--inner foo' },
		],
	};
	expect( getDeprecatedMatches( styleSheet ) ).toEqual( [
		{
			match: '.editor-autocomplete',
			rule: styleSheet.cssRules[ 1 ],
		},
		{
			match: '.editor-autocomplete--inner',
			rule: styleSheet.cssRules[ 2 ],
		},
	] );
} );
