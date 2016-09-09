(function(){
	// Set root folder for include() calls
	root('js');

	var Application = include('Application').from('Application.js');
	var Person = include('Person').from('Person.js');

	main(function(){
		var app = new Application();

		app.addPerson(new Person("Bob", 35));
		app.addPerson(new Person("John", 32));

		var bob = app.getPerson("Bob");
		bob.report();   // "My name is Bob, and I am 35 years old."
	});
})();