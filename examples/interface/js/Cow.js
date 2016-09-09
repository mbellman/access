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