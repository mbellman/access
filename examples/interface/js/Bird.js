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