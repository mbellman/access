include('IAnimal.js');

Class('Fish').implements('IAnimal')(function(public){
	public.ecosystem = "Ocean";

	public.eat = function () {
		console.log("Fish eat aquatic organisms.");
	};

	public.talk = function () {
		console.log("Glub glub!");
	};
});