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
			return 'Cannot instantiate ' + Modules.typeOf(name) + ' {' + name + '}';
		};
	}

	/**
	 * ## - MultiDefinitionException()
	 *
	 * An exception for multiple definitions of a module
	 * @param {name} [String] : The name of the module
	 */
	function MultiDefinitionException (name) {
		this.toString = function () {
			return 'Class {' + name + '} cannot be defined more than once';
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
			return 'Interface {' + interfaceName + '} cannot be extended by class {' + className + '}';
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
			return Modules.definedTypes[className] + ' {' + className + '} cannot be implemented by class {' + implementationName + '}';
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
			return Modules.types.FINAL_CLASS + ' {' + className + '} cannot be extended';
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
				if (object.hasOwnProperty(key)) {
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
		 */
		deepEach: function (object, handler, stack, context, allowed) {
			handler = A.func(handler, context);
			stack = stack || [];
			allowed = allowed || [];

			A.eachInObject(object, function(key, value){
				if (A.isTypeOf(value, 'object')) {
					if (allowed.length === 0 || A.isInArray(allowed, key)) {
						stack.push(key);
						A.deepEach(object[key], handler, stack, context, allowed);
						stack.pop();
						return;
					}
				}

				if (handler(key, value, stack, object) === false) {
					return false;
				}
			});
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
		 * Extends a target object with properties from an arbitrary number of other objects (deep & recursive) and returns the result
		 * @param {object1} [Object] : The target object
		 * @param {[object2, [object3, [...]]]} [Object] : Objects used to extend target
		 * @returns {target} [Object]
		 */
		extend: function () {
			var objects = A.argsToArray(arguments);
			var target = objects[0];

			A.compare(objects, function(key, value){
				if (A.isTypeOf(value, 'object')) {
					if (!target.hasOwnProperty(key)) {
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

			A.compare(objects, function(key, value){
				if (target.hasOwnProperty(key)) {
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
		 * ## - A.extendOrDeleteEach()
		 *
		 * Either extends or deletes properties of the first element in multiple object arrays based on the remaining elements
		 * @param {action} [String] : The action to perform (either 'extend' or 'delete')
		 * @param {array} [Array<Array<Object>>] : A multidimensional array containing sub-arrays of objects to pass into A.extend() or A.delete()
		 */
		extendOrDeleteEach: function (action, array) {
			action = A[action];

			A.eachInArray(array, function(objects){
				action.apply(null, objects);
			});
		},

		/**
		 * ## - A.extendEach()
		 *
		 * Calls A.extendOrDeleteEach() with 'extend' on an array of object arrays
		 * @param {[array1, [array2, [...]]]} [Array<Array<Object>>] : An array containing object arrays for each A.extend() call
		 */
		extendEach: function () {
			A.extendOrDeleteEach('extend', A.argsToArray(arguments));
		},

		/**
		 * ## - A.deleteEach()
		 *
		 * Calls A.extendOrDeleteEach() with 'delete' on an array of object arrays
		 * @param {[array1, [array2, [...]]]} [Array<Array<Object>>] : An array containing object arrays for each A.delete() call
		 */
		deleteEach: function () {
			A.extendOrDeleteEach('delete', A.argsToArray(arguments));
		},

		/**
		 * ## - A.saveKeys()
		 *
		 * Copies each key name from an object into an array
		 * @param {object} [Object] : The object to copy from
		 * @param {array} [Array<String>] : The array to copy to
		 */
		saveKeys: function (object, array) {
			A.eachInObject(object, function(key){
				array.push(key);
			});
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
		}
	};

	/**
	 * Internal core variables and library routines
	 */
	var Core = {
		// [Boolean] : Whether or not the main() application entry point callback has been fired
		started: false,
		// [Boolean] : Whether debug mode is on
		debug: false,
		// [Boolean] : When toggled to true, module generation catalogues protected members for attachment to internal superclass "public" instances
		inSuperMode: false,

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
		 * ## - Core.generate()
		 *
		 * Cleans up global exports and starts the class generation process
		 */
		generate: function () {
			A.delete(window, AccessUtilities);
			Core.defineModules();

			// TODO: Check for still-undefined modules and throw
			// errors concerning their tentative definitions.

			Core.init();
		},

		/**
		 * ## - Core.raiseException()
		 *
		 * Logs an exception string
		 * @param {exception} [Exception] : A thrown Exception instance
		 */
		raiseException: function (exception) {
			console.error(exception.toString());
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
				Imports.load(script);
			}

			if (A.isTypeOf(module, 'string') && !Modules.has(module)) {
				Modules.buildModuleConstructor(module);
			}

			return Modules.get(module);
		},

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
		 * Determines which member categories a special member belongs to so its "writable" configuration can be defined on each.
		 * @param {member} [Object] : The special member
		 * @param {memberTable} [Object] : The module's categorized members
		 * @returns {targets} [Array<Object>] : References to the member category objects
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
					if (flags.hasOwnProperty(value)) {
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
		 * Attaches/binds final and static object members to their appropriate categories in a class member table
		 * @param {primitive} [Object] : The special member definition for the primitive
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
		 * Attaches/binds final and static primitive members to their appropriate categories in a class member table
		 * @param {primitive} [Object] : The special member definition for the primitive
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
		 * Attaches and binds static and final class members to their appropriate categories in a class member table
		 * @param {specialMembers} [Array<Object>] : A list of special member definitions (see: Members.defineSpecialMember())
		 * @param {memberTable} [Object] : The module's categorized members
		 * @param {constructor} [Function] : The module constructor
		 */
		attachSpecialMembers: function (specialMembers, memberTable, constructor) {
			A.eachInArray(specialMembers, function(member){
				switch (A.typeOf(member.value)) {
					case 'function':
					case 'object':
						Members.attachSpecialObjectMember(member, memberTable, constructor);
						break;
					default:
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
			A.saveKeys(memberTable.public, memberTable.publicNames);

			if (Core.inSuperMode) {
				A.extend(memberTable.protected, members.protected);
				A.saveKeys(memberTable.protected, memberTable.protectedNames);
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
			A.setWritable(instance, key, true);
			delete instance[key];

			if (instance.hasOwnProperty('proxy') && instance.proxy.hasOwnProperty(key)) {
				delete instance.proxy[key];
			}
		},

		/**
		 * ## - Members.bind()
		 *
		 * Clones and binds the members listed in a "keys" array from a base instance object onto a proxy object. The first use for this
		 * scheme is the creation and binding of public-facing class members to the internal instance for context preservation. The second use
		 * is for inheritance of base class public and protected members onto a derived class instance, which occurs after the former case.
		 * The cause for reverse inheritance is that it is quickest to construct the initial derived instance with Object.create() using
		 * the derived class member table - after this we bind inherited members using "forceRevert" set to true to catch and revert final
		 * inherited members. Member deletion is first necessary to remove any illegally bound access-modified derivations of final base members.
		 * @param {keys} [Array<String>] : A list of key names for the members to be cloned and bound
		 * @param {proxy} [Object] : A partial alias object on which to bind properties pointing to the equivalent base instance properties
		 * @param {base} [Object] : The base instance object
		 * @param {forceRevert} [Boolean] : Forces overriding of derived class instance members if a base class instance member is final
		 */
		bind: function (keys, proxy, base, forceRevert) {
			var baseProto = Object.getPrototypeOf(base);

			A.eachInArray(keys, function(key){
				if (!A.isUndefined(proxy[key])) {
					if (forceRevert && !A.isWritable(baseProto, key)) {
						Members.purge(proxy, key);
					} else {
						return;
					}
				}

				var member = base[key];

				switch (A.typeOf(member)) {
					case 'function':
						proxy[key] = A.bind(member, base);
						break;
					case 'object':
						proxy[key] = member;
						break;
					default:
						A.bindReference(key, proxy, base);
				}
			});
		}
	};

	/**
	 * Module utilities
	 */
	var Modules = {
		// [Object{*}] : Module type names
		types: {
			CLASS: 'Class',
			FINAL_CLASS: 'Final Class',
			ABSTRACT_CLASS: 'Abstract Class',
			INTERFACE: 'Interface',

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

					if (!eventQueue.hasOwnProperty(module)) {
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

					if (eventQueue.hasOwnProperty(module)) {
						A.each(eventQueue[module], function(handler){
							handler.apply(null, args);
						});
					}
				}
			}
		},

		// [Object{ClassDefinition OR InterfaceDefinition}] : List of modules pending generation
		queue: {},
		// [Object{Function}] : List of module constructors by name
		defined: {},
		// [Object{String}] : List of modules extended by derived classes
		inherited: {},
		// [Object{String}] : List of module types by name
		definedTypes: {},

		/**
		 * ## - Modules.getDefiner()
		 *
		 * Returns a special function which receives and stores a builder function for a module. In the case of classes,
		 * this function will have additional properties applied to it which offer chainable class customization methods.
		 * The definer function's context is bound to a ClassDefinition or InterfaceDefinition instance.
		 * @param {context} [Object] : The context to bind the definer to
		 * @returns [Function]
		 */
		getDefiner: function (context) {
			return A.bind(function definer(builder){
				this.builder = builder;
				Modules.queue[this.name] = this;
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
			return (Modules.has(module) && !Modules.queue.hasOwnProperty(module));
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
		 * Determines whether a module has been declared and saved to Modules.defined
		 * @param {module} [String] : The module name
		 * @returns [Boolean]
		 */
		has: function (module) {
			return (Modules.defined.hasOwnProperty(module) && A.isFunction(Modules.defined[module]));
		},

		/**
		 * ## - Modules.get()
		 *
		 * Return a module constructor by name, or null if no such module is available
		 * @param {module} [String] : The module name
		 * @returns [Function]
		 */
		get: function (module) {
			return Modules.defined[module] || null;
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
		 * ## - Modules.inherit()
		 *
		 * Instantiates and binds superclasses to a derived class or internal derived superclass instance
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
		 * ## - Modules.initialize()
		 *
		 * Runs and deletes the new() initializer function for a newly-constructed class and returns the public class instance
		 * @param {instance} [Object] : The internal class instance
		 * @param {args} [Arguments] : Arguments for the initializer
		 * @returns {instance.proxy} [Object]
		 */
		initialize: function (instance, args) {
			instance.new = A.func(instance.new);
			instance.new.apply(instance, args);

			delete instance.new;
			return instance.proxy;
		},

		/**
		 * ## - Modules.buildModuleConstructor()
		 *
		 * Sets up a module constructor and delegates an event handler to update the module members upon running its builder function
		 * @param {module} [String] : The module name
		 */
		buildModuleConstructor: function (module) {
			if (Modules.has(module)) {
				return;
			}

			var MemberTable;
			var supers = [];

			function Constructor () {
				if (A.isUndefined(MemberTable) || !Modules.canConstruct(module)) {
					return null;
				}

				var instance = Object.create(MemberTable.class);

				Members.bind(MemberTable.publicNames, (instance.proxy = {}), instance);
				Modules.inherit(instance, supers);

				return Modules.initialize(instance, arguments);
			}

			Modules.events.on('built', module, function(definition, members, superclasses){
				if (definition.type === Modules.types.INTERFACE) {
					// TODO: Save interface members to a special bank for implementation by classes
					return;
				}

				Core.inSuperMode = Modules.isInherited(definition);
				MemberTable = Members.buildMemberTable(members, Constructor);
				supers = supers.concat(superclasses);

				if (Core.inSuperMode) {
					Supers.buildSuperConstructor(definition.name, MemberTable, superclasses);
				}

				if (supers.length > 0) {
					Supers.inheritPublicStaticMembers(supers, Constructor);
				}
			});

			Modules.defined[module] = Constructor;
		}
	};

	/**
	 * Superclass utilities
	 */
	var Supers = {
		// [Object{Function(derivedInstance)}] : A list of superclass constructors by name
		constructors: {},
		// [Object{Object}] : A list of base class member tables
		memberTables: {},

		/**
		 * ## - Supers.canConstruct()
		 *
		 * Determines whether a superclass can be constructed
		 * @param {superclass} [String] : The superclass name
		 * @throws [FinalExtensionException]
		 * @returns [Boolean]
		 */
		canConstruct: function (superclass) {
			try {
				if (Modules.typeOf(superclass) === Modules.types.FINAL_CLASS) {
					throw new FinalExtensionException(superclass);
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
		 * @param {name} [String] : The class name
		 * @param {memberable} [Object] : The class member tree
		 * @param {deepSupers} [Array<String>] : Superclasses of the superclass, where applicable
		 */
		buildSuperConstructor: function (name, memberTable, deepSupers) {
			if (!Supers.canConstruct(name)) {
				return;
			}

			var publicNames = memberTable.publicNames;
			var protectedNames = memberTable.protectedNames;

			/**
			 * @param {derivedInstance} [Object] : The derived class instance
			 */
			function SuperConstructor (derivedInstance) {
				var superInstance = Object.create(memberTable.class);
				superInstance.proxy = {};

				Members.bind(publicNames, superInstance.proxy, superInstance);
				Members.bind(protectedNames, superInstance.proxy, superInstance);

				Members.bind(publicNames, derivedInstance, superInstance, true);
				Members.bind(publicNames, derivedInstance.proxy, superInstance, true);
				Members.bind(protectedNames, derivedInstance, superInstance, true);

				Modules.inherit(superInstance, deepSupers);

				return superInstance.proxy;
			}

			Supers.constructors[name] = SuperConstructor;
			Supers.memberTables[name] = memberTable;
		},

		/**
		 * ## - Supers.inheritPublicStaticMembers()
		 *
		 * Binds public static base class members to a derived class constructor
		 * @param {supers} [Array<String>] : A list of superclasses by name
		 * @param {constructor} [Function] : The derived class constructor
		 */
		inheritPublicStaticMembers: function (supers, constructor) {
			A.eachInArray(supers, function(superclass){
				var memberTable = Supers.memberTables[superclass];
				var publicNames = memberTable.publicNames;
				var publicStaticMembers = [];

				A.eachInArray(publicNames, function(name){
					if (memberTable.static.hasOwnProperty(name)) {
						publicStaticMembers.push(name);
					}
				});

				Members.bind(publicStaticMembers, constructor, memberTable.static);
			});
		},

		/**
		 * ## - Supers.construct()
		 *
		 * Instantiates a superclass, binding its public and protected members onto the derived class instance
		 * @param {superclass} [String] : The superclass name
		 * @param {derivedInstance} [Object] : The derived class instance
		 * @returns [SuperConstructor]
		 */
		construct: function (superclass, derivedInstance) {
			return new Supers.constructors[superclass](derivedInstance);
		}
	};

	/**
	 * ## - InterfaceDefinition()
	 *
	 * A special internal constructor which provides an interface definition method
	 * @param {name} [String] : The interface name
	 * @returns {definer} [Function] : (See: definer())
	 */
	function InterfaceDefinition (name) {
		Modules.buildModuleConstructor(name);

		// [String] : The interface name
		this.name = name;
		// [String] : The interface type; always "Interface"
		this.type = Modules.types.INTERFACE;
		// [Function(public)] : A function which defines the interface members
		this.builder = A.func();

		/**
		 * ## - InterfaceDefinition.build()
		 */
		this.build = function(){
			var members = {
				public: {}
			};

			delete Modules.queue[this.name];
			Modules.definedTypes[this.name] = Modules.types.INTERFACE;

			this.builder(members);

			Modules.events.trigger('built', this.name, [this, members]);
			Modules.events.trigger('defined', this.name, [this.name]);
		};

		/**
		 * ## - definer()
		 *
		 * An internal method which receives a builder function to define the members of the interface; exposed by the InterfaceDefinition constructor
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
		 * @returns [Boolean] : Class definition validity
		 */
		this.validate = function () {
			try {
				if (Modules.definedTypes.hasOwnProperty(this.name)) {
					throw new MultiDefinitionException(this.name);
				}

				A.eachInArray(this.extends, function(module){
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
		 * be notified so that they may evaluate their own readiness for building.
		 */
		this.build = function () {
			if (this.validate()) {
				var members = Members.createMemberTree();

				delete Modules.queue[this.name];
				Modules.definedTypes[this.name] = this.type;

				this.builder(members.public, members.private, members.protected);

				Modules.events.trigger('built', this.name, [this, members, this.extends]);
				Modules.events.trigger('defined', this.name, [this.name]);
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
		 * Check to see whether class is ready to be defined
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
		 * An internal method which receives a builder function to define the members of the class; exposed by the ClassDefinition constructor
		 * @param {builder(public, private, protected)} [Function] : The class builder function
		 */
		var definer = Modules.getDefiner(this);

		/**
		 * ## - definer.extends()
		 *
		 * Used to extend a class definition with an arbitrary number of base classes
		 * @param {classes} [String] : A comma-delimited list of base classes to extend onto the new class
		 * @returns {definer} [Function] : The definer() method
		 */
		definer.extends = A.bind(function(classes){
			classes = classes.replace(/\s/g, '').split(',');

			A.each(classes, function(name){
				this.extends.push(name);
				Modules.inherited[name] = true;
				Modules.events.on('defined', name, this.checkReadyStatus);
			}, this);

			return definer;
		}, this);

		/**
		 * ## - definer.implements()
		 *
		 * Used to implement an interface
		 * @param {_interface} [String] : The interface name
		 * @returns {definer} [Function] : The definer() method
		 */
		definer.implements = A.bind(function(_interface){
			this.implements = _interface;
			Modules.events.on('defined', _interface, this.checkReadyStatus);
			return definer;
		}, this);

		A.bindAll(this, 'validate', 'build', 'allExtensionsDefined', 'checkReadyStatus');

		return definer;
	}

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
	 * @returns [ClassDefinition]
	 */
	function Class (name) {
		return new ClassDefinition(name);
	}

	/**
	 * ### - Library method: Abstract.Class()
	 *
	 * Shorthand for creating a ClassDefinition instance of type 'Abstract Class'
	 * @param {name} [String] : The name of the class
	 * @returns [ClassDefinition]
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
	 * @returns [ClassDefinition]
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
	 */
	function Interface (name) {
		return new InterfaceDefinition(name);
	}

	/**
	 * Collection of library objects and methods to prepare for global scope exposure
	 */
	var AccessUtilities = {
		include: include,
		main: main,
		Class: Class,
		Abstract: Abstract,
		Final: Final,
		Interface: Interface
	};

	// Export library utilities to the global scope
	A.extend(window, AccessUtilities);
})();