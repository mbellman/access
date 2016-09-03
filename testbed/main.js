(function(){
	var Cat = include('Cat').from('Application.js');
	var Animal = include('Animal').from('Application.js');
	var Organism = include('Organism').from('Application.js');

	main(function(){
		var cat = new Cat("Kitty");
		var shiro = new Cat("Shiro");
		var chyatora = new Cat("Chyatora");

		shiro.step();
		shiro.step();
		shiro.step();
		shiro.meow();
		shiro.purr();
		chyatora.meow();

		shiro.getType();

		console.log(shiro.name);

		Organism.getCount();
	});
})();