(function(){
	namespace('App');

	Interface('Feline')({
		color: null,

		meow: function () {},
		purr: function () {}
	});

	Class('Cat').extends('Animal').implements('Feline')(function(public, private){
		private.family = "Felidae";
		public.name = null;
		public.color = 'Red';

		public.new = function (name) {
			this.super.increaseCount();
			this.name = name;
		};

		public.purr = function () {
			console.log("I am a cat who is purring.");
		};

		public.step = function () {
			this.steps++;
		};

		public.meow = function () {
			console.log("I am a cat named " + this.name + "! I have taken " + this.steps + " steps!");
		};

		public.getType = function () {
			console.log(this.kingdom, this.family);
		};
	});

	Class('Animal').extends('Organism')(function(public, private, protected){
		protected.kingdom = "Animalia";
		protected.steps = 1;

		public.new = function () {
			console.log('Animal!');
		};

		public.breathe = function () {
			this.super.breathe();
		};

		protected.increaseCount = function () {
			this.count++;
		};
	});

	Class('Organism')(function(public, private, protected){
		protected.kingdom = null;
		protected.static.count = 0;

		public.new = function () {
			console.log('Organism!');
		};

		protected.breathe = function () {
			console.log("Breathe in, breathe out.");
		};

		public.static.getCount = function () {
			console.log("There are " + this.count + " organisms!");
		};
	});

	define('SayHello', function () {
		console.log('Hello!');
	});

	define('FreeObject', {
		value: 10
	});
})();