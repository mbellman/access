(function(){
	Class('Cat').extends('Animal')(function(public, private, protected){
		protected.family = "Felidae";

		private.new = function () {
			this.super.increaseCount();
		};

		public.step = function () {
			this.steps++;
		};

		public.meow = function () {
			console.log("I am a cat! I have taken " + this.steps + " steps!");
		};

		public.getType = function () {
			console.log(this.kingdom, this.family);
		};
	});

	Class('Animal').extends('Organism')(function(public, private, protected){
		protected.kingdom = "Animalia";
		protected.steps = 1;

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

		protected.breathe = function () {
			console.log("Breathe in, breathe out.");
		};

		public.static.getCount = function () {
			console.log("There are " + this.count + " organisms!");
		};
	});
})();