(function(){
	root('js');

	var Cow = include('Cow').from('Cow.js');
	var Fish = include('Fish').from('Fish.js');
	var Bird = include('Bird').from('Bird.js');

	main(function(){
		var cow = new Cow();
		var fish = new Fish();
		var bird = new Bird();

		console.log(cow.ecosystem);
		console.log(fish.ecosystem);
		console.log(bird.ecosystem);

		cow.eat();
		fish.eat();
		bird.eat();

		cow.talk();
		fish.talk();
		bird.talk();
	});
})();