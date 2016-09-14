# Access : Documentation

# Global Methods
All global methods are deleted from `window` immediately prior to class generation.

## Class
**Class()** is used to create class definitions.

### Usage
`Class(name)`

### Arguments
`name` (String) : The name of the class

### Returns
A [definer](#definer) function.

### Description
This method creates an internal store of a class if one does not already exist under its name. It returns a [definer](#definer) function, which in turn can intake the class [builder](#builder) function or set the class extensions/implementation. A class [builder](#builder) function is used to define the class members, and gets executed only once per class just before application runtime.

### Example
The following delegates a class `ClassA` to be defined just before application runtime, defining its various `public` and `private` members in a [builder](#builder) function.

```javascript
Class('ClassB')(function(public, private){
	private.secretNumber = 10;
	public.notSecretString = "String.";

	public.new = function () {
		// Constructor method
	};

	public.getSecretNumber = function () {
		return this.secretNumber;
	};
});

---

# Internals
The following includes patterns and utilities that aren't available as methods to be called, but are instead constructs used in the library's design.

## definer
A **definer** function is returned by invoking [Class()](#class).

### Usage
`Class('MyClass')(builder);`

### Arguments
`builder` (Function) : A function which defines and qualifies the class members (see: [builder](#builder))

### Returns
No return value

### Description
The **definer** function accepts one parameter, the class [builder](#builder) function, which defines the class members. The definer is also equipped with two properties, [extends](#extends) and [implements](#implements), which allow it to specify for a class multiple base classes or a single interface, respectively.

### Example
See [Class](#class) > Example

## extends
The **extends** property of the [definer](#definer) function allows one to specify any number of base classes for a derived class to inherit from.

### Usage
```javascript
Class('MyClass').extends(baseClasses)(function(public){
	// ...
});
```

### Arguments
`baseClasses` (String) : A string of one or multiple comma-separated base class names for a new class to extend

### Returns
The [definer](#definer) function for chaining.

### Description
**extends** provides a mechanism for class inheritance in a manner more characteristic of classical object-oriented programming, rather than that of the popular practice of extending a JavaScript object or a constructor function prototype with additional properties. The rules are as follows:

1. Public members of a directly-extended base class **are** accessible on instances of the derived class and inside its methods via `this`.
2. Protected members of a directly-extended base class **ar**e accessible inside methods of the derived class via `this`.
3. Private members of a directly-extended base class **are not** accessible to either instances or methods of the derived class, though they do exist in memory.
4. Public and protected members of a directly-extended base class **are** accessible inside methods of the derived class via `this.super` (single-extension) or `this.super.{superclassName}` (multi-extension).
5. Public static members of a directly-extended base class **are** accessible on a derived class constructor as well as on its instances/inside its methods via `this`. Changing the member value will propagate to the base class and its instances if applicable.
6. Public members of a non-direct ancestor class **are not** accessible on instances or inside methods of the derived class via `this`.
7. Public members of a grandparent class **are** accessible inside instances of the derived class via `this.super` (single-extension) or `this.super.{superclassName}` (multiple-extension).