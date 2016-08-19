(function(){
	'use strict';

	/**
	 * ## - AccessException()
	 *
	 * An internal Error handler utility
	 */
	function AccessException (error) {
		this.toString = function () {
			return 'Access.js Exception: ' + error;
		};
	}

	/**
	 * Convenience methods for internal library use only
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
			if (!A.typeOf(assignee, 'function')) {
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

				if (A.typeOf(method, 'function')) {
					context[methodName] = A.bind(method, context);
				}

				args.splice(1, 1);
			}
		},

		/**
		 * ## - A.bindAllMethods()
		 *
		 * Iterates over the properties of an object looking for functions, and binds each to a particular context
		 * @param {object} [Object] : The object to iterate over
		 * @param {context} [Object] : The context for the functions
		 */
		bindAllMethods: function (object, context) {
			A.each(object, function(key, value){
				if (A.typeOf(value, 'function')) {
					object[key] = A.bind(value, context);
				}
			});
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
		 * ## - A.eachInArray()
		 *
		 * Iterates over the elements in an array, invoking a handler for each
		 * @param {array} [Array<*>] : The array to iterate over
		 * @param {handler(value, index)} [Function] : A handler function to act with the element data
		 */
		eachInArray: function (array, handler) {
			var length = array.length;
			var i = length + 1;

			if (length < 1) {
				return;
			}

			while (--i) {
				var index = length - i;

				if (handler(array[index], index) === false) {
					break;
				}
			}
		},

		/**
		 * ## - A.eachInObject()
		 *
		 * Iterates over the unique properties of an object, invoking a handler for each
		 * @param {object} [Object] : The object to iterate over
		 * @param {handler(key, value)} [Function] : A handler function to act with the key/value pair
		 */
		eachInObject: function (object, handler) {
			for (var key in object) {
				if (object.hasOwnProperty(key)) {
					if (handler(key, object[key]) === false) {
						break;
					}
				}
			}
		},

		/**
		 * ## - A.each()
		 *
		 * Iterates over a list of items (either an Object or an Array). Only performs shallow iteration on objects.
		 * @param {list} [Array<*>, Object] : The list to iterate over
		 * @param {handler} [Function] : A handler function to run for each iteration
		 * Optional @param {context} [Object] : A context to bind the handler function to
		 */
		each: function (list, handler, context) {
			handler = A.func(handler);

			if (context) {
				handler = A.bind(handler, context);
			}

			if (A.instanceOf(list, Array)) {
				A.eachInArray(list, handler);
			} else if (A.instanceOf(list, Object) && !A.typeOf(list, 'function')) {
				A.eachInObject(list, handler);
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
					if (A.typeOf(value, 'object')) {
						A.extend((target[key] = {}), value);
					} else {
						target[key] = value;
					}
				}
			});

			return target;
		},

		/**
		 * ## - A.extendEach()
		 *
		 * Invokes A.extend() on each of a list of object Arrays containing arguments to be passed into the method
		 * @param {[array1, [array2, [...]]]} [Array<Object>] : An array containing objects for the A.extend() call
		 */
		extendEach: function () {
			var args = A.argsToArray(arguments);

			A.each(args, function(objects){
				A.extend.apply(null, objects);
			});
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
	 * Internal core variables and library routines
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
			Modules.defineModules();

			// TODO: Check for still-undefined modules and throw
			// errors concerning their tentative definitions.

			Core.init();
		},

		/**
		 * ## - Core.exception()
		 *
		 * Logs an exception string
		 * @param {exception} [Exception] : A thrown Exception instance
		 */
		exception: function (exception) {
			console.error(exception.toString());
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

			if (A.typeOf(module, 'string') && !Modules.has(module)) {
				Modules.buildModuleTemplate(module);
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
	 * Module utilities
	 */
	var Modules = {
		// [Object{String}] : Module type variants
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
			 * Modules.events.on()
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
			 * Modules.events.trigger()
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
		// [Object{String}] : List of module types by name
		definedTypes: {},

		/**
		 * ## - Modules.isReady()
		 *
		 * Determine whether or not a module has been defined and removed from the pending queue
		 * @param {module} [String] : The module name
		 */
		isReady: function (module) {
			return (Modules.has(module) && !Modules.queue.hasOwnProperty(module));
		},

		/**
		 * ## - Modules.has()
		 *
		 * Determine whether or not a module has been declared and saved to Modules.defined
		 * @param {module} [String] : The module name
		 */
		has: function (module) {
			return (Modules.defined.hasOwnProperty(module) && A.typeOf(Modules.defined[module], 'function'));
		},

		/**
		 * ## - Modules.get()
		 *
		 * Return a module by name, or null if no such module is available
		 * @param {module} [String] : The module name
		 */
		get: function (module) {
			return Modules.defined[module] || null;
		},

		/**
		 * ## - Modules.typeOf()
		 *
		 * Return the type of a module by name, or null if no such module is available
		 * @param {module} [String] : The module name
		 */
		typeOf: function (module) {
			return Modules.definedTypes[module] || null;
		},

		/**
		 * ## - Modules.canInstantiate()
		 *
		 * Determine whether or not a module can be instantiated based on is type
		 * @param {module} [String] : The module name
		 */
		canInstantiate: function (module) {
			return A.isInArray(Modules.types.instantiable, Modules.typeOf(module));
		},

		/**
		 * ## - Modules.bindPublicMembers()
		 *
		 * Creates a "public" property of a newly-constructed class instance and binds the public members of the class to the property.
		 * The property serves as a proxy for the public members already directly bound to the instance. This technique allows public
		 * members and methods to be accessed via the public property returned by the class constructor, but for the original method
		 * definitions to act on "this", the context being the whole instance with all of its public, private, or protected members.
		 * @param {publicMembers} [Object] : An object containing the public class members
		 * @param {keyList} [Array<String>] : A cached list of the public member object's own enumerable keys to optimize iteration
		 * @param {instance} [Object] : A newly-constructed class instance
		 */
		bindPublicMembers: function (publicMembers, keyList, instance) {
			instance.public = {};

			A.eachInArray(keyList, function(key){
				var member = publicMembers[key];

				switch (typeof member) {
					case 'function':
						instance.public[key] = A.bind(member, instance);
						break;
					case 'object':
						instance.public[key] = Object.create(member);
						break;
					default:
						Object.defineProperty(instance.public, key, {
							configurable: true,
							get: function () {
								return instance[key];
							},
							set: function(literal) {
								instance[key] = literal;
							}
						});
				}
			});
		},

		/**
		 * ## - Modules.buildModuleTemplate()
		 *
		 * Sets up the module constructor and delegates an event handler to update the module members upon running its builder function
		 * @param {module} [String] : The module name
		 */
		buildModuleTemplate: function (module) {
			if (Modules.has(module)) {
				return;
			}

			var ClassMembers = {};
			var PublicMembers = {};
			var PublicMembersKeyList = [];

			function Constructor () {
				try {
					if (!Modules.canInstantiate(module)) {
						throw new AccessException('Cannot instantiate ' + Modules.typeOf(module) + ': {' + module + '}');
					}
				} catch (e) {
					Core.exception(e);
					return;
				}

				var instance = Object.create(ClassMembers);

				Modules.bindPublicMembers(PublicMembers, PublicMembersKeyList, instance);

				return instance.public;
			}

			Modules.events.on('built', module, function(_public, _private, _protected){
				A.extend(ClassMembers, _public, _private, _protected);
				A.extend(PublicMembers, _public);

				A.each(PublicMembers, function(key){
					PublicMembersKeyList.push(key);
				});
			});

			Modules.defined[module] = Constructor;
		},

		/**
		 * ## - Modules.getDefiner()
		 *
		 * Returns a special function which receives and stores a builder function for a module. In the case of classes,
		 * this function will have additional properties applied to it which offer chainable class customization methods.
		 * The definer function's context is bound to a ClassDefinition or InterfaceDefinition instance.
		 */
		getDefiner: function () {
			return function definer (builder) {
				this.builder = builder;
				Modules.queue[this.name] = this;
			};
		},

		/**
		 * ## - Modules.defineModules()
		 *
		 * Defines all modules
		 */
		defineModules: function () {
			A.each(Modules.queue, function(module, definition){
				definition.checkReadyStatus();
			});
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
		Modules.buildModuleTemplate(name);

		// [String] : The interface name
		this.name = name;
		// [Function(void)] : A function which defines the interface members
		this.builder = A.func();

		this.build = function(){

		};

		/**
		 * ## - definer()
		 *
		 * An internal method which receives a builder function to define the members of the interface; exposed by the InterfaceDefinition constructor
		 * @param {builder(void)} [Function] : The interface builder function
		 */
		var definer = A.bind(Modules.getDefiner(), this);

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
		Modules.buildModuleTemplate(name);

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
		 * @returns [Boolean] : Class definition validity
		 * @throws [AccessException]
		 */
		this.validate = function () {
			try {
				if (Modules.definedTypes.hasOwnProperty(this.name)) {
					throw new AccessException('Class {' + this.name + '} defined more than once');
				}

				A.each(this.extends, function(value){
					if (Modules.definedTypes[value] === Modules.types.INTERFACE) {
						throw new AccessException('Interface {' + value + '} cannot be extended (Class: {' + this.name + '})');
					}
				}, this);

				if (this.implements && Modules.definedTypes[this.implements] !== Modules.types.INTERFACE) {
					throw new AccessException(Modules.definedTypes[this.implements] + ' {' + this.implements + '} cannot be implemented (Class: {' + this.name + '})');
				}
			} catch (e) {
				Core.exception(e);
				return false;
			}

			return true;
		};

		/**
		 * ## - ClassDefinition.build()
		 *
		 * Sets up the class members via this.builder(), passes the modified member objects into the module's "built" event
		 * handler for attachment to the MemberGroup prototypes, and finally triggers the module's "defined" event to
		 * potentially kick off builds of modules which extend this one. Manually called via Modules.build().
		 */
		this.build = function () {
			if (this.validate()) {
				var members = {
					public: {
						static: {},
						final: {}
					},
					private: {
						static: {}
					},
					protected: {
						static: {},
						final: {}
					}
				};

				delete Modules.queue[this.name];
				Modules.definedTypes[this.name] = this.type;

				// TODO: Attach base class/interface members to the member objects before calling this.builder()

				this.builder(members.public, members.private, members.protected);

				Modules.events.trigger('built', this.name, [members.public, members.private, members.protected]);
				Modules.events.trigger('defined', this.name, [this.name]);
			}
		};

		/**
		 * ## - ClassDefinition.allExtensionsDefined()
		 *
		 * Determine whether all extending classes have been defined
		 * @returns {ready} [Boolean] : State representing the readiness of all extending classes
		 */
		this.allExtensionsDefined = function () {
			var ready = true;

			A.each(this.extends, function(module){
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
		var definer = A.bind(Modules.getDefiner(), this);

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
	 */
	function Class (name) {
		return new ClassDefinition(name);
	}

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
		Interface: Interface
	};

	// Export library utilities to the global scope
	A.extend(window, AccessUtilities);
})();