(function(){
	root('js');

	var TestClass = include('TestClass').from('TestClass.js');

	main(function(){
		var testClass = new TestClass();
		var testClass2 = new TestClass();

		/**
		 * Public and private members
		 */
		console.log(testClass.word);                   // "Hello"
		console.log(testClass.number);                 // undefined

		/**
		 * Final member
		 */
		console.log(testClass.value);                  // 15

		try {
			testClass.value = 1;
		} catch (e) {
			console.log(e.toString());                 // Read-only error
		}

		console.log(testClass.value);                  // 15

		/**
		 * Static member
		 */
		console.log(TestClass.string);                 // "Static message"
		console.log(TestClass.getString());            // "Static message"
		TestClass.string = "Changed message";
		console.log(testClass.string);                 // "Changed message"
		console.log(testClass2.string);                // "Changed message"

		/**
		 * Private static member
		 */
		console.log(TestClass.sharedSecret);           // undefined
		testClass.setSharedSecret("Changed secret");
		console.log(testClass2.getSharedSecret());     // "Changed secret"

		/**
		 * Final static member
		 */
		console.log(TestClass.constant);               // "Static final message"
		TestClass.setConstant("Changed message");
		console.log(TestClass.constant);               // "Static final message"

		/**
		 * Private member getter/setter
		 */
		console.log(testClass.getNumber());            // 10
		testClass.setNumber(20);
		console.log(testClass.getNumber());            // 20

		/**
		 * Private method
		 */
		try {
			testClass.getSecret();
		} catch (e) {
			console.log(e.toString());                 // "TypeError: testClass.getSecret is not a function"
		}

		/**
		 * Public alias for a private method
		 */
		console.log(testClass.getPrivateSecret());     // "Secret message!"
	});
})();