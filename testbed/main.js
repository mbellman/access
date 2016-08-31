(function(){
	var Cat = include('Cat').from('Application.js');
	var Animal = include('Animal').from('Application.js');

	main(function(){
		var cat = new Cat("Kitty");

		cat.step();
		cat.step();
		cat.step();
		cat.step();

		cat.meow();

		var shiro = new Cat();
		shiro.meow();
	});
})();