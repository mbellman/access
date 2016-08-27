(function(){
	var ClassTest = include('ClassTest').from('Application.js');

	main(function(){
		var classTest = new ClassTest();

		classTest.method();
	});
})();