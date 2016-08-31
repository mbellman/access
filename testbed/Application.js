(function(){
	Class('Cat').extends('Animal')(function(public, private){
		private.new = function (species) {
			this.species = species;
		};

		public.step = function () {
			this.steps++;
		};

		public.meow = function () {
			console.log("I have taken " + this.steps + " steps");
		};
	});

	Class('Animal')(function(public, private, protected){
		public.static.species = null;
		protected.steps = 1;
	});
})();