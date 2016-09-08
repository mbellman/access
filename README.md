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
To start, let's examine a basic program.

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