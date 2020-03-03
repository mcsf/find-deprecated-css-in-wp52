export default function once( fn ) {
	let result, hasRun = false;
	return ( ...args ) => {
		if ( ! hasRun ) {
			result = fn( ...args );
			hasRun = true;
		}
		return result;
	};
}

