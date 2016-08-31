(function(){
	Class('Cat').extends('Animal')(function(public, private){
		private.species = "Cat";
		public.age = 10;
		public.static.color = "White";

		public.talk = function () {
			console.log("Meow!");
		};

		public.walk = function () {
			this.super.walk();
		};

		public.revealColor = function () {
			console.log(this.color);
			console.log(this.super.color);
		};
	});

	Class('Animal')(function(public, private, protected){
		private.name = "Animal";
		private.species = null;
		public.static.color = "Brown";

		protected.walk = function () {
			console.log("Hello. I am a cat who is walking.");
		};

		public.static.eat = function () {
			console.log("Hello. I am an animal who is eating.");
		};
	});
})();