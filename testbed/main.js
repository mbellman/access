(function(){
	var Cat = include('Cat').from('Application.js');
	var Animal = include('Animal').from('Application.js');
	var Organism = include('Organism').from('Application.js');

	main(function(){
		var cat = new Cat("Kitty");
		var shiro = new Cat();
		var chyatora = new Cat();

		shiro.step();
		shiro.step();
		shiro.step();
		shiro.meow();
		chyatora.meow();

		shiro.getType();
	});
})();