(function(){
	var TestClass = include('TestClass').from('TestClass.js');

	main(function(){
		describe('Single-class example', function () {
			describe('Class instantiation', function () {
				it('Should create an instance of the class', function () {
					var testClass = new TestClass();

					assert(testClass.is('TestClass'));
				});
			});

			describe('Class new() initializer', function () {
				it('Should accept arguments from the constructor', function () {
					var testClass = new TestClass("Malcolm");
					var secondTestClass = new TestClass();

					assert(that(testClass.name).equals("Malcolm"));
					assert(that(secondTestClass.name).is.undefined);
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

			describe('Non-static members', function () {
				it('Should be particular only to their instance', function () {
					var testClass = new TestClass();
					var secondTestClass = new TestClass();

					assert(that(testClass.word).equals("Hello"));
					assert(that(secondTestClass.word).equals("Hello"));

					testClass.word = "Goodbye";

					assert(that(testClass.word).equals("Goodbye"));
					assert(that(secondTestClass.word).equals("Hello"));
				});
			});

			describe('Static members', function () {
				it('Should share values across instances', function () {
					var testClass = new TestClass();
					var secondTestClass = new TestClass();

					var oldMessage = "Static message";
					var newMessage = "New message!";

					assert(that(testClass.string).equals(oldMessage));
					assert(that(secondTestClass.string).equals(oldMessage));

					TestClass.string = newMessage;

					assert(that(testClass.string).equals(newMessage));
					assert(that(secondTestClass.string).equals(newMessage));

					var newTestClass = new TestClass();

					assert(that(newTestClass.string).equals(newMessage));
				});

				it('Should share private static values across instances', function () {
					var testClass = new TestClass();
					var secondTestClass = new TestClass();

					var oldSecret = "Private static secret";
					var newSecret = "New secret!";

					assert(that(testClass.getSharedSecret()).equals(oldSecret));
					assert(that(secondTestClass.getSharedSecret()).equals(oldSecret));

					testClass.setSharedSecret(newSecret);

					assert(that(testClass.getSharedSecret()).equals(newSecret));
					assert(that(secondTestClass.getSharedSecret()).equals(newSecret));

					var newTestClass = new TestClass();

					assert(that(newTestClass.getSharedSecret()).equals(newSecret));
				});
			});

			describe('Final members', function () {
				it('Should be immutable', function () {
					var testClass = new TestClass();

					assert(that(testClass.value).equals(15));

					try {
						testClass.value = 20;
					} catch (e) {}

					assert(that(testClass.value).equals(15));
				});
			});

			describe('Public final static members', function () {
				it('Should exist as an immutable property of both the constructor and instance', function () {
					var testClass = new TestClass();

					var constant = "Static final message";

					assert(that(TestClass.constant).equals(constant));
					assert(that(testClass.constant).equals(constant));

					try {
						TestClass.constant = "Mutable!";
					} catch (e) {}

					try {
						testClass.constant = "Mutable...again!";
					} catch (e) {}

					assert(that(TestClass.constant).equals(constant));
					assert(that(testClass.constant).equals(constant));
				});
			});
		});
	});
})();