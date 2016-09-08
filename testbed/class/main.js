(function(){
	root('js');

	var TestClass = include('TestClass').from('TestClass.js');

	main(function(){
		describe('Single-class example', function () {
			describe('Class instantiation', function () {
				it('Should create an instance of the class', function () {
					var testClass = new TestClass();

					assert(testClass.is('TestClass'));
				});
			});

			describe('Public and private members', function () {
				it('Should restrict member access', function () {
					var testClass = new TestClass();

					assert(that(testClass.word).equals("Hello"));
					assert(that(testClass.getPrivateSecret()).equals("Secret message!"));
					assert(that(testClass.getNumber()).equals(10));

					assert(that(testClass.number).is.undefined);
					assert(that(testClass.getSecret).is.undefined);
				});
			});

			describe('Static members', function () {
				it('Should share the value across instances', function () {
					var testClass = new TestClass();
					var secondTestClass = new TestClass();

					assert(that(testClass.string).equals("Static message"));
					assert(that(secondTestClass.string).equals("Static message"));
					TestClass.string = "New message!";
					assert(that(testClass.string).equals("New message!"));
					assert(that(secondTestClass.string).equals("New message!"));
				});
			});
		});
	});
})();