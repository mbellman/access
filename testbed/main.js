(function(){
	var ClassTest = include('ClassTest').from('Application.js');
	var BaseClass = include('BaseClass').from('Application.js');

	main(function(){
		var classTest = new ClassTest();

		classTest.sayWhat();
	});
})();