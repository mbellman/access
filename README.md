# Access

## Index
[???](#have-you-ever)  
[Summary](#summary)  
[Beginner's Example](#yeah-okay-i-dont-care)  
[How it Works](#how-it-works-in-short)  

### Have you ever:
* Bemoaned the lack of traditional class definitions or classical object-oriented constructs in pre-ES6 JavaScript?
* Lamented JavaScript's omission of public, private, or protected member definitions?
* Found yourself lost in starry-eyed reverie about the good ol' days when ECMAScript 5 was all the rage?
* ...And nobody used minification, obfuscation, or bundling to reduce HTTP request overhead and streamline page content delivery?
* Stood stubborn and proud against the imminent tide of functional programming sweeping the web development industry?
* Wished JavaScript was a completely different language altogether?
* Wanted to use a dumb, all-or-nothing asynchronous module loader with idiosyncratic, non-standard syntax?

### Summary
This library provides an ECMAScript 5.1 implementation of some of the rudimentary features one would expect of any classical object-oriented language. Since JavaScript prior to ES6/ES2015/Harmony had no formal concept of classes, and since specification-compliant ES6 omits any explicit declaration of **public**, **private**, **protected**, **final**, and **static** members, **Interfaces**, **Abstract** and **Final** classes, or **namespaces**, the tools included therein provide some means of remedying these problems. (Are they even problems?)

## Yeah okay I don't care
Let's start with a basic example.

---

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
	// Constructor method "new()"
	public.new = function () {
		console.log('Application created!');
	};

	public.init = function () {
		console.log('Starting application...');
	};
});
```

---

As you can see, `main.js` is the only non-library script which needs to be manually loaded.

The `main.js` script is wrapped in a self-invoking anonymous function for scope protection. We simply include a class from a file, designate a main entry point for the program, and kick back until `core/Application.js` has loaded and run.

In `core/Application.js`, we define the **Application** class by name. `Class` is a global library method which takes a class name and returns a function which accepts one argument: another function. For the sake of clarity, we'll call the second function a **builder** function.

The **builder** function is not a constructor; it is run only once when the class is first **generated**. To back up a little, no classes are generated until the entire script dependency tree has been resolved. If an included script in turn includes more scripts, the wait continues until no further scripts are pending.

### How it works (in short)
A class **builder** receives three *object* arguments: `public`, `private`, and `protected`. When passed into the **builder**, each can be freely appended with additional properties corresponding to class members (variables or methods). Once the **builder** finishes, each object is internally copied into another object called a **member table** which represents the whole lineup of class members.

The actual class constructor function, which is retrieved in our example via:

`var Application = include("Application").from("core/Application.js")`

creates a new **instance** object from the stored class member lineup. However, what the constructor exposes is not the **instance**, but a restricted subset of the **instance** corresponding only to the public class members.

To achieve this, a special **proxy** property is attached to the **instance** object. Then, the public class members are attached to the **proxy** property. Only the **proxy** property, rather than the **instance** itself, is returned by the constructor. All of the public members attached to the **proxy** property are then context-bound back to the original **instance**. In this manner any class method can refer to other methods and variables - public, private, or protected - using `this`. Variables referenced and methods called on the public **proxy** all point back to the base **instance**, preserving state singularity.