(function(){
	'use strict';

	/**
	 * Collection of library objects and methods to prepare for global scope exposure
	 */
	var AccessUtilities = {
		include: include,
		main: main
	};

	/**
	 * Configuration and methods arbitrating script imports
	 */
	var Imports = {
		// Static root filepath
		root: '.',
		// List of script file names as imported via include()
		scripts: [],
		// Number of still-pending script imports
		pending: 0,
		// Timeout before verifying that all external script
		// loading has finished/application can be started
		doneTimer: null,

		/**
		 * ## - Imports.checkIfDone()
		 *
		 * Verifies that no script imports are still pending, and if so
		 * calls the Imports.on.loadedAll completion handler
		 */
		checkIfDone: function () {
			if (Imports.pending === 0) {
				Imports.on.loadedAll();
			}
		},

		// Script load status handlers
		on: {
			/**
			 * ## - Imports.on.loadedOne()
			 *
			 * Returns a custom single-script load completion handler function which removes the script node from the DOM,
			 * decrements Imports.pending, and queues the Imports.checkIfDone process if no remaining scripts are pending
			 * @param {script} [HTMLElement] : The script tag to remove
			 */
			loadedOne: function (script) {
				return function () {
					Core.DOM.remove(script);

					if (--Imports.pending <= 0) {
						window.clearTimeout(Imports.doneTimer);

						Imports.doneTimer = window.setTimeout(
							Imports.checkIfDone, 250
						);
					}
				};
			},

			/**
			 * ## - Imports.on.loadedAll()
			 *
			 * Event handler for full script import completion; kicks off the class generation process
			 */
			loadedAll: function () {
				Core.generate();
			},

			/**
			 * ## - Imports.on.error()
			 *
			 * Returns a custom single-script load error handler function which warns about the script file path
			 * @param {script} [HTMLElement] : The script tag to reference
			 */
			error: function (script) {
				return function () {
					console.warn('Failed to load: ' + script.src);
				};
			}
		}
	};

	/**
	 * A private namespace of convenience methods for internal library use only
	 */
	var A = {
		/**
		 * ## - A.instanceOf()
		 *
		 * Evaluates whether or not a value is an instance of a particular class.
		 * @param {value} [*] : The value to check against
		 * @param {instance} [Function] : The class instance to check the {value} against
		 */
		instanceOf: function (value, instance) {
			return (value instanceof instance);
		},

		/**
		 * ## - A.func()
		 *
		 * Evaluates whether or not a variable assignee is already a function, and returns
		 * an anonymous function to override it if not. Otherwise, returns the assignee.
		 * @param {assignee} [*] : The variable to check against
		 */
		func: function (assignee) {
			if (typeof assignee !== 'function') {
				return function () {};
			}

			return assignee;
		},

		/**
		 * ## - A.each()
		 *
		 * Iterates over an enumerable list of items (either an Object or an Array). Non-recursive.
		 *
		 * For Objects:
		 * Iterates over the unique properties of an object, passing both the key and value into a handler function
		 * @param {list} [Object] : The object to iterate over
		 * @param {handler(key, value)} [Function] : A handler function to act with the key and value data
		 *
		 * For Arrays:
		 * Iterates over the elements in an array, passing the element value and the index into a handler function
		 * @param {list} [Array] : The array to iterate over
		 * @param {handler(value, index)} [Function] : A handler function to act with the value and index
		 */
		each: function (list, handler) {
			handler = A.func(handler);

			if (A.instanceOf(list, Array)) {
				for (var i = 0 ; i < list.length ; i++) {
					handler(list[i], i);
				}
			} else if (A.instanceOf(list, Object) && !A.instanceOf(list, Function)) {
				for (var key in list) {
					if (list.hasOwnProperty(key)) {
						handler(key, list[key]);
					}
				}
			}
		},

		/**
		 * ## - A.extend()
		 *
		 * Extends a target object with properties from an arbitrary number of other objects (deep & recursive)
		 * @param {object1} [Object] : The target object
		 * @param {[object2, [object3, [...]]]} [Object] : Objects used to extend target
		 */
		extend: function () {
			var objects = Array.prototype.slice.call(arguments, 0);
			var target = objects[0];

			while (objects.length > 2) {
				A.extend(target, objects[1]);
				objects.splice(1, 1);
			}

			var extension = objects[1];

			A.each(extension, function (key, value) {
				if (!target.hasOwnProperty(key)) {
					if (typeof value === 'object') {
						A.extend((target[key] = {}), value);
					} else {
						target[key] = value;
					}
				}
			});

			return target;
		},

		/**
		 * ## - A.isInArray()
		 *
		 * Determine whether a value is contained within a one-dimensional array
		 * @param {array} [Array] : The array to search through
		 * @param {value} [*] : The value to search for
		 */
		isInArray: function (array, value) {
			for (var i = 0 ; i < array.length ; i++) {
				if (array[i] === value) {
					return true;
				}
			}

			return false;
		}
	};

	/**
	 * A private namespace of internal core variables and library routines
	 */
	var Core = {
		// Whether or not the main() application entry point callback has been fired
		started: false,

		/**
		 * ## - Core.main()
		 *
		 * A placeholder for the application entry point callback reserved by main()
		 */
		main: A.func(),

		/**
		 * DOM-related routines
		 */
		DOM: {
			/**
			 * ## - Core.DOM.create()
			 *
			 * Create and return a new DOM element
			 * @param {type} [String] : The element tag type
			 */
			create: function (type) {
				return document.createElement(type);
			},

			/**
			 * ## - Core.DOM.append()
			 *
			 * Append a new child element node to the DOM
			 * @param {node} [HTMLElement] : The child element node to append
			 */
			append: function (node) {
				document.body.appendChild(node);
			},

			/**
			 * ## - Core.DOM.remove()
			 *
			 * Remove an existing child element node from the DOM
			 * @param {node} [HTMLElement]: The child element node to remove
			 */
			remove: function (node) {
				document.body.removeChild(node);
			}
		},

		/**
		 * ## - Core.load()
		 *
		 * Asynchronously loads a JavaScript file, updating the Imports scripts list and pending scripts counter 
		 * @param {file} [String] : Script file path
		 */
		load: function (file) {
			Imports.scripts.push(file);
			Imports.pending++;

			var script = Core.DOM.create('script');
			script.onload = Imports.on.loadedOne(script);
			script.onerror = Imports.on.error(script);
			script.src = file;

			Core.DOM.append(script);
		},

		/**
		 * ## - Core.generate()
		 *
		 * Starts the class generation process
		 */
		generate: function () {
			// ...

			Core.main();
		}
	};

	/**
	 * ### - Library method: include()
	 *
	 * Asynchronously loads one or multiple script files by passing the path(s) into Core.load()
	 * @param {file} [String, Array] : The root-relative path(s) to the script file(s)
	 */
	function include (file) {
		if (A.instanceOf(file, Array)) {
			A.each(file, function(script){
				include(script);
			});
		} else {
			var script = Imports.root + '/' + file;

			if (!A.isInArray(Imports.scripts, script)) {
				Core.load(script);
			}
		}
	}

	/**
	 * ### - Library method: main()
	 *
	 * Reserves a callback function to be fired after all script imports are complete
	 * @param {callback} [Function]: A callback function to be fired after all scripts are loaded/classes generated
	 */
	function main (callback) {
		if (!Core.started) {
			Core.main = A.func(callback);
		}
	}

	// Export library utilities to the global scope
	A.extend(window, AccessUtilities);
})();