(function(){
	include('Application.js');

	var App = use.namespace('App');
	var FreeObject = include('FreeObject').from('Application.js');

	main(function(){
		var cat = new App.Cat("Kitty");
		var shiro = new App.Cat("Shiro");
		var chyatora = new App.Cat("Chyatora");

		shiro.step();
		shiro.step();
		shiro.step();
		shiro.meow();
		shiro.purr();
		chyatora.meow();

		shiro.getType();

		console.log(shiro.name);

		App.Organism.getCount();

		App.SayHello();

		console.log(FreeObject.value);
	});
})();