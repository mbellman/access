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
	 * Options and data for script importing
	 */
	var Imports = {
		// Static root filepath
		root: '.',
		// Queue of script files imported via include()
		scripts: []
	};

	/**
	 * A private namespace of convenience methods for internal library use only
	 */
	var A = {
		/**
		 * ## - A.func()
		 *
		 * Evaluates whether or not a variable assignee is already a function, and returns
		 * an anonymous function to override it if not. Otherwise, returns the assignee.
		 * @param {assignee} : The variable whose type is to be checked against
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
		 * Iterates over unique properties of an object, passing both the key and value into a handler function
		 * @param {object} : The object to iterate over
		 * @param {handler(key, value)} : A handler function to act with the key and value data
		 */
		each: function (object, handler) {
			handler = A.func(handler);
			for (var key in object) {
				if (object.hasOwnProperty(key)) {
					handler(key, object[key]);
				}
			}
		},

		/**
		 * ## - A.extend()
		 *
		 * Extends a target object with properties from an arbitrary number of other objects (deep & recursive)
		 * @param {object1} : The target object
		 * @param {[object2, [object3, [...]]]} : Objects used to extend target
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
		 * @param {array} : The array to search through
		 * @param {value} : The value to search for
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
	 * A private namespace of internal core library routines
	 */
	var Core = {
		/**
		 * DOM-related routines
		 */
		DOM: {
			/**
			 * ## - Core.DOM.create()
			 *
			 * Create and return a new DOM element
			 * @param {type} : The element tag type
			 */
			create: function (type) {
				return document.createElement(type);
			},

			/**
			 * ## - Core.DOM.append()
			 *
			 * Append a new child element node to the DOM
			 * @param {node} : The child element node to append
			 */
			append: function (node) {
				document.body.appendChild(node);
			},

			/**
			 * ## - Core.DOM.remove()
			 *
			 * Remove an existing child element node from the DOM
			 * @param {node} : The child element node to remove
			 */
			remove: function (node) {
				document.body.removeChild(node);
			}
		},

		/**
		 * ## - Core.load()
		 *
		 * Asynchronously loads JavaScript files from an array and triggers a callback upon completion
		 * @param {scripts} : An array of script file paths
		 * @param {callback} : A handler to be run upon load completion
		 */
		load: function (scripts, callback) {
			callback = A.func(callback);

			var total = scripts.length;
			var loaded = 0;

			function onLoadedOne () {
				Core.DOM.remove(this);

				if (++loaded >= total) {
					callback();
				}
			}

			for (var i = 0 ; i < total ; i++) {
				var scriptTag = Core.DOM.create('script');
				scriptTag.onload = onLoadedOne;
				scriptTag.src = scripts[i];

				Core.DOM.append(scriptTag);
			}
		}
	};

	/**
	 * ### - Library method: include()
	 *
	 * Queues a script file for importing by adding it to the internal Imports.scripts array.
	 * @param {file} : The root-relative path to the script file
	 */
	function include (file) {
		var script = Imports.root + '/' + file;

		if (!A.isInArray(Imports.scripts, script)) {
			Imports.scripts.push(script);
		}
	}

	/**
	 * ### - Library method: main()
	 *
	 * Kick-starts the actual script loading and subsequent class generation process, firing a callback upon completion.
	 * @param {callback} : A callback function to be fired after all scripts are loaded/classes generated
	 */
	function main (callback) {
		callback = A.func(callback);

		Core.load(Imports.scripts, callback);
	}

	// Export
	A.extend(window, AccessUtilities);
})();