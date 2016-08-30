(function(){
	var Cat = include('Cat').from('Application.js');
	var Animal = include('Animal').from('Application.js');

	main(function(){
		var cat = new Cat();

		cat.talk();
		cat.walk();
	});
})();