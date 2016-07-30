(function(scope, factory) {
	if (typeof module === 'object' && typeof module.exports === 'object') {
		// Likely a node environment; execute factory() and return
		// an object with all library utilities as module exports
		module.exports = factory(scope, true);
	} else {
		// Likely a standard browser environment, so execute factory()
		// to attach all library utilities to the appropriate {scope}
		factory(scope);
	}
})(typeof window !== 'undefined' ? window : this, function(scope, isModule) {
	// Collection of library objects and methods to prepare for outer-scope exposure
	var AccessUtilities = {};

	// Parameters for script importing
	var Imports = {
		// Static root filepath
		root: '',
		// Queue of script files imported via include()
		list: []
	};

	/**
	 * ---------------------------
	 * Method: include()
	 * ---------------------------
	 *
	 * Queues a script file for importing by adding it to the internal {includeList}.
	 *
	 * @param {file} The root-relative path to the script file
	 */
	function include(file) {
		var script = Imports.root + '/' + file;
		// TODO: Ensure script hasn't already been queued
		Imports.list.push(script);
	}

	/**
	 * ---------------------------
	 * Method: main()
	 * ---------------------------
	 *
	 * Kick-starts the actual script loading and subsequent class
	 * generation process, firing a callback upon completion.
	 *
	 * @param {callback} A callback function to be fired after all scripts are loaded/classes generated
	 */
	function main(callback) {

	}

	AccessUtilities = {
		include: include,
		main: main
	};

	/**
	 * Export the library
	 */
	if (isModule) {
		// For environments with module.exports, return the utilities object for group exporting
		return AccessUtilities;
	} else {
		// For other environments, attach each utility to the {scope} object
		for (var util in AccessUtilities) {
			if (AccessUtilities.hasOwnProperty(util)) {
				scope[util] = AccessUtilities[util];
			}
		}
	}
});