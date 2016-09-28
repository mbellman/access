# Access

## Index
[Introduction](#introduction)  
[Documentation](#documentation)  
[Examples](#examples)  
[> Index page](#index-page)  
[> Single-class application](#single-class-application)  
[> Multi-class application with inheritance](#multi-class-application-with-inheritance)  
[> Interfaces](#interfaces)  
[> Free Modules](#free-modules)  
[> Namespaces](#namespaces)  
[Motivation](#motivation)

## Introduction
This library provides an ECMAScript 5.1 implementation of certain features one would expect of any classical object-oriented language. Since JavaScript prior to ES6/ES2015/Harmony had no formal concept of classes, and since specification-compliant ES6 omits any explicit declaration of **public**, **private**, **protected**, **final**, or **static** members, **Interfaces**, **Abstract** or **Final** classes, and **namespaces**, the tools included therein provide some means of remedying these problems (if you view them as such).

## Documentation
[See: /docs](../master/docs)

# Examples

Please refer to the [documentation](#documentation) for specifics on library methods and behavior.

---

## Index page

This is the basic index page structure you need to run your program.

`index.html`
```html
<!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
		<script type="text/javascript" src="access.js"></script>
	</head>
	<body>
		<script src="main.js"></script>
	</body>
</html>
```

---

## Single-class application

Here is a basic program with a single class called **Application**.

`core/Application.js`
```javascript
Class('Application')(function(public){
	public.new = function () {
		console.log('Application created!');
	};

	public.init = function () {
		console.log('Starting application...');
	};
});
```

---

`main.js`
```javascript
(function(){
	var Application = include('Application').from('core/Application.js');

	main(function(){
		var app = new Application();

		app.init();
	});
})();
```

---

## Multi-class application with inheritance

Programs can be composed of multiple classes, some of which may extend others.

`js/Human.js`
```javascript
Class('Human')(function(public, private, protected){
	protected.age = 0;

	public.new = function (age) {
		this.age = age;
	};
});
```

---

`js/Person.js`
```javascript
include('Human.js');

Class('Person').extends('Human')(function(public, private){
	private.name = null;

	public.new = function (name, age) {
		this.name = name;
		this.super(age);
	};

	public.getName = function () {
		return this.name;
	};

	public.report = function () {
		console.log("My name is " + this.name + ", and I am " + this.age + " years old.");
	};
});
```

---

`js/Application.js`
```javascript
Class('Application')(function(public, private){
	private.people = null;

	public.new = function () {
		this.people = {};
	};

	public.addPerson = function (person) {
		var name = person.getName();
		this.people[name] = person;
	};

	public.getPerson = function (name) {
		return this.people[name];
	};
});
```

---

`main.js`
```javascript
(function(){
	// Set root folder path for include() calls
	root('js');

	var Application = include('Application').from('Application.js');
	var Person = include('Person').from('Person.js');

	main(function(){
		var app = new Application();

		app.addPerson(new Person("Bob", 35));
		app.addPerson(new Person("John", 32));

		var bob = app.getPerson("Bob");
		bob.report();   // "My name is Bob, and I am 35 years old."
	});
})();
```

---

## Interfaces

Interfaces function in a slightly more limited fashion than their counterparts in true object-oriented languages like Java or C#. They cannot be directly referenced, nor can their members. Defining an interface merely defines a list of either **variables** or **methods** which all implementing classes are required to incorporate publicly. Interface variables are denoted by **null** values and methods by **empty functions**. Interfaces only serve as a means of safeguarding implementing classes against omitting the interface members. They are purely a formality to be used at the discretion of the programmer. With that out of the way...

`IAnimal.js`
```javascript
Interface('IAnimal')({
	ecosystem: null,

	eat: function () {},
	talk: function () {}
});
```

---

`Cow.js`
```javascript
include('IAnimal.js');

Class('Cow').implements('IAnimal')(function(public){
	public.ecosystem = "Grassland";

	public.eat = function () {
		console.log("Cows eat grass.");
	};

	public.talk = function () {
		console.log("Moo!");
	};
});
```

---

`Fish.js`
```javascript
include('IAnimal.js');

Class('Fish').implements('IAnimal')(function(public){
	public.ecosystem = "Ocean";

	public.eat = function () {
		console.log("Fish eat aquatic organisms.");
	};

	public.talk = function () {
		console.log("Glub glub!");
	};
});
```

---

`Bird.js`
```javascript
include('IAnimal.js');

Class('Bird').implements('IAnimal')(function(public){
	public.ecosystem = "Highland";

	public.eat = function () {
		console.log("Birds eat worms.");
	};

	public.talk = function () {
		console.log("Chirp!");
	};
});
```

---

## Free Modules

It is also possible to define free functions and objects which can be imported in other files using `get()`.

`modules.js`
```javascript
module('sayHello', function () {
	console.log("Hello!");
});

module('sayGoodbye', function () {
	console.log("Goodbye!");
});

module('Data', {
	property: "123"
});
```

---

`main.js`
```javascript
(function(){
	include('modules.js');

	var sayHello = get('sayHello');
	var sayGoodbye = get('sayGoodbye');
	var Data = get('Data');

	main(function(){
		sayHello();
		sayGoodbye();

		console.log(Data.property);   // "123"
	});
})();
```

---

## Namespaces

Classes and free modules can be grouped into **namespaces** for categorization or easy access.

`js/mathutils.js`
```javascript
namespace('MathUtils');

module('square', function (n) {
	return n * n;
});

module('cube', function (n) {
	return n * n * n;
});
```

---

`js/Vector3.js`
```javascript
namespace('MathUtils');

Class('Vector3')(function(public){
	public.x = 0;
	public.y = 0;
	public.z = 0;

	public.new = function (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	};
});
```

---

`main.js`
```javascript
(function(){
	root('js');

	include('mathutils.js');
	include('Vector3.js');

	var MathUtils = use.namespace('MathUtils');

	main(function(){
		console.log(MathUtils.square(5));   // 25
		console.log(MathUtils.cube(5));     // 125

		var vec3 = new MathUtils.Vector3(0, 1, -1);

		console.log(vec3.x, vec3.y, vec3.z);   // 0 1 -1
	});
})();
```

---

# Motivation
[...?](http://gunshowcomic.com/comics/20120227-robotthatscreams.png)