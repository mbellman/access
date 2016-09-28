# Access : Documentation

[I. Global Methods](#i-global-methods)  
[> Class](#class)  
[> Final.Class](#finalclass)  
[> Abstract.Class](#abstractclass)  
[> Interface](#interface)  
[> module](#module)  
[> root](#root)  
[> namespace](#namespace)  
[> use.namespace](#usenamespace)  
[> include](#include)  
[> get](#get)  
[> main](#main)  
[> ACCESS_BUNDLE_MODE](#access_bundle_mode)  
[II. Instance Methods](#ii-instance-methods)  
[> is](#is)  
[> new](#new)  
[> super](#super)  
[III. Internals](#iii-internals)  
[> Class Definer](#class-definer)  
[> extends](#extends)  
[> implements](#implements)  
[> Interface Definer](#interface-definer)

## I. Global Methods
All global methods are deleted from `window` immediately prior to class generation.

# Class()
**Class()** is used to create class definitions.

### Usage
`Class(name)`

### Arguments
`name` (String) : The name of the class

### Returns
`Class Definer` (Function) : A [Class Definer](#class-definer)

### Description
This method creates an internal store of a class if one does not already exist under its name. It returns a [Class Definer](#class-definer) function, which in turn can intake the class [builder](#builder) function or set the class extensions/implementation. A class [builder](#builder) function is used to define the class members, and gets executed only once per class just before application runtime.

### Example
In principle, the following defines a class `ClassA`. In practice, it delegates the class to be generated internally just before application runtime, preparing its various `public` and `private` members to be defined upon execution of the class [builder](#builder) function. Prior to class generation, the class cannot be instantiated.

```javascript
Class('ClassA')(function(public, private){
	private.secretNumber = 10;
	public.nonSecretString = "String";

	// Constructor method
	public.new = function () {};

	public.getSecretNumber = function () {
		return this.secretNumber;
	};
});
```

# Final.Class
[Classes](#class) can be declared as **final** with `Final.Class`.

### Usage
`Final.Class(name)`

### Arguments
`name` (String) : The name of the class

### Returns
`Class Definer` (Function) : A [Class Definer](#class-definer)

### Description
**Final Classes** are special class variants which cannot be [extended](#extends) by other classes. In some cases one may wish for a class not to be inheritable, or that it should represent the "topmost" level of an inheritance hierarchy. Final classes are expressly suited for such purposes.

### Example
```javascript
Class('BaseLevel')(function(public){
	public.new = function (message) {
		console.log(message);
	};	
});

Final.Class('TopLevel').extends('BaseLevel')(function(public){
	public.new = function () {
		this.super('TopLevel extending BaseLevel!');
	};
});

// "Final Class [TopLevel] cannot be extended"
Class('DerivedLevel').extends('TopLevel')(function(public){
	// ...
});
```

# Abstract.Class
[Classes](#class) can be declared as **abstract** with `Abstract.Class`.

### Usage
`Abstract.Class(name)`

### Arguments
`name` (String) : The name of the class

### Returns
`Class Definer` (Function) : A [Class Definer](#class-definer)

### Description
**Abstract Classes** are special class variants which cannot be instantiated. They represent a primitive or generalized implementation which is designed to be [extended](#extends) by other classes, but not strictly usable on its own. They differ from [interfaces](#interface) in that overriding the members of an abstract class is not mandatory, and said members can have unique values. They are appropriate when one intends for the class to be [extended](#extends) in a potential variety of ways, but not to enforce a "contract" requiring an implementation override of any specific members.

### Example
`abstract.js`
```javascript
Abstract.Class('SimpleClass')(function(public){
	public.value = "Hello";

	public.method = function () {
		console.log(this.value);
	};
});

Class('ComplexClass').extends('SimpleClass')(function(public){
	public.complexMethod = function () {
		this.super.method();
	};
});
```

`main.js`
```javascript
(function(){
	include('abstract.js');

	var SimpleClass = get('SimpleClass');
	var ComplexClass = get('ComplexClass');

	main(function(){
		// "Cannot instantiate Abstract Class [SimpleClass]"
		var simpleClass = new SimpleClass();
	});
})();
```

# Interface
An **Interface** defines a collection of variables and methods which must be publicly defined by implementing [classes](#class).

### Usage
`Interface(name)`

### Arguments
`name` (String) : The name of the interface

### Returns
`Interface Definer` (Function) : An [Interface Definer](#interface-definer)

### Description
Interfaces are distinct from classes in that they cannot be instantiated, obtained via [get()](#get) or [include()](#include), or otherwise referenced directly within your application's code. They can however be [implemented](#implements) by classes, which essentially just runs a validation check during class generation ensuring that any implementing class publicly overrides the Interface members with a custom implementation. Note, however, that by specifying arguments for an interface method, we can require class implementations of that method to use the same number of arguments. Meanwhile, interface variables must be defined as null to indicate their status as such.

For more information, see [the main readme entry on interfaces](../README.md#interfaces).

### Example

```javascript
Interface('IFood')({
	name: null,
	calories: null,

	prepare: function () {},
	serve: function (setting, utensil) {}
});

Class('Hamburger').implements('IFood')(function(public, private){
	private.ingredients = [];
	public.name = "Hamburger";    // Interface variable
	public.calories = 800;        // Interface variable

	private.cookPatty = function () {
		console.log("Ssssssss");
	};

	private.buildIngredients = function () {
		this.ingredients.concat(["Bun", "Lettuce", "Tomato", "Pickle", "Patty"]);
	};

	// Interface method
	public.prepare = function () {
		this.cookPatty();
		this.buildIngredients();
	};

	// Interface method
	public.serve = function (setting, utensil) {
		return [setting, utensil, this.ingredients];
	};
});

Class('Soup').implements('IFood')(function(public, private){
	private.broth = null;
	private.additions = [];
	public.name = "Soup";     // Interface variable
	public.calories = 450;    // Interface variable

	private.makeBroth = function () {
		this.broth = "Chicken broth";
	};

	private.putAdditions = function () {
		this.additions.concat(["Chicken", "Basil", "Celery", "Tomato"]);
	};

	// Interface method
	public.prepare = function () {
		this.makeBroth();
		this.putAdditions();
	};

	// Interface method
	public.serve = function (setting, utensil) {
		return [setting, utensil, this.broth, this.additions];
	};
});
```

# module
**module()** defines "free" functions or objects to be [included](#include) in other files.

### Usage
`module(name, export)`

### Arguments
`name` (String) : A name identifier for the module  
`export` (Function | Object) : A function or object representing the content of the module

### Returns
No return value

### Description
Certain routines or objects not bound to any particular [class](#class) can be defined in isolation using the **module()** method. They can then be included or [gotten](#get) in other script files for use.

### Example
`utils.js`
```javascript
module('reverseText', function (string) {
	return string.split('').reverse().join('');
});

module('props', {
	value: "Hi!",
	num: 123
});
```

`main.js`
```javascript
(function(){
	include('utils.js');

	var reverseText = get('reverseText');
	var props = get('props');

	main(function(){
		var reversed = reverseText("Hello there!");

		console.log(reversed);     // "!ereht olleH"
		console.log(props.value);  // "Hi!"
		console.log(props.num);    // 123
	});
})();
```

# root
**root()** sets the root path for script [includes](#include).

### Usage
`root(path)`

### Arguments
`path` (String) : The root directory to include scripts from

### Returns
No return value

### Description
All script [includes](#include) will be loaded relative to the root directory. By default this value is ".", corresponding to the root project directory.

### Example
```javascript
root('app/js');

// Loads app/js/Application.js
include('Application.js');
```

# namespace
A **namespace** provides a common grouping of related [classes](#class) or [modules](#module). [Interfaces](#interface) remain unaffected by namespacing.

### Usage
`namespace(name)`

### Arguments
`name` (String) : The namespace identifier

### Returns
No return value

### Description
Calling **namespace()** at a particular point in a script file will cause all following classes or modules inside the file to fall under the specified namespace. **Namespaces** are used to associated related classes or modules, either for clarity, organization, or as a formality. Namespaced classes and modules can still be [included](#include) or [gotten](#get) directly, but by invoking [use.namespace()](#usenamespace) they can all be obtained as a group.

### Example
`getCoordinateProjection.js`
```javascript
namespace('Graphics');

// Graphics.getCoordinateProjection()
module('getCoordinateProjection', function (x, y, z) {
	// ...
});
```

`Rasterizer.js`
```javascript
namespace('Graphics');

// Graphics.Rasterizer
Class('Rasterizer')(function(public){
	// ...
});
```

`SceneRenderer.js`
```javascript
namespace('Graphics');

// Graphics.SceneRenderer
Class('SceneRenderer')(function(public){
	// ...
});
```

# use.namespace
**use.namespace()** retrieves a [namespace](#namespace) object.

### Usage
`use.namespace(name)`

### Arguments
`name` (String) : The namespace identifier

### Returns
`namespace` (Object) : The namespace object

### Description
When [included](#include) script files use namespacing to categorize [classes](#class) or [modules](#module), these classes/modules are added to an internal namespace object. **use.namespace()** retrieves this object and all of its contained classes/modules.

### Example
```javascript
include('getCoordinateProjection.js');
include('Rasterizer.js');
include('SceneRenderer.js');

var Graphics = use.namespace('Graphics');

var scene = new Graphics.SceneRenderer();
var coordinate = Graphics.getCoordinateProjection(5, 3.2, 7.9);
```

# include
**include()** is used to manage dependencies and script imports.

### Usage
`include(dependencyName).from(script)`  
`include(script)`

### Arguments
`dependencyName` (String) : The class or module to retrieve by name  
`script` (String) : The path to the script file containing the class or module

### Returns
`dependency` (Function) : The class constructor function or module requested

### Description
**include()** either retrieves a dependency and provides a chainable **from()** method to specify the containing script file, or simply loads a script file ending with a valid extension.

### Example
```javascript
(function(){
	include('core/AppUtils.js');

	var User = include('User').from('core/User.js');

	Class('Application')(function(public){
		public.user = null;

		public.new = function () {
			this.user = new User();
		};

		public.start = function () {
			// ...
		};
	});
})();
```

# get
**get()** merely retrieves a [class](#class) or [module](#module) with the assumption that the containing script has already been included.

### Usage
`get(dependencyName)`

### Arguments
`dependencyName` (String) : The class or module to retrieve by name

### Returns
`dependency` (Function) : The class constructor function or module requested

### Description
Whenever an [included](#include) script file defines multiple classes or modules, it may be easier to simply include the file once, and use **get()** to obtain the specific classes or modules needed. **get()** only serves as a shorthand for **include(dependencyName).from(script)**, sans the script load.

### Example
`core/AppUtils.js`
```javascript
Class('SomeClass')(function(public){
	// ...
});

module('extend', function () {
	// ...
});
```

`main.js`
```javascript
(function(){
	include('core/AppUtils.js');

	var SomeClass = get('SomeClass');
	var extend = get('extend');
})();
```

# main
**main()** defines the entry point for an application.

### Usage
`main(callback)`

### Arguments
`callback` (Function) : A callback to be run once all script [includes](#include) have been resolved and all classes generated

### Returns
No return value

### Description
Because of the asynchronous nature of script [includes](#include) and [class](#class) generation, it is "unsafe" to attempt to instantiate any classes or call any free [module](#module) methods before scripts and classes/modules are resolved. **main()** allows for the definition of one application entry point function to be called once the application is ready to be run. Any class instantiation or free module references should occur either within **main()** or following the sequence of events kicked off by the **main()** callback.

### Example
```javascript
(function(){
	include('core/AppUtils.js');
	include('core/System.js');
	include('tools/Tools.js');

	var Application = include('Application').from('core/Application.js');

	main(function(){
		var app = new Application();

		app.start();
	});
})();
```

# ACCESS_BUNDLE_MODE
While not technically a function, setting the global `ACCESS_BUNDLE_MODE` variable to `true` will cause Access to **ignore script includes**. The purpose of this is to allow many module files to be bundled into one and run without script dependencies failing to be resolved. Meanwhile, all module [includes](#include) and [gets](#get) will still function as normal, allowing for code consolidation and minification without any disruption of behavior.

### Example
`bundle.js`
```javascript
ACCESS_BUNDLE_MODE = true;

// Originally from "User.js"
(function(){
	Class('User')(function(public){
		// ...
	});
})();

// Originally from "SomeClass.js"
(function(){
	Class('SomeClass')(function(public){
		public.baseMethod = function () {
			// ...
		};
	});
})();

// Originally from "MyClass.js"
(function(){
	include('SomeClass.js');   // Ignored

	var User = include('User').from('User.js');   // Returns the "User" class without loading any script called "User.js"

	Class('MyClass').extends('SomeClass')(function(public){
		public.user = null;

		public.new = function () {
			this.user = new User();
		};
	});
})();
```

---

## II. Instance Methods
All class instances have certain methods built-in. Some are publicly accessible on the outer instance, and some are accessible internally within the class definition.

# is
The `is()` method is attached to all class instances. Its use is to determine whether the instance is an **instance of** a specific class.

### Usage
`instance.is(class)`

### Arguments
`class` (String) : The name of the class to check the instance against

### Returns
No return value

### Description
Due to the nature by which **Access** implements class generation and instance construction to A) allow for asynchronous module loading and B) enable public/private/protected member behavior, returned instances are not strictly an `instanceof` their classes. `is()` provides a proprietary means of reconciling instances with their types. Any instance of a derived class will also evaluate as an instance of its inherited superclasses.

### Example
```javascript
Class('Application')(function(public){
	public.new = function () {
		console.log('Instantiated!');
	};
});

(function(){
	var Application = get('Application');

	main(function(){
		var app = new Application();

		app.is('Application');   // true
	});
})();
```

# new
The `public.new` method inside a class is automatically run each time the class is instantiated.

### Usage
```javascript
Class('MyClass')(function(public){
	public.new = function () {
		// ...
	};
});
```

### Arguments
Custom arguments

### Returns
No return value

### Description
The **new** method of a class is run every time an instance of that class is created. It can be used to receive and process arguments passed into the constructor or to call any other initialization routines. Though it is declared as public, it is **not** accessible on individual instances and can only run once per instance.

### Example
```javascript
Class('MyClass')(function(public, private){
	private.value = null;

	public.new = function (value) {
		this.value = value;
	};

	public.getValue = function () {
		return this.value;
	};
});

(function(){
	var MyClass = get('MyClass');

	main(function(){
		var myClass = new MyClass('Hi there!');

		myClass.getValue();   // Returns 'Hi there!'
	});
})();
```

# super
`super` provides a means of accessing superclass members from inside a derived class definition.

### Usage
```javascript
// Superclass "BaseClass" defined in another file...
Class('MyClass').extends('BaseClass')(function(public){
	public.new = function () {
		this.super(/* ... */);   // Arguments for the superclass
	};

	public.callSuperMethod = function () {
		this.super.callMethod();
	};
});
```

### Arguments
**Inside new():** Custom arguments  
**Outside new():** Not a function

### Returns
No return value

### Description
**super** is a special property attached to the internal `this` context of a derived class which permits access to public and protected superclass members, even when they are overridden by the derived class. When derived classes do **not** override superclass members, both public and protected superclass members are still accessible directly on the internal `this` context of the derived class, making `super` rather **super**fluous in this case. The other useful function of **super** is to act as a pseudo-constructor for superclasses when called inside the [new](#new) method of a derived class. Note that superclass members **are not by any means** accessible until referenced in derived class methods **other than** `new`.

### Example
**super** as a means of referencing overridden superclass members:

```javascript
Class('BaseClass')(function(public){
	public.callMethod = function () {
		console.log("Hello!");
	};
});

Class('MyClass').extends('BaseClass')(function(public){
	public.callMethod = function () {
		console.log("Goodbye!");
		this.super.callMethod();
	};
});

(function(){
	var MyClass = get('MyClass');

	main(function(){
		var myClass = new MyClass();

		// "Goodbye!"
		// "Hello!"
		myClass.callMethod();
	});
})();
```

**super** as a means of (tentatively) passing arguments into superclass constructors:
```javascript
Class('BaseClass')(function(public){
	public.new = function (message) {
		console.log(message);
	};

	public.baseMethod = function () {
		// ...
	};
});

Class('MyClass').extends('BaseClass')(function(public){
	public.new = function () {
		this.super("Hi there!");

		// Trying to reference 'this.super.baseMethod' would fail here,
		// since supers are technically created immediately after 'new()'
		// finishes, albeit using any arguments passed in via 'this.super()'
	};
});
```

---

## III. Internals
The following includes patterns and utilities that aren't available as explicit API methods, but are instead constructs used in the library's design.

# Class Definer
A **Class Definer** function is used to extend base [classes](#class), implement an [interface](#interface), and define class members via its [builder](#builder) function argument.

### Usage
`Class('MyClass')(builder)`

### Arguments
`builder` (Function) : A function which defines the class members (see: [builder](#builder))

### Returns
No return value

### Description
The **Class Definer** function accepts a single [builder](#builder) function parameter to define the class members. The Class Definer is also equipped with two chainable method properties, [extends](#extends) and [implements](#implements), which allow it to specify base classes to inherit or an interface to implement, respectively.

### Example
See [Class > Example](#example) for an example of a Class Definer taking in a [builder](#builder) function. Seeing as `Class()` returns a Class Definer for immediate use, we can simply invoke it using the form `Class('MyClass')(...)`.

# extends
The **extends** property of a [Class Definer](#class-definer) function allows us to specify any number of base classes for a derived class to inherit from.

### Usage
```javascript
Class('MyClass').extends(baseClasses)(function(public){
	// ...
});
```

### Arguments
`baseClasses` (String) : One or multiple comma-separated base class names for a class to inherit

### Returns
`Class Definer` (Function) : The [Class Definer](#class-definer) function for chaining

### Description
**extends** provides a mechanism for class inheritance in a manner more characteristic of classical object-oriented programming, rather than the popular practice of extending a JavaScript object or a constructor function prototype with additional properties. The rules are as follows:

1. Public members of a directly-extended base class **are** accessible on instances of the derived class and inside its methods via `this`.
2. Protected members of a directly-extended base class **are not** accessible on instances of the derived class, but **are** accessible inside methods of the derived class via `this`.
3. Private members of a directly-extended base class **are not** accessible to either instances or methods of the derived class, though they do exist in memory.
4. Public static members of a directly-extended base class **are** accessible on a derived class constructor as well as on its instances and inside its methods via `this`. Changing the member value will propagate to the base class and its instances if applicable.
5. Public members of a non-direct ancestor class **are not** accessible on instances or inside methods of the derived class via `this`.
6. Public and protected members of a grandparent class **are** accessible inside methods of the derived class via `this.super` (single-extension) or `this.super.{superclassName}` (multiple-extension).
7. Final members cannot be overriden by derived classes - they will simply retain their final value.

### Example
```javascript
Class('ClassA')(function(public, private, protected){
	public.value = 15;
	public.message = "Hello.";
	protected.otherMessage = "Goodbye.";
	private.secret = "Good afternoon.";

	public.new = function (message) {
		console.log(message);
		console.log("Class A instantiated!");
	};

	public.final.baseMethod = function () {
		console.log("Don't you dare try and override me!");
	};

	public.replaceableMethod = function () {
		console.log("Feel free to change me to something else.");
	};
});

// Instances of ClassB will inherit from ClassA
Class('ClassB').extends('ClassA')(function(public){
	public.new = function () {
		// Passes arguments into the superclass instance
		this.super("Calling all ClassA instances!");
	};

	public.replaceableMethod = function () {
		console.log("This method overrides the base one!");
		// You can still reference direct-superclass variables
		// or methods, even when they are overriden
		this.super.replaceableMethod();
	};

	// Returns the inherited protected member
	public.getOtherMessage = function () {
		return this.otherMessage;
	};
});
```

# implements
The **implements** property of a [Class Definer](#class-definer) function allows us to specify an [interface](#interface) for a class to implement.

### Usage
```javascript
Class('MyClass').implements(interfaceName)(function(public){
	// ...
});
```

### Arguments
`interfaceName` (String) : The name of the interface

### Returns
`Class Definer` (Function) : The [Class Definer](#class-definer) function for chaining

### Description
**implements** provides a mechanism for a [class](#class) to implement an interface. However, unlike with traditional interface implementation, neither the interface itself nor its properties can be directly imported or accessed. Interfaces here only establish a "contract" which implementing classes must follow by overriding all variables and methods of the interface and making them **public** members. Functionality-wise, they have no real "use" but to enforce adoption of these members.

### Example
```javascript
Interface('IClassInterface')({
	value: null,
	method: function () {}
});

Class('ClassA').implements('IClassInterface')(function(public){
	public.value = 25;

	public.method = function () {
		console.log("Interface method implementation!");
	};
});
```

# Interface Definer
An **Interface Definer** function receives an object to define an [interface](#interface).

### Usage
`Interface('IClassInterface')(object)`

### Arguments
`object` (Object) : A list of variables and methods to include in the interface

### Returns
No return value

### Description
Unlike a [Class Definer](#class-definer), **Interface Definers** only accept a plain object containing the interface members. The member list is stored internally and used as a reference when verifying that any implementing classes publicly override the interface members.

### Example
```javascript
Interface('IClassInterface')({
	value1: null,
	value2: null,

	method1: function () {},
	method2: function (arg) {}
});
```

# builder
A class **builder** function defines the class members.

### Usage
```javascript
Class('MyClass')(function(public, private, protected){
	public.publicMember = function () {
		// ...
	};

	private.privateMember = function () {
		// ...
	};

	protected.protectedMember = function () {
		// ...
	};
});
```

### Arguments
Automatically receives three arguments:  
`public` (Object) : A receiver for public class members  
`private` (Object) : A receiver for private class members  
`protected` (Object) : A receiver for protected class members

### Returns
No return value

### Description
A class **builder** function serves to define its member structure. Using the three **access modifier** objects passed in, members can be selectively attached to these objects to define their level of accessibility. **Public** members are accessible both inside class members and on instances, **private** members are accessible via `this` only inside the methods of the class, and **protected** members are accessible via `this` inside the class methods or via `this` inside methods of a **directly** derived class. Each of these access modifier objects is equipped to allow declaration of members as **final** or **static** as well using the appropriate keyword chain. **Final** members cannot have their values changed or overriden by derived classes, and **static** members have a common value across all instances of a class. **Public static** members are attached to the class Constructor and can be referenced without explicit instantiation. For more specifics on the nature of access modifiers and inheritance, see [extends](#extends).

### Example
```javascript
Class('ExampleClass')(function(public, private, protected){
	private.string = "Hi there.";
	private.static.secret = "Secret...";
	public.value = "Hello!";
	public.final.finalValue = "You cannot change me!";
	public.static.number = 10;
	public.static.final.thing = "Wow!";

	public.new = function () {
		console.log("Example!");
	};

	public.setSecret = function () {
		this.secret = "New secret!";
	};

	private.internalMethod = function () {
		// ...
	};

	protected.callInternalMethod = function () {
		this.internalMethod();
	};
});
```