(function(){
	Class('Cat').extends('Animal')(function(public, private){
		private.species = "Cat";
		public.age = 10;

		public.talk = function () {
			console.log("Meow!");
		};

		public.walk = function () {
			this.super.walk();
		};
	});

	Class('Animal')(function(public, private, protected){
		private.name = "Animal";
		private.species = null;
		public.age = null;

		protected.walk = function () {
			console.log("Hello. I am a cat who is walking.");
		};
	});
})();