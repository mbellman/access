(function(){
	var Application = include('Application').from('Application.js');

	main(function(){
		var application = new Application();

		application.setNumber(18, 5);
		application.reveal();
	});
})();