# Access : Documentation

[Global Methods](#i-global-methods)  
[> Class](#class)  
[Internals](#ii-internals)  
[> definer](#definer)  
[> extends](#extends)

## I. Global Methods
All global methods are deleted from `window` immediately prior to class generation.

# Class()
**Class()** is used to create class definitions.

### Usage
`Class(name)`

### Arguments
`name` (String) : The name of the class

### Returns
`definer` (Function) : A class [definer](#definer)

### Description
This method creates an internal store of a class if one does not already exist under its name. It returns a [definer](#definer) function, which in turn can intake the class [builder](#builder) function or set the class extensions/implementation. A class [builder](#builder) function is used to define the class members, and gets executed only once per class just before application runtime.

### Example
In principle, the following defines a class `ClassA`. In practice, it delegates the class to be generated internally just before application runtime, preparing its various `public` and `private` members to be defined upon execution of the class [builder](#builder) function. Prior to class generation, the class cannot be instantiated.

```javascript
Class('ClassA')(function(public, private){
	private.secretNumber = 10;
	public.nonSecretString = "String";

	public.new = function () {
		// Constructor method
	};

	public.getSecretNumber = function () {
		return this.secretNumber;
	};
});
```

---

## II. Internals
The following includes patterns and utilities that aren't available as explicit API methods, but are instead constructs used in the library's design.

# definer
A class **definer** function is used to extend base classes, implement an interface, and define class members via its [builder](#builder) function argument.

### Usage
`Class('MyClass')(builder);`

### Arguments
`builder` (Function) : A function which defines the class members (see: [builder](#builder))

### Returns
No return value

### Description
The **definer** function accepts a single [builder](#builder) function parameter to defines the class members. The definer is also equipped with two chainable method properties, [extends](#extends) and [implements](#implements), which allow it to specify base classes or an interface, respectively.

### Example
See [Class > Example](#example) for an example of a class definer taking in a [builder](#builder) function. Seeing as `Class()` returns a definer for immediate use, we can simply invoke it using the form `Class('MyClass')(...)`.

# extends
The **extends** property of a [definer](#definer) function allows us to specify any number of base classes for a derived class to inherit from.

### Usage
```javascript
Class('MyClass').extends(baseClasses)(function(public){
	// ...
});
```

### Arguments
`baseClasses` (String) : One or multiple comma-separated base class names for a class to extend

### Returns
`definer` (Function) : The [definer](#definer) function for chaining

### Description
**extends** provides a mechanism for class inheritance in a manner more characteristic of classical object-oriented programming, rather than the popular practice of extending a JavaScript object or a constructor function prototype with additional properties. The rules are as follows:

1. Public members of a directly-extended base class **are** accessible on instances of the derived class and inside its methods via `this`.
2. Protected members of a directly-extended base class **are** accessible inside methods of the derived class via `this`.
3. Private members of a directly-extended base class **are not** accessible to either instances or methods of the derived class, though they do exist in memory.
4. Public and protected members of a directly-extended base class **are** accessible inside methods of the derived class via `this.super` (single-extension) or `this.super.{superclassName}` (multi-extension).
5. Public static members of a directly-extended base class **are** accessible on a derived class constructor as well as on its instances/inside its methods via `this`. Changing the member value will propagate to the base class and its instances if applicable.
6. Public members of a non-direct ancestor class **are not** accessible on instances or inside methods of the derived class via `this`.
7. Public members of a grandparent class **are** accessible inside instances of the derived class via `this.super` (single-extension) or `this.super.{superclassName}` (multiple-extension).

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
The **implements** property of a [definer](#definer) function allows us to specify an [interface](#interface) for a class to implement.

### Usage
```javascript
Class('MyClass').implements(interfaceName)(function(public){
	// ...
});
```

### Arguments
`interfaceName` (String) : The name of the interface

### Returns
`definer` (Function) : The [definer](#definer) function for chaining

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