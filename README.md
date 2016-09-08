# Access
### ???
Have you ever:
* Bemoaned the lack of traditional class definitions or classical object-oriented constructs in pre-ES6 JavaScript?
* Lamented JavaScript's omission of public, private, or protected member definitions?
* Found yourself lost in starry-eyed reverie about the good ol' days when ECMAScript 5.1 was all the rage?
  * ...And nobody used minification, obfuscation, or bundling to reduce HTTP request overhead and streamline page content delivery?
* Stood stubborn and proud against the imminent tide of functional programming sweeping the web development industry?
* Wished JavaScript was a completely different language altogether?
* Wanted to use a dumb, all-or-nothing asynchronous module loader with idiosyncratic, non-standard syntax?

### Introduction
This library provides an ECMAScript 5.1 implementation of some of the rudimentary features one would expect of any classical object-oriented language. Since JavaScript prior to ES6/ES2015/Harmony had no formal concept of classes, and since specification-compliant ES6 omits any explicit declaration of **public**, **private**, **protected**, **final**, or **static** members, **Interfaces**, **Abstract** or **Final** classes, and **namespaces**, the tools included therein provide some means of remedying these problems. (Are they even problems?)

## Yeah okay I don't care
The following is a simple example program, divided into two files:

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
	// Constructor method
	public.new = function () {
		console.log('Application created!');
	};

	public.init = function () {
		console.log('Starting application...');
	};
});
```

Aside from the library itself, the first file, `main.js`, is the only script which needs to be loaded onto the page (ideally at the bottom of the document body). The script is wrapped in a self-invoking anonymous function for scope protection. We simply include a class from a file, designate a main entry point for the program, and kick back until `core/Application.js` has loaded and run.

In `core/Application.js`, we define the **Application** class by name. `Class` is a global library method which takes a class name and returns a function which accepts one argument: another function. For the sake of clarity, we'll call the second one the class **builder** function.

The **builder** function is not a constructor; it is run only once, and only when we say we're ready. All classes are tentatively "ready" for definition once the chain of script includes stemming from the first `main.js` file have been resolved.