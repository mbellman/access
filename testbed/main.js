(function(){
	var Cat = include('Cat').from('Application.js');
	var Animal = include('Animal').from('Application.js');

	main(function(){
		var cat = new Cat();

		console.log(Cat.color);

		Cat.color = "Green";

		var shiro = new Cat();
		console.log(shiro.color);

		var bat = new Animal();
		console.log(bat.color);

		Animal.color = "Black";

		shiro.revealColor();
	});
})();