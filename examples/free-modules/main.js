(function(){
	include('modules.js');

	var sayHello = get('sayHello');
	var sayGoodbye = get('sayGoodbye');
	var Data = get('Data');

	main(function(){
		sayHello();
		sayGoodbye();

		console.log(Data.property);   // "123"
	});
})();