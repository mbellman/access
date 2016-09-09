# Access

## Index
[Introduction](#introduction)  
[Documentation](#documentation)  
[Examples](#examples)  
* [Index page](#index-page)  
* [Single-class application](#single-class-application)  
* [Multi-class application with inheritance](#multi-class-application-with-inheritance)  
* [Interfaces](#interfaces)  
[Motivation](#motivation)

## Introduction
Have you ever:
* Bemoaned the lack of traditional class definitions or classical object-oriented constructs in pre-ES6 JavaScript?
* Lamented JavaScript's omission of public, private, or protected member definitions?
* Found yourself lost in starry-eyed reverie about the good ol' days when ECMAScript 5 was all the rage?
* ...Or back when nobody used minification, obfuscation, or bundling to reduce HTTP request overhead and streamline page content delivery?
* Stood stubborn and proud against the imminent tide of functional programming sweeping the web development industry?
* Wished JavaScript was a completely different language altogether?
* Wanted to use a dumb, all-or-nothing asynchronous module loader with idiosyncratic, non-standard syntax?

---

This library provides an ECMAScript 5.1 implementation of certain features one would expect of any classical object-oriented language. Since JavaScript prior to ES6/ES2015/Harmony had no formal concept of classes, and since specification-compliant ES6 omits any explicit declaration of **public**, **private**, **protected**, **final**, or **static** members, **Interfaces**, **Abstract** or **Final** classes, and **namespaces**, the tools included therein provide some means of remedying these problems (if you view them as such).

## Documentation
[See: /docs](../blob/master/docs)

# Examples


## Index page

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


## Single-class application

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


## Multi-class application with inheritance

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

`js/Application.js`
```javascript
Class('Application')(function(public, private){
	private.people = {};

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

`js/Human.js`
```javascript
Class('Human')(function(public, private, protected){
	protected.age = 0;

	public.new = function (age) {
		this.age = age;
	};
});
```


## Interfaces

Interfaces here function in a slightly more limited fashion than their counterparts in true object-oriented languages like Java or C#. They cannot be directly referenced, nor can their members. Defining an interface merely defines a list of either **variables** or **methods** which all implementing classes are required to incorporate publicly. Variables are denoted by **null** values and methods by **empty functions**. Interfaces only serve as a means of safeguarding implementing classes against omitting the interface members. They are purely a formality to be used at the discretion of the programmer. With that out of the way...

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


# Motivation
[...](http://gunshowcomic.com/comics/20120227-robotthatscreams.png)