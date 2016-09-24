# Access : Documentation

[Global Methods](#i-global-methods)  
[> Class](#class)  
[> Interface](#interface)  
[> module](#module)  
[> root](#root)  
[> namespace](#namespace)  
[> use.namespace](#usenamespace)  
[> include](#include)  
[> get](#get)  
[> main](#main)  
[Internals](#ii-internals)  
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

# Interface
An **Interface** defines a collection of variables and methods which must be publicly defined by implementing classes.

### Usage
`Interface(name)`

### Arguments
`name` (String) : The name of the interface

### Returns
`Interface Definer` (Function) : An [Interface Definer](#interface-definer)

### Description
Interfaces are distinct from [Classes](#class) in that they cannot be instantiated, obtained via [get()](#get) or [include()](#include), or otherwise referenced directly within your application's code. They can however be [implemented](#implements) by classes, which essentially just runs a validation check during class generation ensuring that any implementing class publicly overrides the Interface members with a custom implementation. Note, however, that by specifying arguments for an interface method, we can require class implementations of that method to use the same number of arguments. Meanwhile, interface variables must be defined as null to indicate their status as such.

For more information, see [the main readme entry on interfaces](../master#interfaces).

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
	this.broth = null;
	this.additions = [];
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
**module()** defines "free" functions or objects to be included in other files.

### Usage
`module(name, export)`

### Arguments
`name` (String) : A name identifier for the module
`export` (Function | Object) : A function or object representing the content of the module

### Returns
No return value

### Description
Certain routines or objects not bound to any particular class can be defined in isolation using the **module()** method. They can then be [included](#include) or [gotten](#get) in other script files for use.

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
A **namespace** provides a common grouping of related classes or modules. [Interfaces](#interface) remain unaffected by namespacing.

### Usage
`namespace(name)`

### Arguments
`name` (String) : The namespace identifier

### Returns
No return value

### Description
Calling **namespace()** at a particular point in a script file will cause all following [classes](#class) or [modules](#module) inside the file to fall under the specified namespace. **Namespaces** are used to associated related classes or modules, either for clarity, organization, or as a formality. Namespaced classes and modules can still be [included](#include) or [gotten](#get) directly, but by invoking [use.namespace()](#usenamespace) they can all be obtained as a group.

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
When [included](#include) script files use [namespacing](#namespace) to categorize classes or modules, these classes/modules are added to an internal namespace object. **use.namespace()** retrieves this object and all of its contained classes/modules.

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
		this.user = null;

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
**get()** merely retrieves a class or module with the assumption that the containing script has already been included.

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
Because of the asynchronous nature of script [includes](#include) and [class](#class) generation, it is "unsafe" to attempt to instantiate any classes or call any free [module](#module) methods before scripts and classes/modules are resolved. **main()** allows for the definition of one application entry point function to be called once the application is ready to be run. Any class instantiation or free module references should occur either within **main()** or following the sequence of events kicked off within **main()**.

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

---

## II. Internals
The following includes patterns and utilities that aren't available as explicit API methods, but are instead constructs used in the library's design.

# Class Definer
A **Class Definer** function is used to extend base classes, implement an interface, and define class members via its [builder](#builder) function argument.

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
**implements** provides a mechanism for a class to implement an [interface](#interface). However, unlike with traditional interface implementation, neither the interface itself nor its properties can be directly imported or accessed. Interfaces here only establish a "contract" which implementing classes must follow by overriding all variables and methods of the interface and making them **public** members. Functionality-wise, they have no real "use" but to enforce adoption of these members.

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
An **Interface Definer** function receives an object to define an interface.

### Usage
`Interface('IClassInterface')(object)`

### Arguments
`object` (Object) : A list of variables and methods to require in implementing classes

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