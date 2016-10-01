(function(){
	'use strict';

	/**
	 * ## - InstantiationException()
	 *
	 * An exception for instantiation of non-instantiable modules
	 * @param {name} [String] : The module name
	 */
	function InstantiationException (name) {
		this.toString = function () {
			return 'Cannot instantiate ' + Modules.typeOf(name) + ' [' + name + ']';
		};
	}

	/**
	 * ## - MultiDefinitionException()
	 *
	 * An exception for multiple definitions of a module
	 * @param {module} [String] : The name of the module
	 */
	function MultiDefinitionException (module) {
		this.toString = function () {
			return 'Module [' + module + '] cannot be defined more than once';
		};
	}

	/**
	 * ## - InterfaceExtendedException()
	 *
	 * An exception for attempting to extend, rather than implement, an interface
	 * @param {interfaceName} [String] : The interface name
	 * @param {className} [String] : The offending class name
	 */
	function InterfaceExtendedException (interfaceName, className) {
		this.toString = function () {
			return 'Interface [' + interfaceName + '] cannot be extended by class [' + className + ']';
		};
	}

	/**
	 * ## - ClassImplementedException()
	 *
	 * An exception for attempting to implement, rather than extend, a class
	 * @param {className} [String] : The improperly implemented class name
	 * @param {implementationName} [String] : The offending class name
	 */
	function ClassImplementedException (className, implementationName) {
		this.toString = function () {
			return Modules.definedTypes[className] + ' [' + className + '] cannot be implemented by class [' + implementationName + ']';
		};
	}

	/**
	 * ## - FinalExtensionException()
	 *
	 * An exception for attempting to extend a final class
	 * @param {className} [String] : The final class name
	 */
	function FinalExtensionException (className) {
		this.toString = function () {
			return Modules.types.FINAL_CLASS + ' [' + className + '] cannot be extended';
		};
	}

	/**
	 * ## - ImplementationException()
	 *
	 * An exception for any class insufficiently/improperly implementing an interface
	 * @param {className} [String] : The offending class name
	 * @param {interfaceName} [String] : The interface name
	 * @param {memberName} [String] : The missing/mistyped interface member
	 */
	function ImplementationException (className, interfaceName, memberName) {
		this.toString = function () {
			return Modules.definedTypes[className] + ' [' + className + '] does not properly implement Interface [' + interfaceName + '] member {' + memberName + '}';
		};
	}

	/**
	 * ## - InterfaceDefinitionException()
	 *
	 * An exception for interface members not being of correct typing (null or function)
	 * @param {interfaceName} [String] : The interface name
	 * @param {memberName} [String] : The mistyped interface member
	 */
	function InterfaceDefinitionException (interfaceName, memberName) {
		this.toString = function () {
			return 'Invalid type for member {' + memberName + '} in Interface [' + interfaceName + ']';
		};
	}

	/**
	 * Convenience methods for internal library use only
	 */
	var A = {
		/**
		 * ## - A.typeOf()
		 *
		 * Returns the data type for a value - with the exception of null, which is normalized to 'null' rather than 'object'
		 * @param {value} [*] : The value to check
		 * @returns [String]
		 */
		typeOf: function (value) {
			if (value !== null) {
				return typeof value;
			}

			return 'null';
		},

		/**
		 * ## - A.isInstanceOf()
		 *
		 * Evaluates whether or not a value is an instance of a particular class.
		 * @param {value} [*] : The value to check
		 * @param {instance} [Function] : The class instance to check the value against
		 * @returns [Boolean]
		 */
		isInstanceOf: function (value, instance) {
			return (value instanceof instance);
		},

		/**
		 * ## - A.isTypeOf()
		 *
		 * Evaluates whether or not a value is of a particular type
		 * @param {value} [*] : The value to check
		 * @param {type} [String] : The type to check the value against
		 * @returns [Boolean]
		 */
		isTypeOf: function (value, type) {
			return (A.typeOf(value) === type);
		},

		/**
		 * ## - A.isObject()
		 *
		 * Determines whether a value is a plain JavaScript object
		 * @param {value} [*] : The value to check
		 * @returns [Boolean]
		 */
		isObject: function (value) {
			return (A.isTypeOf(value, 'object') && !A.isInstanceOf(value, Array));
		},

		/**
		 * ## - A.isArray()
		 *
		 * Determines whether a value is an array
		 * @param {value} [*] : The value to check
		 * @returns [Boolean]
		 */
		isArray: function (value) {
			return A.isInstanceOf(value, Array);
		},

		/**
		 * ## - A.isFunction()
		 *
		 * Determines whether a value is a function
		 * @param {value} [*] : The value to check
		 * @returns [Boolean]
		 */
		isFunction: function (value) {
			return A.isTypeOf(value, 'function');
		},

		/**
		 * ## - A.isUndefined()
		 *
		 * Determines whether a value is undefined
		 * @param {value} [*] : The value to check
		 * @returns [Boolean]
		 */
		isUndefined: function (value) {
			return A.isTypeOf(value, 'undefined');
		},

		/**
		 * ## - A.isWritable()
		 *
		 * Determines whether a property definition does not have its "writable" attribute explicitly set to false. Proxy
		 * primitives (bound to others using getters/setters) erroneously report as non-writable due to the omission of the
		 * "writable" attribute, warranting an explicit false value check.
		 * @param {object} [Object] : The object containing the property to check
		 * @param {key} [String] : The name of the property to check
		 * @returns [Boolean]
		 */
		isWritable: function (object, key) {
			return (Object.getOwnPropertyDescriptor(object, key).writable !== false);
		},

		/**
		 * ## - A.has()
		 *
		 * Determines whether an object contains a property
		 * @param {object} [Object] : The object to check
		 * @param {property} [String] : The property to search for
		 * @returns [Boolean]
		 */
		has: function (object, property) {
			return object.hasOwnProperty(property);
		},

		/**
		 * ## - A.func()
		 *
		 * Evaluates whether or not a variable assignee is already a function, and returns
		 * an anonymous function to override it if not. Otherwise, returns the assignee.
		 * Allows an optional context binding for the returned function.
		 * @param {assignee} [*] : The variable to check against
		 * Optional @param {context} [Object] : An object to bind the function to
		 * @returns [Function]
		 */
		func: function (assignee, context) {
			if (!A.isFunction(assignee)) {
				assignee = function () {};
			}

			if (context) {
				assignee = A.bind(assignee, context);
			}

			return assignee;
		},

		/**
		 * ## - A.bind()
		 *
		 * Returns a context-bound wrapper function
		 * @param {fn} [Function] : The function to bind the context to
		 * @param {context} [Object] : The context for the wrapper function
		 * @returns {wrapper} [Function]
		 */
		bind: function (fn, context) {
			fn = A.func(fn);

			return function wrapper () {
				return fn.apply(context, arguments);
			};
		},

		/**
		 * ## - A.bindAll()
		 *
		 * Binds a specific context to an arbitrary number of methods, properties of the context object
		 * @param {context} [Object] : The context for the methods
		 * @param {[method1, [method2, [...]]]} [String] : The names of the target methods as properties (key names) of the context object
		 */
		bindAll: function () {
			var args = A.argsToArray(arguments);
			var context = args[0];

			while (args.length > 1) {
				var methodName = args[1];
				var method = context[methodName];

				if (A.isTypeOf(method, 'function')) {
					context[methodName] = A.bind(method, context);
				}

				args.splice(1, 1);
			}
		},

		/**
		 * ## - A.bindReference()
		 *
		 * Creates a one-way binding from a proxy object property to an original context
		 * @param {name} [String] : The property name
		 * @param {proxy} [Object] : The proxy object
		 * @param {context} [Object] : The original context object to bind the proxy object property to
		 */
		bindReference: function (name, proxy, context) {
			Object.defineProperty(proxy, name, {
				configurable: true,
				enumerable: true,
				get: function () {
					return context[name];
				},
				set: function(value) {
					context[name] = value;
				}
			});
		},

		/**
		 * ## - A.setWritable()
		 *
		 * Updates or adds a property's "writable" descriptor on an object or a list of objects
		 * @param {members} [Object OR Array<Object>] : The object or list of objects containing the property to update
		 * @param {key} [String] : The property name
		 * @param {isWritable} [Boolean] : The writable configuration state to set the property to
		 */
		setWritable: function (members, key, isWritable) {
			if (A.isArray(members)) {
				A.eachInArray(members, function(object){
					A.setWritable(object, key, isWritable);
				});
			} else {
				if (!A.isTypeOf(key, 'undefined')) {
					Object.defineProperty(members, key, {
						configurable: true,
						writable: isWritable
					});
				}
			}
		},

		/**
		 * ## - A.argsToArray()
		 *
		 * Returns a normal array from an arguments list
		 * @param {args} [Arguments] : A list of arguments
		 * @returns [Array<*>]
		 */
		argsToArray: function (args) {
			return Array.prototype.slice.call(args, 0);
		},

		/**
		 * ## - A.eachInArray()
		 *
		 * Iterates over the elements in an array, invoking a handler for each
		 * @param {array} [Array<*>] : The array to iterate over
		 * @param {handler(value, index, array)} [Function] : A handler function to act with the element data
		 */
		eachInArray: function (array, handler) {
			var length = array.length;
			var i = length + 1;

			if (length < 1) {
				return;
			}

			while (--i) {
				var index = length - i;

				if (handler(array[index], index, array) === false) {
					break;
				}
			}
		},

		/**
		 * ## - A.eachInObject()
		 *
		 * Iterates over the unique properties of an object, invoking a handler for each
		 * @param {object} [Object] : The object to iterate over
		 * @param {handler(key, value, object)} [Function] : A handler function to act with the key/value pair
		 */
		eachInObject: function (object, handler) {
			for (var key in object) {
				if (A.has(object, key)) {
					if (handler(key, object[key], object) === false) {
						break;
					}
				}
			}
		},

		/**
		 * ## - A.each()
		 *
		 * Iterates over a list of items (either an Object or an Array), invoking a handler for each. Only performs shallow iteration on objects.
		 * @param {list} [Array<*> OR Object] : The list to iterate over
		 * @param {handler} [Function] : A handler function to run for each iteration
		 * Optional @param {context} [Object] : A context to bind the handler function to
		 */
		each: function (list, handler, context) {
			handler = A.func(handler, context);

			if (A.isArray(list)) {
				A.eachInArray(list, handler);
			} else if (A.isObject(list)) {
				A.eachInObject(list, handler);
			}
		},

		/**
		 * ## - A.deepEach()
		 *
		 * Recursively iterates over the properties of an object
		 * @param {object} [Object] : The object to iterate over
		 * @param {handler(key, value, stack, object)} [Function] : A handler function to run for each iteration
		 * Optional @param {stack} [Array<String>] : The current stack of nested properties
		 * Optional @param {context} [Object] : A context to bind the handler function to
		 * Optional @param {allowed} [Array<String>] : Allowed traversable sub-objects by key name
		 * @returns {terminated} [Boolean] : A flag which, when set to true, propagates up the recursion stack and halts the loop
		 */
		deepEach: function (object, handler, stack, context, allowed) {
			handler = A.func(handler, context);
			stack = stack || [];
			allowed = allowed || [];

			var terminated = false;

			A.eachInObject(object, function(key, value){
				stack.push(key);

				if (A.isTypeOf(value, 'object')) {
					if (allowed.length === 0 || A.isInArray(allowed, key)) {
						if (A.deepEach(object[key], handler, stack, context, allowed) === true) {
							return !(terminated = true);
						}
					}
				} else {
					if (handler(key, value, stack, object) === false) {
						return !(terminated = true);
					}
				}

				stack.pop();
			});

			return terminated;
		},

		/**
		 * ## - A.eachMultiple()
		 *
		 * Runs an A.eachInObject() loop for each in an array of objects
		 * @param {objects} [Array<Object>] : The array of objects
		 * @param {handler(key, value)} [Function] : A handler function for each property iteration 
		 */
		eachMultiple: function (objects, handler) {
			A.eachInArray(objects, function(object){
				A.eachInObject(object, handler);
			});
		},

		/**
		 * ## - A.extend()
		 *
		 * Extends a target object with properties from an arbitrary number of other objects (deep & recursive) and returns the result
		 * @param {object1} [Object] : The target object
		 * @param {[object2, [object3, [...]]]} [Object] : Objects used to extend target
		 * @returns {target} [Object]
		 */
		extend: function () {
			var objects = A.argsToArray(arguments);
			var target = objects[0];

			objects.shift();

			A.eachMultiple(objects, function(key, value){
				if (A.isTypeOf(value, 'object')) {
					if (!A.has(target, key)) {
						target[key] = {};
					}

					A.extend(target[key], value);
				} else {
					target[key] = value;
				}
			});

			return target;
		},

		/**
		 * ## - A.delete()
		 *
		 * Inverse of A.extend(); removes properties from a target object if they are also included in other objects, and returns the target
		 * @param {object1} [Object] : The target object
		 * @param {[object2, [object3, [...]]]} [Object] : Objects with properties to be removed from target
		 * @returns {target} [Object]
		 */
		delete: function () {
			var objects = A.argsToArray(arguments);
			var target = objects[0];

			objects.shift();

			A.eachMultiple(objects, function(key, value){
				if (A.has(target, key)) {
					delete target[key];
				}
			});

			return target;
		},

		/**
		 * ## - A.deleteKeys()
		 *
		 * Removes an arbitrary number of keys from an object
		 * @param {object} [Object] : The target object
		 * @param {[key1, [key2, [...]]]} [String] : The key names to delete
		 */
		deleteKeys: function () {
			var args = A.argsToArray(arguments);
			var object = args[0];

			args.splice(0, 1);

			A.each(args, function(key){
				delete object[key];
			});
		},

		/**
		 * ## - A.getKeyNames()
		 *
		 * Returns an array containing an object's own enumerable property names
		 * @param {object} [Object] : The object with the keys to retrieve
		 * @returns [Array<String>]
		 */
		getKeyNames: function (object) {
			var names = [];

			A.eachInObject(object, function(key){
				names.push(key);
			});

			return names;
		},

		/**
		 * ## - A.getLastInArray()
		 *
		 * Returns the last element of an array
		 * @param {array} [Array<*>] : The array to retrieve the element from
		 * @returns [*]
		 */
		getLastInArray: function (array) {
			return array.slice(array.length - 1)[0];
		},

		/**
		 * ## - A.isInArray()
		 *
		 * Determine whether a value is contained within a one-dimensional array
		 * @param {array} [Array] : The array to search through
		 * @param {value} [*] : The value to search for
		 * @returns [Boolean]
		 */
		isInArray: function (array, value) {
			for (var i = 0 ; i < array.length ; i++) {
				if (array[i] === value) {
					return true;
				}
			}

			return false;
		},

		/**
		 * ## - A.isFilePath()
		 *
		 * Tests to see if a string matches a file path pattern
		 * @param {string} [String] : The string to test
		 * @returns [Boolean]
		 */
		isFilePath: function (string) {
			var parts = string.split('.');

			return A.isInArray(Imports.filetypes, parts[parts.length - 1]);
		}
	};

	/**
	 * Internal core variables and library routines
	 */
	var Core = {
		// [Boolean] : Whether the main() application entry point callback is being or has been fired
		started: false,
		// [Boolean] : Whether debug mode is on
		debug: false,
		// [Boolean] : When toggled to true, class generation catalogues protected members for attachment to internal superclass "public" instances
		inSuperMode: false,
		// [String] : An optional namespace to write modules to rather than Modules.defined (a null value prevents any override)
		activeNamespace: null,
		// [Array<String>] : A list of exception messages raised during class generation
		exceptions: [],

		/**
		 * ## - Core.main()
		 *
		 * A placeholder for the application entry point callback reserved by main()
		 */
		main: A.func(),

		/**
		 * ## - Core.init()
		 *
		 * Calls main entry point function
		 */
		init: function () {
			Core.started = true;

			Core.main();
		},

		/**
		 * ## - Core.defineModules()
		 *
		 * Defines all queued modules
		 */
		defineModules: function () {
			A.each(Modules.queue, function(module, definition){
				if (definition.type !== Modules.types.INTERFACE) {
					definition.checkReadyStatus();
				} else {
					definition.build();
				}
			});
		},

		/**
		 * ## - Core.generate()
		 *
		 * Cleans up global exports and starts the class generation process
		 */
		generate: function () {
			A.delete(window, AccessUtilities);
			Core.defineModules();

			var failedModules = A.getKeyNames(Modules.queue);

			if (Core.exceptions.length === 0 && failedModules.length === 0) {
				Core.init();
			} else {
				Diagnostics.reportFailures(failedModules);
			}
		},

		/**
		 * ## - Core.raiseException()
		 *
		 * Logs an exception string
		 * @param {exception} [Exception] : A thrown Exception instance
		 */
		raiseException: function (exception) {
			var message = exception.toString();

			Core.exceptions.push(message);
			console.error(message);
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
		}
	};

	/**
	 * Class generation failure diagnostic tools
	 */
	var Diagnostics = {
		// [Boolean] : Flag for having logged the first cyclical dependency; if true, don't log any more (until the first is fixed)
		hasReportedCyclicalDependency: false,

		// [Object{String}] : Error messages
		errors: {
			CYCLICAL_DEPENDENCY: 'Access: Cyclical dependency detected: {*}',
			MISSING_DEPENDENCY: 'Access: Class [{*}] dependency [{*}] not defined',
			MODULE_FAILURE: 'Access: Failed to generate module [{*}]',
			INITIALIZATION_FAILURE: 'Access: Failed to initialize application'
		},

		/**
		 * ## - Diagnostics.format()
		 *
		 * Generates a formatted diagnostics error message based on a base error string and dynamic arguments
		 * @param {arg1} [String] : The error message from Diagnostics.errors
		 * @param {[arg2, [arg3, [arg4, ...]]]} [String] : Dynamic values to replace the {*} wildcards in the error message
		 * @returns {message} [String]
		 */
		format: function () {
			var args = A.argsToArray(arguments);
			var message = args.splice(0, 1)[0];

			A.eachInArray(args, function(word){
				message = message.replace('{*}', word);
			});

			return message;
		},

		/**
		 * ## - Diagnostics.formatWarning()
		 *
		 * Generates and outputs a formatted diagnostics error message to the console as a warning
		 * @param {arg1} [String] : The error message from Diagnostics.errors
		 * @param {[arg2, [arg3, [arg4, ...]]]} [String] : Dynamic values to replace the {*} wildcards in the error message
		 */
		formatWarning: function () {
			var warning = Diagnostics.format.apply(null, arguments);

			console.warn(warning);
		},

		/**
		 * ## - Diagnostics.getCyclicalDependencies()
		 *
		 * Returns any detected and logged cylical dependency chains from DependencyGraph.cyclicalDependencies for a particular class
		 * @param {className} [String] : The name of the class to check
		 * @returns [Array<Array<String>>]
		 */
		getCyclicalDependencies: function (className) {
			return DependencyGraph.cyclicalDependencies[className] || [];
		},

		/**
		 * ## - Diagnostics.getMissingDependencies()
		 *
		 * Returns a list of the names of missing dependencies for a particular class
		 * @param {className} [String] : The name of the class to check
		 * @returns [Array<String>]
		 */
		getMissingDependencies: function (className) {
			var dependencies = DependencyGraph.dependencies[className] || [];
			var missingDependencies = [];

			A.eachInArray(dependencies, function(dependency){
				if (!Modules.has(dependency)) {
					missingDependencies.push(dependency);
				}
			});

			return missingDependencies;
		},

		/**
		 * ## - Diagnostics.dispatchCyclicalDependencyWarnings()
		 *
		 * Prints any detected cyclical dependency chains for a particular class to the console as a warning or series of warnings
		 * @param {className} [String] : The class name
		 */
		dispatchCyclicalDependencyWarnings: function (className) {
			if (Diagnostics.hasReportedCyclicalDependency) {
				return;
			}

			var cyclicalDependencies = Diagnostics.getCyclicalDependencies(className);

			A.eachInArray(cyclicalDependencies, function(cyclicalDependency){
				Diagnostics.hasReportedCyclicalDependency = true;

				Diagnostics.formatWarning(Diagnostics.errors.CYCLICAL_DEPENDENCY, cyclicalDependency.join(' -> '));
			});
		},

		/**
		 * ## - Diagnostics.dispatchMissingDependencyWarnings()
		 *
		 * Prints any detected missing dependencies for a particular class to the console as a warning or series of warnings
		 * @param {className} [String] : The class name
		 */
		dispatchMissingDependencyWarnings: function (className) {
			var missingDependencies = Diagnostics.getMissingDependencies(className);

			A.eachInArray(missingDependencies, function(missingDependency){
				Diagnostics.formatWarning(Diagnostics.errors.MISSING_DEPENDENCY, className, missingDependency);
			});
		},

		/**
		 * ## - Diagnostics.diagnoseClassFailure()
		 *
		 * Generates a dependency tree for a particular class and analyzes it to detect causes for generation failure
		 * @param {className} [String] : The class name
		 */
		diagnoseClassFailure: function (className) {
			DependencyGraph.buildDependencyTree(className);

			Diagnostics.dispatchCyclicalDependencyWarnings(className);
			Diagnostics.dispatchMissingDependencyWarnings(className);
		},

		/**
		 * ## - Diagnostics.diagnoseModuleFailure()
		 *
		 * Dispatches a generation failure warning for a particular non-class module (interfaces or free functions/objects)
		 * @param {module} [String] : The module name
		 */
		diagnoseModuleFailure: function (module) {
			Diagnostics.formatWarning(Diagnostics.errors.MODULE_FAILURE, module);
		},

		/**
		 * ## - Diagnostics.diagnose()
		 *
		 * Detects and dispatches errors for a particular failed module
		 * @param {module} [String] : The module name
		 */
		diagnose: function (module) {
			if (Modules.isClass(module)) {
				Diagnostics.diagnoseClassFailure(module);
			} else {
				Diagnostics.diagnoseModuleFailure(module);
			}
		},

		/**
		 * ## - Diagnostics.reportFailures()
		 *
		 * Iteratively diagnoses all modules which did not pass the generation process
		 * @param {failedModules} [Array<String>] : A list of the failed module names
		 */
		reportFailures: function (failedModules) {
			A.eachInArray(failedModules, Diagnostics.diagnose);

			console.warn(Diagnostics.errors.INITIALIZATION_FAILURE);
		}
	};

	/**
	 * Class dependency graph utilities (primarily used for error reporting)
	 */
	var DependencyGraph = {
		// [Object{Array<String>}] : Direct dependencies, if any, for each class
		dependencies: {},
		// [Array<Array<String>>] : A list of cyclical dependency chains found during tree generation
		cyclicalDependencies: [],

		/**
		 * ## - DependencyGraph.logDependency()
		 *
		 * Stores all dependencies of a class to DependencyGraph.dependencies; used for circular or missing dependency detection
		 * @param {module} [String] : The module name
		 * @param {dependency} [String] : The dependency name
		 */
		logDependency: function (module, dependency) {
			if (!A.has(DependencyGraph.dependencies, module)) {
				DependencyGraph.dependencies[module] = [];
			}

			DependencyGraph.dependencies[module].push(dependency);
		},

		/**
		 * ## - DependencyGraph.storeCyclicalDependency()
		 *
		 * Stores a cyclical dependency chain detected during class dependency tree generation
		 * @param {className} [String] : The name of the class spawning the cyclical dependency chain
		 * @param {stack} [Array<String>] : The dependency stack provided by DependencyGraph.buildDependencyTree()
		 */
		storeCyclicalDependency: function (className, stack) {
			var cyclicalDependency = stack.concat(className);

			while (cyclicalDependency[0] !== className) {
				cyclicalDependency.shift();
			}

			if (!A.has(DependencyGraph.cyclicalDependencies, className)) {
				DependencyGraph.cyclicalDependencies[className] = [];
			}

			DependencyGraph.cyclicalDependencies[className].push(cyclicalDependency);
		},

		/**
		 * ## - DependencyGraph.buildDependencyTree()
		 *
		 * Recursively builds and returns a tree containing all dependencies of a class, pruned where cyclical dependencies are detected
		 * to prevent infinite recursion. The root node of the tree is the name of the class.
		 * @param {className} [String] : The class name
		 * Optional @param {stack} [Array<String>] : The current dependency chain for this branch (passed in during recursion)
		 * @returns {tree} [Object{*}]
		 */
		buildDependencyTree: function (className, stack) {
			stack = stack || [className];

			var dependencies = DependencyGraph.dependencies[className] || [];
			var tree = {};

			if (dependencies.length === 0) {
				return null;
			}

			A.eachInArray(dependencies, function(dependency){
				if (A.isInArray(stack, dependency)) {
					tree[dependency] = null;
					DependencyGraph.storeCyclicalDependency(dependency, stack);
				} else {
					stack.push(dependency);
					tree[dependency] = DependencyGraph.buildDependencyTree(dependency, stack);
					stack.pop();
				}
			});

			return tree;
		}
	};

	/**
	 * Configuration and methods arbitrating script imports
	 */
	var Imports = {
		// [String] : Static root filepath
		root: '.',
		// [Array<String>] : List of script file names as imported via Imports.from()
		scripts: [],
		// [Number] : Number of still-pending script imports
		pending: 0,
		// [WindowTimer] : Timeout before verifying that all external script loading has finished/application can be started
		doneTimer: null,
		// [Array<String>] : Accepted file types for import-only include()
		filetypes: ['js'],

		/**
		 * ## - Imports.load()
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
		},

		/**
		 * ## - Imports.getScript()
		 *
		 * Loads a script file if it has not already been loaded/requested
		 * @param {file} [String] : The script file path
		 */
		getScript: function (file) {
			if (window.ACCESS_BUNDLE_MODE) {
				return;
			}

			var script = Imports.root + '/' + file;

			if (!A.isInArray(Imports.scripts, script)) {
				Imports.load(script);
			}
		},

		/**
		 * ## - Imports.getModule()
		 *
		 * Returns a module constructor, creating the constructor first if necessary
		 * @param {module} [String] : The module name
		 * @returns [Function]
		 */
		getModule: function (module) {
			if (!Modules.has(module)) {
				Modules.buildModuleConstructor(module);
			}

			return Modules.get(module);
		},

		/**
		 * ## - Imports.from()
		 *
		 * Loads a script file and returns a module constructor; chained to global include()
		 * @param {file} [String] : The script file path
		 * @param {module} [String] : The name of the module constructor
		 * @returns [Function]
		 */
		from: function (file, module) {
			Imports.getScript(file);

			return Imports.getModule(module);
		},

		/**
		 * ## - Imports.checkRemaining()
		 *
		 * Verifies that no script imports are still pending, and if so calls the Imports.on.loadedAll completion handler
		 */
		checkRemaining: function () {
			if (Imports.pending === 0) {
				Imports.on.loadedAll();
			}
		},

		/**
		 * ## - Imports.queueCheckRemaining()
		 *
		 * Runs Imports.checkRemaining() on a delay, clearing the last queued delay
		 */
		queueCheckRemaining: function () {
			window.clearTimeout(Imports.doneTimer);

			Imports.doneTimer = window.setTimeout(Imports.checkRemaining, 250);
		},

		// Script load status handlers
		on: {
			/**
			 * ## - Imports.on.loadedOne()
			 *
			 * Returns a custom single-script load handler which resets the namespace, removes the script node from the DOM,
			 * decrements Imports.pending, and queues the Imports.checkRemaining() process if no remaining scripts are pending
			 * @param {script} [HTMLElement] : The script tag to remove
			 * @returns [Function]
			 */
			loadedOne: function (script) {
				return function () {
					Core.activeNamespace = null;

					Core.DOM.remove(script);

					if (--Imports.pending <= 0) {
						Imports.queueCheckRemaining();
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
			 * @returns [Function]
			 */
			error: function (script) {
				return function () {
					console.warn('Failed to load: ' + script.src);
				};
			}
		}
	};

	/**
	 * Module member definition utilities
	 */
	var Members = {
		/**
		 * ## - Members.createMemberTree()
		 *
		 * Returns a base class member object structure with sub-properties for keyword chains
		 * @returns [Object]
		 */
		createMemberTree: function () {
			var tree = {
				final: {
					static: {}
				},
				static: {
					final: {}
				}
			};

			return {
				public: A.extend({}, tree),
				private: A.extend({}, tree),
				protected: A.extend({}, tree)
			};
		},

		/**
		 * ## - Members.createMemberTable()
		 *
		 * Returns an object containing various categories in which to place and qualify class members.
		 * @returns {table} [Object]
		 */
		createMemberTable: function () {
			var table = {
				class: {},
				public: {},
				publicNames: [],
				static: {}
			};

			if (Core.inSuperMode) {
				table.protected = {};
				table.protectedNames = [];
			}

			return table;
		},

		/**
		 * ## - Members.defineSpecialMember()
		 *
		 * Returns a descriptive definition of static and final module members
		 * @param {name} [String] : The special member name
		 * @param {value} [*] : The special member value
		 * @param {flags} [Object{Boolean}] : Boolean conditions for the special member's possible characteristics (final, static, public, protected)
		 * @returns [Object]
		 */
		defineSpecialMember: function (name, value, flags) {
			return {
				name: name,
				value: value,
				isFunction: A.isFunction(value),
				isFinal: flags.final || false,
				isStatic: flags.static || false,
				isPublic: flags.public || false,
				isProtected: flags.protected || false
			};
		},

		/**
		 * ## - Members.getWritableTargets()
		 *
		 * Determines which member table properties a special member exists on so its "writable" configuration can be defined on each
		 * @param {member} [Object] : The special member
		 * @param {memberTable} [Object] : The module's categorized members
		 * @returns {targets} [Array<Object>] : The member table properties this member exists on
		 */
		getWritableTargets: function (member, memberTable) {
			var targets = [memberTable.class];

			if (member.isPublic) {
				targets.push(memberTable.public);
			}

			if (member.isStatic) {
				targets.push(memberTable.static);
			}

			return targets;
		},

		/**
		 * ## - Members.spliceSpecialMembers()
		 *
		 * Retrieves and deletes final and static members from a newly-built module "members" object
		 * @param {members} [Object] : The module's base "members" object defined in its builder function
		 * @returns {specialMembers} [Array<Object>] : A list of final and static member definitions
		 */
		spliceSpecialMembers: function (members) {
			var specialMembers = [];
			var flags = {};

			A.deepEach(members, function(name, value, stack){
				flags.final = false;
				flags.static = false;
				flags.public = false;
				flags.protected = false;

				A.eachInArray(stack, function(value){
					if (A.has(flags, value)) {
						flags[value] = true;
					}
				});

				if (flags.final || flags.static) {
					specialMembers.push(Members.defineSpecialMember(name, value, flags));
				}
			}, null, null, ['public', 'protected', 'private', 'static', 'final']);

			A.deleteKeys(members.public, 'static', 'final');
			A.deleteKeys(members.private, 'static', 'final');
			A.deleteKeys(members.protected, 'static', 'final');

			return specialMembers;
		},

		/**
		 * ## - Members.attachSpecialObjectMember()
		 *
		 * Attaches/binds final and static object members to their appropriate class member table categories
		 * @param {object} [Object] : The member's special definition (see: Members.defineSpecialMember())
		 * @param {memberTable} [Object] : The module's categorized members
		 * @param {constructor} [Function] : The module constructor
		 */
		attachSpecialObjectMember: function (object, memberTable, constructor) {
			var writableTargets = Members.getWritableTargets(object, memberTable);

			if (object.isStatic) {
				if (object.isFunction) {
					object.value = A.bind(object.value, memberTable.static);
				}

				memberTable.static[object.name] = object.value;

				if (object.isPublic) {
					memberTable.public[object.name] = constructor[object.name] = memberTable.static[object.name];
				}
			}

			if (Core.inSuperMode && object.isProtected) {
				memberTable.protected[object.name] = object.value;
			}

			memberTable.class[object.name] = object.value;

			A.setWritable(writableTargets, object.name, !object.isFinal);
		},

		/**
		 * ## - Members.attachSpecialPrimitiveMember()
		 *
		 * Attaches/binds final and static primitive members to their appropriate class member table categories
		 * @param {primitive} [Object] : The member's special definition (see: Members.defineSpecialMember())
		 * @param {memberTable} [Object] : The module's categorized members
		 * @param {constructor} [Function] : The module constructor
		 */
		attachSpecialPrimitiveMember: function (primitive, memberTable, constructor) {
			var writableTargets = Members.getWritableTargets(primitive, memberTable);

			var descriptor = {
				enumerable: true,
				configurable: true
			};

			if (primitive.isStatic) {
				memberTable.static[primitive.name] = primitive.value;

				A.extend(descriptor, {
					get: function () {
						return memberTable.static[primitive.name];
					},
					set: function (value) {
						memberTable.static[primitive.name] = value;
					}
				});

				if (primitive.isPublic) {
					A.bindReference(primitive.name, constructor, memberTable.static);
					writableTargets.splice(1, 1);
				}
			} else {
				descriptor.value = primitive.value;
			}

			if (primitive.isPublic) {
				A.bindReference(primitive.name, memberTable.public, memberTable.class);
			}

			if (Core.inSuperMode && primitive.isProtected) {
				A.bindReference(primitive.name, memberTable.protected, memberTable.class);
			}

			A.setWritable(writableTargets, primitive.name, !primitive.isFinal);
			Object.defineProperty(memberTable.class, primitive.name, descriptor);
		},

		/**
		 * ## - Members.attachSpecialMembers()
		 *
		 * Attaches and binds static and final class members to their appropriate class member table categories
		 * @param {specialMembers} [Array<Object>] : A list of special member definitions (see: Members.defineSpecialMember())
		 * @param {memberTable} [Object] : The module's categorized members
		 * @param {constructor} [Function] : The module constructor
		 */
		attachSpecialMembers: function (specialMembers, memberTable, constructor) {
			A.eachInArray(specialMembers, function(member){
				if (A.isTypeOf(member.value, 'function') || A.isTypeOf(member.value, 'object')) {
					Members.attachSpecialObjectMember(member, memberTable, constructor);
				} else {
					Members.attachSpecialPrimitiveMember(member, memberTable, constructor);
				}
			});
		},

		/**
		 * ## - Members.buildMemberTable()
		 *
		 * Constructs a member table with a module's originally defined members appropriately categorized (see: Members.createMemberTable())
		 * @param {members} [Object] : The module's base "members" object defined in its builder function
		 * @param {constructor} [Function] : The module constructor
		 * @returns {memberTable} [Object] : An object containing the categorized members
		 */
		buildMemberTable: function (members, constructor) {
			var memberTable = Members.createMemberTable();
			var specialMembers = Members.spliceSpecialMembers(members);

			Members.attachSpecialMembers(specialMembers, memberTable, constructor);

			A.extend(memberTable.class, members.public, members.private, members.protected);
			A.extend(memberTable.public, members.public);

			memberTable.publicNames = A.getKeyNames(memberTable.public);

			if (Core.inSuperMode) {
				A.extend(memberTable.protected, members.protected);

				memberTable.protectedNames = A.getKeyNames(memberTable.protected);
			}

			return memberTable;
		},

		/**
		 * ## - Members.purge()
		 *
		 * Force-deletes a member from an instance and removes its public proxy if one exists. Used in reverting a derived class
		 * member to the base class value if the base member was qualified as final.
		 * @param {instance} [Object] : The class instance to remove the member from
		 * @param {key} [String] : The name of the member to remove
		 */
		purge: function (instance, key) {
			if (!A.has(instance, key)) {
				return;
			}

			A.setWritable(instance, key, true);

			delete instance[key];

			if (A.has(instance, 'proxy') && A.has(instance.proxy, key)) {
				delete instance.proxy[key];
			}
		}
	};

	/**
	 * Module utilities
	 */
	var Modules = {
		// [Object{ClassDefinition OR InterfaceDefinition}] : Modules pending generation
		queue: {},
		// [Object{Function}] : Module constructors by name
		defined: {},
		// [Object{Object}] : Interface objects
		interfaces: {},
		// [Object{Function OR Object}] : Free modules (defined in isolation as individual functions or objects)
		free: {},
		// [Object{String}] : Modules extended by derived classes
		inherited: {},
		// [Object{String}] : Module types by name
		definedTypes: {},

		// [Object{*}] : Module type names
		types: {
			CLASS: 'Class',
			FINAL_CLASS: 'Final Class',
			ABSTRACT_CLASS: 'Abstract Class',
			INTERFACE: 'Interface',
			FREE_FUNCTION: 'Function',
			FREE_OBJECT: 'Object',

			// [Array<String>] : Module types which can be instantiated
			instantiable: [
				'Class',
				'Final Class'
			]
		},

		// [Object{*}] : Module event management
		events: {
			// [Array<String>] : Valid event names
			valid: ['built', 'defined'],

			// [Object{Array<Function>}] : Event handlers run upon a module's builder() method having fired
			built: {},
			// [Object{Array<Function>}] : Event handlers run upon a module's definition
			defined: {},

			/**
			 * ## - Modules.events.on()
			 *
			 * Delegates a new event handler for a specific module event
			 * @param {event} [String] : The event type
			 * @param {module} [String] : The module name
			 * @param {handler(arg1, arg2, ...)} [Function] : The event handler
			 */
			on: function (event, module, handler) {
				if (A.isInArray(Modules.events.valid, event)) {
					handler = A.func(handler);

					var eventQueue = Modules.events[event];

					if (!A.has(eventQueue, module)) {
						eventQueue[module] = [];
					}

					eventQueue[module].push(handler);
				}
			},

			/**
			 * ## - Modules.events.trigger()
			 *
			 * Fires all event handlers for a specific module event
			 * @param {event} [String] : The event type
			 * @param {module} [String] : The module name
			 * @param {args} [Array<*>] : An array of arguments to be provided to the event handlers as a normal [Arguments] lineup
			 */
			trigger: function (event, module, args) {
				if (A.isInArray(Modules.events.valid, event)) {
					var eventQueue = Modules.events[event];

					if (A.has(eventQueue, module)) {
						A.each(eventQueue[module], function(handler){
							handler.apply(null, args);
						});
					}
				}
			}
		},

		/**
		 * ## - Modules.getDefiner()
		 *
		 * Returns a special function which receives and stores a builder function for a class, or a definition object for
		 * an interface. The definer function's context is bound to a ClassDefinition or InterfaceDefinition instance.
		 * @param {context} [Object] : The ClassDefinition or InterfaceDefinition instance to bind the definer to
		 * @returns [Function]
		 */
		getDefiner: function (context) {
			return A.bind(function definer(builder){
				try {
					if (A.has(Modules.queue, this.name)) {
						throw new MultiDefinitionException(this.name);
					}

					this.builder = builder;
					Modules.queue[this.name] = this;
				} catch (e) {
					Core.raiseException(e);
				}
			}, context);
		},

		/**
		 * ## - Modules.isReady()
		 *
		 * Determines whether a module has been defined and removed from the pending queue
		 * @param {module} [String] : The module name
		 * @returns [Boolean]
		 */
		isReady: function (module) {
			return (Modules.has(module) && !A.has(Modules.queue, module));
		},

		/**
		 * ## - Modules.isClass()
		 *
		 * Determines whether a module is a class
		 * @param {module} [String] : The module name
		 * @returns [Boolean]
		 */
		isClass: function (module) {
			return (!Modules.isInterface(module) && !Modules.isFreeModule(module));
		},

		/**
		 * ## - Modules.isInterface()
		 *
		 * Determines whether a module is an interface
		 * @param {module} [String] : The module name
		 * @returns [Boolean]
		 */
		isInterface: function (module) {
			return (Modules.has(module) && Modules.definedTypes[module] === Modules.types.INTERFACE);
		},

		/**
		 * ## - Modules.isFreeModule()
		 *
		 * Determines whether a module is defined freely as a function or object
		 * @param {module} [String] : The module name
		 * @returns [Boolean]
		 */
		isFreeModule: function (module) {
			return A.has(Modules.free, module);
		},

		/**
		 * ## - Modules.isFreeFunction()
		 *
		 * Determines whether a module is an individually defined free function
		 * @param {module} [String] : The module name
		 * @returns [Boolean]
		 */
		isFreeFunction: function (module) {
			return (Modules.isFreeModule(module) && Modules.definedTypes[module] === Modules.types.FREE_FUNCTION);
		},

		/**
		 * ## - Modules.isFreeObject()
		 *
		 * Determines whether a module is an individually defined free object
		 * @param {module} [String] : The module name
		 * @returns [Boolean]
		 */
		isFreeObject: function (module) {
			return (Modules.isFreeModule(module) && Modules.definedTypes[module] === Modules.types.FREE_OBJECT);
		},

		/**
		 * ## - Modules.isInherited()
		 *
		 * Determines whether a class is inherited. Derived classes invoking .extends() with a particular class name
		 * will have registered that class in the Modules.inherited list, and only non-final classes can be inherited.
		 * @param {definition} [ClassDefinition] : The class definition instance
		 * @returns [Boolean]
		 */
		isInherited: function (definition) {
			return (Modules.inherited[definition.name] === true);
		},

		/**
		 * ## - Modules.has()
		 *
		 * Determines whether a module has been declared and saved
		 * @param {module} [String] : The module name
		 * @returns [Boolean]
		 */
		has: function (module) {
			return (
				(A.has(Modules.defined, module) && A.isFunction(Modules.defined[module])) ||
				(A.has(Modules.free, module) || A.has(Modules.interfaces, module))
			);
		},

		/**
		 * ## - Modules.get()
		 *
		 * Return a module by name, or null if no such module is available
		 * @param {module} [String] : The module name
		 * @returns [Function OR Object]
		 */
		get: function (module) {
			return Modules.defined[module] || Modules.free[module] || null;
		},

		/**
		 * ## - Modules.typeOf()
		 *
		 * Return the type of a module by name, or null if no such module is available
		 * @param {module} [String] : The module type name
		 * @returns [String]
		 */
		typeOf: function (module) {
			return Modules.definedTypes[module] || null;
		},

		/**
		 * ## - Modules.canInstantiate()
		 *
		 * Determine whether or not a module can be instantiated based on is type
		 * @param {module} [String] : The module name
		 * @returns [Boolean]
		 */
		canInstantiate: function (module) {
			return A.isInArray(Modules.types.instantiable, Modules.typeOf(module));
		},

		/**
		 * ## - Modules.canConstruct()
		 *
		 * Identical in meaning to Modules.canInstantiate(), but throws an error when false
		 * @param {module} [String] : The module name
		 * @throws [InstantiationException]
		 * @returns [Boolean]
		 */
		canConstruct: function (module) {
			try {
				if (!Modules.canInstantiate(module)) {
					throw new InstantiationException(module);
				}
			} catch (e) {
				Core.raiseException(e);
				return false;
			}

			return true;
		},

		/**
		 * ## - Modules.verifyImplementation()
		 *
		 * Verifies whether an interface has been properly implemented by a class and incorporated into its member table
		 * @param {definition} [ClassDefinition] : The class definition instance
		 * @param {memberTable} [Object] : The class member table
		 * @throws [ImplementationException OR InterfaceDefinitionException]
		 */
		verifyImplementation: function (definition, memberTable) {
			try {
				var className = definition.name;
				var interfaceName = definition.implements;
				var interfaceMembers = Modules.interfaces[interfaceName];

				A.eachInObject(interfaceMembers, function(interfaceMember, value){
					var classHasMember = A.has(memberTable.public, interfaceMember);
					var classMember = memberTable.public[interfaceMember];
					var memberIsFunction = A.isTypeOf(classMember, 'function');

					switch (A.typeOf(value)) {
						case 'null':
							if (!classHasMember || memberIsFunction) {
								throw new ImplementationException(className, interfaceName, interfaceMember);
							}
							break;
						case 'function':
							if (
								(!classHasMember || !memberIsFunction) ||
								(value.length !== 0 && classMember.length !== value.length)
							) {
								throw new ImplementationException(className, interfaceName, interfaceMember);
							}
							break;
						default:
							throw new InterfaceDefinitionException(interfaceName, interfaceMember);
					}
				});
			} catch (e) {
				Core.raiseException(e);
			}
		},

		/**
		 * ## - Modules.buildInterface()
		 *
		 * Stores an interface definition object to a special internal list. Any implementing classes will have their defined
		 * members checked against the interface to ensure full member adoption.
		 * @param {name} [String] : The interface name
		 * @param {members} [Object] : An object containing the interface members
		 */
		buildInterface: function (name, members) {
			delete Modules.defined[name];

			Modules.interfaces[name] = members;
		},

		/**
		 * ## - Modules.buildClass()
		 *
		 * Formally "builds" a class by sorting its defined members into a member table. Also builds a special superclass
		 * constructor if the class is to be extended by any derived classes.
		 * @param {definition} [ClassDefinition] : The class definition instance
		 * @param {members} [Object] : The class members as defined within the definition builder function
		 * @param {superclasses} [Array<String>] : Superclasses of the class, provided to the superclass constructor builder in case of deep inheritance
		 * @returns [Object] : Data for the class; the categorized member table and the superclasses list
		 */
		buildClass: function (definition, members, superclasses) {
			Core.inSuperMode = Modules.isInherited(definition);

			var constructor = Modules.get(definition.name);
			var memberTable = Members.buildMemberTable(members, constructor);

			Modules.verifyImplementation(definition, memberTable);

			if (Core.inSuperMode) {
				Supers.buildSuperConstructor(definition.name, memberTable, superclasses);
			}

			if (superclasses.length > 0) {
				Supers.inheritPublicStaticMembers(superclasses, constructor);
			}

			return {
				memberTable: memberTable,
				supers: superclasses
			};
		},

		/**
		 * ## - Modules.buildFreeModule()
		 *
		 * Internally saves a freely-defined module and defines its type
		 * @param {module} [String] : The module name
		 * @param {definition} [Function OR Object] : The module definition
		 * @param {type} [String] : The module type
		 */
		buildFreeModule: function (module, definition, type) {
			Modules.free[module] = definition;
			Modules.definedTypes[module] = type;

			if (Core.activeNamespace !== null) {
				Namespaces.save(module, Core.activeNamespace);
			}
		},

		/**
		 * ## - Modules.buildFreeObject()
		 *
		 * Builds a free object module by extending the original saved constructor function with properties and disabling its
		 * instantiation, effectively treating it as a plain object. (While it would be ideal to save it as a plain object to
		 * begin with, if a free object module is loaded via include() or get() before its actual definition, a constructor is
		 * automatically created for return-by-reference, as we can't yet assume whether the module is an object or a class.
		 * Functions can be invoked OR extended with properties, making them ideal for agnostic module type support.)
		 * @param {module} [String] : The module name
		 * @param {object} [Object] : The module object definition
		 */
		buildFreeObject: function (module, object) {
			if (Modules.isFreeObject(module)) {
				return;
			}

			Modules.buildModuleConstructor(module);
			A.extend(Modules.get(module), object);
			Modules.buildFreeModule(module, object, Modules.types.FREE_OBJECT);
		},

		/**
		 * ## - Modules.buildFreeFunction()
		 *
		 * Builds a free function module to be called by the original saved module constructor function, effectively making the
		 * constructor a non-instantiable wrapper for the new function
		 * @param {module} [String] : The module name
		 * @param {fn} [Function] : The module function definition
		 */
		buildFreeFunction: function (module, fn) {
			if (Modules.isFreeFunction(module)) {
				return;
			}

			Modules.buildFreeModule(module, fn, Modules.types.FREE_FUNCTION);
		},

		/**
		 * ## - Modules.buildModuleConstructor()
		 *
		 * Sets up a module constructor and delegates an event handler to update the member table/superclass list upon running its builder function.
		 * (Interfaces will not change these values as they are non-instantiable.)
		 * @param {module} [String] : The module name
		 */
		buildModuleConstructor: function (module) {
			if (Modules.has(module)) {
				return;
			}

			var MemberTable;
			var supers;

			function Constructor () {
				if (Modules.isFreeFunction(module)) {
					return Modules.free[module].apply(null, arguments);
				}

				if (!Core.started || !Modules.canConstruct(module) || A.isUndefined(MemberTable)) {
					return null;
				}

				var instance = Instances.createInstance(MemberTable);

				Instances.bind(instance.proxy, instance, MemberTable.publicNames);
				Instances.initialize(module, instance, supers, arguments);
				Instances.inherit(instance, supers);
				Instances.sanitize(instance);

				return instance.proxy;
			}

			Modules.events.on('built', module, function(definition, members, superclasses){
				if (definition.type === Modules.types.INTERFACE) {
					Modules.buildInterface(definition.name, members);
				} else {
					var classData = Modules.buildClass(definition, members, superclasses);

					MemberTable = classData.memberTable;
					supers = classData.supers;
				}
			});

			Modules.defined[module] = Constructor;
		}
	};

	/**
	 * Superclass/inheritance utilities
	 */
	var Supers = {
		// [Object{Function(derivedInstance)}] : A list of superclass constructors by name
		constructors: {},
		// [Object{Object}] : A list of base class member tables
		memberTables: {},

		/**
		 * ## - Supers.has()
		 *
		 * Determines whether a specific superclass constructor has been created
		 * @param {module} [String] : The superclass name
		 * @returns [Boolean]
		 */
		has: function (module) {
			return (A.has(Supers.constructors, module) && A.has(Supers.memberTables, module));
		},

		/**
		 * ## - Supers.canConstruct()
		 *
		 * Determines whether a superclass can be constructed
		 * @param {module} [String] : The superclass name
		 * @throws [FinalExtensionException]
		 * @returns [Boolean]
		 */
		canConstruct: function (module) {
			try {
				if (Modules.typeOf(module) === Modules.types.FINAL_CLASS) {
					throw new FinalExtensionException(module);
				}
			} catch (e) {
				Core.raiseException(e);
				return false;
			}

			return true;
		},

		/**
		 * ## - Supers.buildSuperConstructor()
		 *
		 * Creates a special Superclass constructor to be set on the internal "super" property of any derived classes at instantiation.
		 * Called only for classes which are to be inherited, and only after their base member table is built.
		 * @param {module} [String] : The class name
		 * @param {memberTable} [Object] : The class member table
		 * @param {deepSupers} [Array<String>] : Superclasses of the superclass, where applicable
		 */
		buildSuperConstructor: function (module, memberTable, deepSupers) {
			if (!Supers.canConstruct(module)) {
				return;
			}

			var publicNames = memberTable.publicNames;
			var protectedNames = memberTable.protectedNames;

			/**
			 * @param {derivedInstance} [Object] : The derived class instance
			 * @param {args} [Arguments] : Arguments for the initializer
			 */
			function SuperConstructor (derivedInstance, args) {
				var superInstance = Instances.createSuperInstance(memberTable, derivedInstance);

				Instances.bind(superInstance.proxy, superInstance, publicNames);
				Instances.bind(superInstance.proxy, superInstance, protectedNames);

				Instances.bind(derivedInstance, superInstance, publicNames, true);
				Instances.bind(derivedInstance.proxy, superInstance, publicNames, true);
				Instances.bind(derivedInstance, superInstance, protectedNames, true);

				Instances.initialize(module, superInstance, deepSupers, args);
				Instances.inherit(superInstance, deepSupers);
				Instances.sanitizeAll(superInstance, derivedInstance);

				return superInstance.proxy;
			}

			Supers.constructors[module] = SuperConstructor;
			Supers.memberTables[module] = memberTable;
		},

		/**
		 * ## - Supers.getPublicStaticMembers()
		 *
		 * Returns the names of all public static members from a superclass member table
		 * @param {memberTable} [String] : The superclass member table
		 * @returns [Array<String>]
		 */
		getPublicStaticMembers: function (memberTable) {
			var publicNames = memberTable.publicNames;
			var publicStaticMembers = [];

			A.eachInArray(publicNames, function(name){
				if (A.has(memberTable.static, name)) {
					publicStaticMembers.push(name);
				}
			});

			return publicStaticMembers;
		},

		/**
		 * ## - Supers.inheritPublicStaticMembers()
		 *
		 * Binds public static superclass members to a derived class constructor
		 * @param {supers} [Array<String>] : A list of superclasses by name
		 * @param {constructor} [Function] : The derived class constructor
		 */
		inheritPublicStaticMembers: function (supers, constructor) {
			A.eachInArray(supers, function(superclass){
				if (!Supers.has(superclass)) {
					return;
				}

				var memberTable = Supers.memberTables[superclass];
				var publicStaticMembers = Supers.getPublicStaticMembers(memberTable);

				Instances.bind(constructor, memberTable.static, publicStaticMembers);
			});
		},

		/**
		 * ## - Supers.construct()
		 *
		 * Instantiates a superclass, binding its public and protected members onto the derived class instance
		 * @param {superclass} [String] : The superclass name
		 * @param {derivedInstance} [Object] : The derived class instance
		 * @returns [new SuperConstructor OR null]
		 */
		construct: function (superclass, derivedInstance) {
			if (Supers.has(superclass) && A.isObject(derivedInstance.__superArgs__)) {
				var args = derivedInstance.__superArgs__[superclass] || derivedInstance.__superArgs__;

				return new Supers.constructors[superclass](derivedInstance, args);
			}

			return null;
		}
	};

	/**
	 * Instance creation utilities
	 */
	var Instances = {
		// [Object{Function}] : Special method binders for instances
		bindMethod: {
			/**
			 * ## - Instances.bindMethod.new()
			 *
			 * Binds a special new() constructor method to a class instance only if one has not already been set
			 * @param {instance} [Object] : The class instance
			 */
			new: function (instance) {
				instance.new = A.func(instance.new);
			},

			/**
			 * ## - Instances.bindMethod.is()
			 *
			 * Binds a special is() type check method to a new class instance. Type checking will search upward through the superclass
			 * tree, if applicable, to ensure that a derived class also resolves as being of a superclass type.
			 * @param {instance} [Object] : The class instance
			 * @param {module} [String] : The name of the instance's class
			 */
			is: function (instance, module) {
				/**
				 * @param {type} [String] : The class name to check against
				 */
				instance.proxy.is = instance.is = function (type) {
					if (type === module) {
						return true;
					}

					if (A.has(instance, 'super')) {
						if (A.has(instance.super, 'proxy')) {
							return instance.super.is(type);
						} else {
							var isSuperOfType = false;

							A.eachInObject(instance.super, function(superName){
								if (instance.super[superName].is(type)) {
									return !(isSuperOfType = true);
								}
							});

							return isSuperOfType;
						}
					}

					return false;
				};
			},

			/**
			 * ## - Instances.bindMethod.super()
			 *
			 * Binds a special super() method to a class instance which will be replaced by the actual superclass instance after
			 * instance initialization via new(). Prior to initialization, super() or super.{superClass}() will serve as a means
			 * of specifying arguments to be passed into superclass constructors.
			 * @param {instance} [Object] : The class instance
			 * @param {supers} [Array<String>] : A list of superclasses by name
			 */
			super: function (instance, supers) {
				instance.__superArgs__ = {};

				if (supers.length > 0) {
					if (supers.length === 1) {
						instance.super = function () {
							instance.__superArgs__ = arguments;
						};
					} else {
						instance.super = {};

						A.eachInArray(supers, function(superclass){
							instance.super[superclass] = function () {
								instance.__superArgs__[superclass] = arguments;
							};
						});
					}
				}
			}
		},

		/**
		 * ## - Instances.createInstance()
		 *
		 * Creates and returns a normal class instance from a member table
		 * @param {memberTable} [Object] : The class member table
		 * @returns [Object]
		 */
		createInstance: function (memberTable) {
			var instance = Object.create(memberTable.class);

			instance.proxy = {};

			return instance;
		},

		/**
		 * ## - Instances.createSuperInstance()
		 *
		 * Creates and returns a base superclass instance from a member table and sets its proxy/top-level instance reference properties
		 * @param {memberTable} [Object] : The superclass member table
		 * @param {derivedInstance} [Object] : An already-created derived class instance
		 * @returns [Object]
		 */
		createSuperInstance: function (memberTable, derivedInstance) {
			var superInstance = Object.create(memberTable.class);

			superInstance.proxy = {};
			superInstance.__derivedInstance__ = derivedInstance;

			return superInstance;
		},

		/**
		 * ## - Instances.restoreFinalMember()
		 *
		 * Restores the inherited value from a base class instance final member by propagating it up the __derivedInstance__ chain
		 * @param {name} [String] : The name of the final member
		 * @param {base} [Object] : The base object
		 */
		restoreFinalMember: function (name, base) {
			var derivedInstance = base.__derivedInstance__;

			do {
				if (A.isUndefined(derivedInstance) || A.isUndefined(derivedInstance[name])) {
					break;
				}

				var isProxied = A.has(derivedInstance.proxy, name);

				Members.purge(derivedInstance, name);
				A.bindReference(name, derivedInstance, base);

				if (isProxied) {
					A.bindReference(name, derivedInstance.proxy, derivedInstance);
				}
			} while ((derivedInstance = derivedInstance.__derivedInstance__));
		},

		/**
		 * ## - Instances.bind()
		 *
		 * Clones and binds the members listed in a "members" array from a base instance object onto a proxy object. The first use for this
		 * scheme is the creation and binding of public-facing class members to the internal instance for context preservation. The second use
		 * is for inheritance of base class public and protected members onto a derived class instance, which occurs after the former case.
		 * The cause for reverse inheritance is that it is quickest to construct the initial derived instance with Object.create() using
		 * the derived class member table - after this we bind inherited members using "forceRevert" set to true to catch and revert final
		 * inherited members. Member purging is first necessary to remove any illegally bound access-modified derivations of final base members.
		 * @param {proxy} [Object] : A public alias object on which to bind properties pointing to the equivalent base instance properties
		 * @param {base} [Object] : The base instance object
		 * @param {members} [Array<String>] : A list of member names to be cloned and bound
		 * @param {forceRevert} [Boolean] : Forces overriding of derived class instance members if a base class instance member is final
		 */
		bind: function (proxy, base, members, forceRevert) {
			var baseProto = Object.getPrototypeOf(base);

			A.eachInArray(members, function(name){
				var isFinal = false;

				if (!A.isUndefined(proxy[name])) {
					if (forceRevert && !A.isWritable(baseProto, name)) {
						Members.purge(proxy, name);

						isFinal = true;
					} else {
						return;
					}
				}

				var member = base[name];

				switch (A.typeOf(member)) {
					case 'function':
						proxy[name] = A.bind(member, base);
						break;
					case 'object':
						proxy[name] = member;
						break;
					default:
						A.bindReference(name, proxy, base);
				}

				if (isFinal) {
					Instances.restoreFinalMember(name, base);
				}
			});
		},

		/**
		 * ## - Instances.initialize()
		 *
		 * Prepares an instance with special methods and calls its "new()" constructor method once
		 * @param {module} [String] : The class name
		 * @param {instance} [Object] : The class instance
		 * @param {supers} [Array<String>] : A list of superclasses by name
		 * @param {args} [Arguments] : Arguments for the initializer
		 */
		initialize: function (module, instance, supers, args) {
			Instances.bindMethod.new(instance);
			Instances.bindMethod.super(instance, supers);
			Instances.bindMethod.is(instance, module);

			instance.new.apply(instance, args);
		},

		/**
		 * ## - Instances.inherit()
		 *
		 * Instantiates and binds superclass instances to a derived class or derived superclass instance
		 * @param {instance} [Object] : The derived class instance
		 * @param {supers} [Array<String>] : A list of superclasses by name
		 */
		inherit: function (instance, supers) {
			if (supers.length > 0) {
				if (supers.length === 1) {
					instance.S = instance.super = Supers.construct(supers[0], instance);
				} else {
					instance.S = instance.super = {};

					A.eachInArray(supers, function(name){
						instance.S[name] = instance.super[name] = Supers.construct(name, instance);
					});
				}
			}
		},

		/**
		 * ## - Instances.sanitize()
		 *
		 * Removes obsolete properties from a base instance object
		 * @param {instance} [Object] : The base instance object
		 */
		sanitize: function (instance) {
			delete instance.__derivedInstance__;
			delete instance.__superArgs__;

			instance.new = null;
			instance.proxy.new = null;
		},

		/**
		 * ## - Instances.sanitizeAll()
		 *
		 * Invokes Instances.sanitize() on multiple base instance objects
		 * @param {object, [object1, [object2, ...]]} [Object] : The base instance objects as separate arguments
		 */
		sanitizeAll: function () {
			var args = A.argsToArray(arguments);

			A.eachInArray(args, function(arg){
				Instances.sanitize(arg);
			});
		}
	};

	/**
	 * Namespace utilities
	 */
	var Namespaces = {
		// [Object{Object}] : A list of namespace objects by name
		defined: {},

		/**
		 * ## - Namespaces.has()
		 *
		 * Determines whether a namespace has been defined
		 * @param {space} [String] : The namespace name
		 * @returns [Boolean]
		 */
		has: function (space) {
			return A.has(Namespaces.defined, space);
		},

		/**
		 * ## - Namespaces.resolve()
		 *
		 * Looks for an existing namespace by name, and creates one if it is not found
		 * @param {space} [String] : The namespace name
		 */
		resolve: function (space) {
			if (!Namespaces.has(space)) {
				Namespaces.defined[space] = {};
			}
		},

		/**
		 * ## - Namespaces.save()
		 *
		 * Saves any non-interface module by name to a namespace
		 * @param {module} [String] : The module name
		 * @param {space} [String] : The namespace name
		 */
		save: function (module, space) {
			if (Modules.has(module) && Modules.typeOf(module) !== Modules.types.INTERFACE) {
				Namespaces.resolve(space);

				Namespaces.defined[space][module] = Modules.get(module);
			}
		}
	};

	/**
	 * ## - InterfaceDefinition()
	 *
	 * A special internal constructor which provides an interface definer
	 * @param {name} [String] : The interface name
	 * @returns {definer} [Function] : (See: definer())
	 */
	function InterfaceDefinition (name) {
		Modules.buildModuleConstructor(name);

		// [String] : The interface name
		this.name = name;
		// [String] : The interface type; always "Interface"
		this.type = Modules.types.INTERFACE;
		// [Object] : A definition object which contains the interface members
		this.builder = {};

		/**
		 * ## - InterfaceDefinition.build()
		 * @throws [MultiDefinitionException]
		 */
		this.build = function () {
			delete Modules.queue[this.name];
			delete Modules.defined[this.name];

			Modules.definedTypes[this.name] = Modules.types.INTERFACE;

			Modules.events.trigger('built', this.name, [this, this.builder]);
			Modules.events.trigger('defined', this.name, [this.name]);
		};

		/**
		 * ## - definer()
		 *
		 * A method which receives the interface definition object
		 * @param {builder(public)} [Function] : The interface builder function
		 */
		var definer = Modules.getDefiner(this);

		A.bindAll(this, 'build');

		return definer;
	}

	/**
	 * ## - ClassDefinition()
	 *
	 * A special internal constructor which offers the base and chainable methods for class definition tools
	 * @param {name} [String] : The class name
	 * @returns {definer} [Function] : (See: definer())
	 */
	function ClassDefinition (name, type) {
		Modules.buildModuleConstructor(name);

		// [String] : The class name
		this.name = name;
		// [String] : The class type; defaults to 'Class'
		this.type = type || Modules.types.CLASS;
		// [String] : The target namespace for the class
		this.namespace = Core.activeNamespace;
		// [Array<String>] : Base classes to extend
		this.extends = [];
		// [String] : Interface to implement
		this.implements = null;
		// [Function(public, private, protected)] : A function which defines the class members
		this.builder = A.func();

		/**
		 * ## - ClassDefinition.validate()
		 *
		 * Prevents name collisions and ensures that extending classes/interfaces are specified appropriately
		 * @throws [MultiDefinitionException OR InterfaceExtendedException OR ClassImplementedException]
		 * @returns [Boolean] : Class validation check
		 */
		this.validate = function () {
			try {
				A.each(this.extends, function(module){
					if (Modules.isInterface(module)) {
						throw new InterfaceExtendedException(module, this.name);
					}
				}, this);

				if (!!this.implements && !Modules.isInterface(this.implements)) {
					throw new ClassImplementedException(this.implements, this.name);
				}
			} catch (e) {
				Core.raiseException(e);
				return false;
			}

			return true;
		};

		/**
		 * ## - ClassDefinition.build()
		 *
		 * After definition validation, kicks off the formal definition of class members via the builder function. Upon
		 * firing the "built" and "defined" events, the class will be ready for instantiation, and derived classes will
		 * be notified so that they may re-evaluate their own build readiness status.
		 */
		this.build = function () {
			if (this.validate()) {
				delete Modules.queue[this.name];

				Modules.definedTypes[this.name] = this.type;
				var members = Members.createMemberTree();

				this.builder(members.public, members.private, members.protected);

				Modules.events.trigger('built', this.name, [this, members, this.extends]);
				Modules.events.trigger('defined', this.name, [this.name]);

				if (this.namespace !== null) {
					Namespaces.save(this.name, this.namespace);
				}
			}
		};

		/**
		 * ## - ClassDefinition.allExtensionsDefined()
		 *
		 * Determine whether all extending classes have been defined
		 * @returns {ready} [Boolean]
		 */
		this.allExtensionsDefined = function () {
			var ready = true;

			A.eachInArray(this.extends, function(module){
				if (!Modules.isReady(module)) {
					return (ready = false);
				}
			});

			return ready;
		};

		/**
		 * ## - ClassDefinition.checkReadyStatus()
		 *
		 * Check to see whether the class is ready to be defined, and builds it if so
		 */
		this.checkReadyStatus = function () {
			if (this.allExtensionsDefined()) {
				if (this.implements === null || Modules.isReady(this.implements)) {
					this.build();
				}
			}
		};

		/**
		 * ## - definer()
		 *
		 * A method which receives a builder function to define the members of the class
		 * @param {builder(public, private, protected)} [Function] : The class builder function
		 */
		var definer = Modules.getDefiner(this);

		/**
		 * ## - definer.extends()
		 *
		 * Used to extend a class definition with an arbitrary number of base classes
		 * @param {supers} [String] : A comma-delimited list of base superclasses to derive this class from
		 * @returns {definer} [Function]
		 */
		definer.extends = A.bind(function(supers){
			supers = supers.replace(/\s/g, '').split(',');

			A.each(supers, function(superclass){
				Modules.inherited[superclass] = true;

				this.extends.push(superclass);

				DependencyGraph.logDependency(this.name, superclass);
				Modules.events.on('defined', superclass, this.checkReadyStatus);
			}, this);

			return definer;
		}, this);

		/**
		 * ## - definer.implements()
		 *
		 * Used to implement an interface
		 * @param {interfaceName} [String] : The interface name
		 * @returns {definer} [Function]
		 */
		definer.implements = A.bind(function(interfaceName){
			this.implements = interfaceName;

			DependencyGraph.logDependency(this.name, interfaceName);
			Modules.events.on('defined', interfaceName, this.checkReadyStatus);

			return definer;
		}, this);

		A.bindAll(this, 'validate', 'build', 'allExtensionsDefined', 'checkReadyStatus');

		return definer;
	}

	/**
	 * ### - Library method: root()
	 *
	 * Sets the root path for script includes
	 * @param {path} [String] : The root path
	 */
	function root (path) {
		Imports.root = './' + path;
	}

	/**
	 * ### - Library method: namespace()
	 *
	 * Sets a namespace to apply to the remaining modules inside a file
	 * @param {name} [String] : The namespace name
	 */
	function namespace (name) {
		Core.activeNamespace = name;
	}

	/**
	 * ### - Library method: use.namespace()
	 *
	 * Imports an internal namespace object, creating one if it does not already exist
	 * @param {name} [String] : The namespace name
	 * @returns [Object]
	 */
	var use = {
		namespace: function (name) {
			Namespaces.resolve(name);

			return Namespaces.defined[name];
		}
	};

	/**
	 * ### - Library method: include()
	 *
	 * Either just specifies a script file to load, or specifies a module to be retrieved from
	 * a particular script defined in the chainable .from() method, and returns the module
	 * @param {module} [String] : The name of the module, or a plain script file path
	 * @returns [undefined OR Object]
	 */
	function include (module) {
		if (A.isFilePath(module)) {
			Imports.getScript(module);
			return;
		}

		return {
			from: function (file) {
				return Imports.from(file, module);
			}
		};
	}

	/**
	 * ### - Library method: get()
	 *
	 * Retrieves a specific module without requiring a script path
	 * @param {module} [String] : The module name
	 * @returns [Function OR Object]
	 */
	function get (module) {
		return Imports.getModule(module);
	}

	/**
	 * ### - Library method: module()
	 *
	 * Defines a free function or object module by name
	 * @param {module} [String] : The module name
	 * @param {definition} [Function OR Object] : The module definition
	 * @throws [MultiDefinitionException]
	 */
	function module (module, definition) {
		if (A.isFunction(definition)) {
			Modules.buildFreeFunction(module, definition);
		} else if (A.isObject(definition)) {
			Modules.buildFreeObject(module, definition);
		}
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

			Imports.queueCheckRemaining();
		}
	}

	/**
	 * ### - Library method: Class()
	 *
	 * Returns an instance of the internal ClassDefinition utility
	 * @param {name} [String] : The name of the class
	 * @returns [new ClassDefinition]
	 */
	function Class (name) {
		return new ClassDefinition(name);
	}

	/**
	 * ### - Library method: Abstract.Class()
	 *
	 * Shorthand for creating a ClassDefinition instance of type 'Abstract Class'
	 * @param {name} [String] : The name of the class
	 * @returns [new ClassDefinition]
	 */
	var Abstract = {
		Class: function (name) {
			return new ClassDefinition(name, Modules.types.ABSTRACT_CLASS);
		}
	};

	/**
	 * ### - Library method: Final.Class()
	 *
	 * Shorthand for creating a ClassDefinition instance of type 'Final Class'
	 * @param {name} [String] : The name of the class
	 * @returns [new ClassDefinition]
	 */
	var Final = {
		Class: function (name) {
			return new ClassDefinition(name, Modules.types.FINAL_CLASS);
		}
	};

	/**
	 * ### - Library method: Interface()
	 *
	 * Returns an instance of the internal InterfaceDefinition utility
	 * @param {name} [String] : The name of the interface
	 * @returns [new InterfaceDefinition]
	 */
	function Interface (name) {
		return new InterfaceDefinition(name);
	}

	/**
	 * Collection of library objects and methods to prepare for global scope exposure
	 */
	var AccessUtilities = {
		root: root,
		include: include,
		get: get,
		use: use,
		namespace: namespace,
		main: main,
		Class: Class,
		Abstract: Abstract,
		Final: Final,
		Interface: Interface,
		module: module
	};

	// Export library utilities to the global scope
	A.extend(window, AccessUtilities);
})();