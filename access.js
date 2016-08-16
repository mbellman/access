(function(){
	'use strict';

	/**
	 * A private namespace of convenience methods for internal library use only
	 */
	var A = {
		/**
		 * ## - A.instanceOf()
		 *
		 * Evaluates whether or not a value is an instance of a particular class.
		 * @param {value} [*] : The value to check against
		 * @param {instance} [Function] : The class instance to check the value against
		 */
		instanceOf: function (value, instance) {
			return (value instanceof instance);
		},

		/**
		 * ## - A.typeOf()
		 *
		 * Evaluates whether or not a value is of a particular type
		 * @param {value} [*] : The value to check against
		 * @param {type} [String] : The type to check the value against
		 */
		typeOf: function (value, type) {
			return (typeof value === type);
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
		 * ## - A.bind()
		 *
		 * Returns a context-bound wrapper function
		 * @param {fn} [Function] : The function to bind the context to
		 * @param {context} [Object] : The context for the wrapper function
		 */
		bind: function (fn, context) {
			fn = A.func(fn);

			return function wrapper () {
				return fn.apply(context, arguments);
			};
		},

		/**
		 * ## - A.argsToArray()
		 *
		 * Returns a normal array from an arguments list
		 * @param {args} [Arguments] : A list of arguments
		 */
		argsToArray: function (args) {
			return Array.prototype.slice.call(args, 0);
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
		 *
		 * Optional @param {context} [Object] : A context to bind the handler function to
		 */
		each: function (list, handler, context) {
			handler = A.func(handler);

			if (context) {
				handler = A.bind(handler, context);
			}

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
		 * ## - A.compare()
		 *
		 * Compare the properties of an arbitrary number of objects to a target object using a handler function
		 * (this method is primarily used as a means of refactoring similarities in A.extend() and A.delete())
		 * @param {objects} [Array:<Object>] : An array of objects, the first of which represents the target object
		 * @param {handler(key, value)} [Function] : A handler function for each property iteration 
		 */
		compare: function (objects, handler) {
			var target = objects[0];

			while (objects.length > 2) {
				A.compare([target, objects[1]], handler);
				objects.splice(1, 1);
			}

			var reference = objects[1];

			A.each(reference, handler);
		},

		/**
		 * ## - A.extend()
		 *
		 * Extends a target object with properties from an arbitrary number of other objects (deep & recursive)
		 * @param {object1} [Object] : The target object
		 * @param {[object2, [object3, [...]]]} [Object] : Objects used to extend target
		 */
		extend: function () {
			var objects = A.argsToArray(arguments);
			var target = objects[0];

			A.compare(objects, function(key, value){
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
		 * ## - A.delete()
		 *
		 * Inverse of A.extend(); removes properties from a target object if they are also included in other objects
		 * @param {object1} [Object] : The target object
		 * @param {[object2, [object3, [...]]]} [Object] : Objects with properties to be removed from target
		 */
		delete: function () {
			var objects = A.argsToArray(arguments);
			var target = objects[0];

			A.compare(objects, function(key, value){
				if (target.hasOwnProperty(key)) {
					delete target[key];
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
	 * Class access interface
	 */
	var Classes = {
		// List of modules pending generation
		queue: [],
		// List of module constructors by name
		defined: {},

		/**
		 * ## - Classes.has()
		 *
		 * Determine whether or not a module constructor has been declared and saved to Classes.defined
		 * @param {module} [String] : The name of the module constructor
		 */
		has: function (module) {
			return (Classes.defined.hasOwnProperty(module) && A.instanceOf(Classes.defined[module], Function));
		},

		/**
		 * ## - Classes.get()
		 *
		 * Return a module by name, or undefined if no such module is available
		 * @param {module} [String] : The name of the module
		 */
		get: function (module) {
			return Classes.defined[module] || undefined;
		},

		/**
		 * ## - Classes.onDefined()
		 *
		 * Delegate an event handler to run upon the definition of a class
		 * @param {module} [String] : The class name
		 * @param {handler(public, private, protected)} [Function] : The event handler, which receives the three member groups defined in the builder function
		 */
		onDefined: function (module, handler) {
			// ...
		},

		/**
		 * ## - Classes.buildTemplate()
		 *
		 * Sets up a temporary class constructor and delegates an event handler to update the class members upon proper definition
		 * @param {module} [String] : The class name
		 */
		buildTemplate: function (module) {
			function PublicMemberGroup () {};
			function PrivateMemberGroup () {};
			function ProtectedMemberGroup () {};

			var Constructor = function Constructor () {
				var context = {
					public: new PublicMemberGroup(),
					private: new PrivateMemberGroup(),
					protected: new ProtectedMemberGroup()
				};

				return context.public;
			};

			Classes.onDefined(module, function(_public, _private, _protected){
				A.extend(PublicMemberGroup.prototype, _public);
				A.extend(PrivateMemberGroup.prototype, _private);
				A.extend(ProtectedMemberGroup.prototype, _protected);
			});

			Classes.defined[module] = Constructor;
		}
	};

	/**
	 * ## - ClassDefinition()
	 *
	 * A special internal constructor which offers the base and chainable methods for class definition tools
	 * @param {name} [String] : The class name
	 */
	function ClassDefinition (name) {
		// [String] : The class name
		this.name = name;
		// [Array:<String>] : Base classes to extend
		this.extends = [];
		// [String] : Interface to implement
		this.implements = null;
		// [Function(public, private, protected)] : A function which defines the class members
		this.builder = function () {};

		/**
		 * ## - definer()
		 *
		 * An internal method which receives a builder function to define the members of the class
		 * @param {builder(public, private, protected)} [Function] : The class builder function
		 */
		var definer = A.bind(function(builder){
			this.builder = builder;
			Classes.queue.push(this);
		}, this);

		/**
		 * ## - definer.extend()
		 *
		 * Used to extend a class definition with an arbitrary number of base classes
		 * @param {classes} [String] : A comma-delimited list of base classes to extend onto the new class
		 */
		definer.extends = A.bind(function(classes){
			classes = classes.replace(/\s/g, '').split(',');

			A.each(classes, function(name){
				this.extends.push(name);
			}, this);

			return definer;
		}, this);

		/**
		 * ## - definer.implements()
		 *
		 * Used to implement an interface
		 * @param {_interface} [String] : The interface name
		 */
		definer.implements = A.bind(function(_interface){
			this.implements = _interface;
			return definer;
		}, this);

		return definer;
	}


	/**
	 * Configuration and methods arbitrating script imports
	 */
	var Imports = {
		// Static root filepath
		root: '.',
		// List of script file names as imported via Imports.from()
		scripts: [],
		// Number of still-pending script imports
		pending: 0,
		// Timeout before verifying that all external script
		// loading has finished/application can be started
		doneTimer: null,

		/**
		 * ## - Imports.from()
		 *
		 * Starts an asynchronous script load request and returns a tentative or complete module constructor; chained to include()
		 * @param {file} [String] : Script path from Imports.root
		 * @param {module} [String] : The name of the module constructor
		 */
		from: function (file, module) {
			var script = Imports.root + '/' + file;

			if (!A.isInArray(Imports.scripts, script)) {
				Core.load(script);
			}

			if (A.typeOf(module, 'string') && !Classes.has(module)) {
				Classes.buildTemplate(module);
			}

			return Classes.get(module);
		},

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
						Imports.doneTimer = window.setTimeout(Imports.checkIfDone, 250);
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
		 * ## - Core.init()
		 *
		 * Cleans up global exports and starts application 
		 */
		init: function () {
			Core.started = true;
			A.delete(window, AccessUtilities);
			Core.main();
		},

		/**
		 * ## - Core.generate()
		 *
		 * Starts the class generation process
		 */
		generate: function () {
			// ...

			Core.init();
		},

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
		 * Asynchronously loads a JavaScript file, updating Imports.scripts and Imports.pending
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
		}
	};

	/**
	 * ### - Library method: include()
	 *
	 * Specifies a module to be included from a particular script; returns a chainable
	 * method for specifying the script file path which invokes Imports.from()
	 * @param {module} [String] : The name of the module
	 */
	function include (module) {
		return {
			from: function (file) {
				return Imports.from(file, module);
			}
		};
	}

	/**
	 * ### - Library method: main()
	 *
	 * Reserves a callback function to be fired after all script imports are complete and classes generated
	 * @param {callback} [Function]: The custom callback
	 */
	function main (callback) {
		if (!Core.started) {
			Core.main = A.func(callback);
		}
	}

	/**
	 * ### - Library method: Class()
	 *
	 * Returns an instance of the internal ClassDefinition utility
	 * @param {name} [String] : The name of the class
	 */
	function Class (name) {
		return new ClassDefinition(name);
	}

	/**
	 * Collection of library objects and methods to prepare for global scope exposure
	 */
	var AccessUtilities = {
		include: include,
		main: main,
		Class: Class
	};

	// Export library utilities to the global scope
	A.extend(window, AccessUtilities);
})();