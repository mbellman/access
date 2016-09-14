(function(){
	root('js');

	var ClassA = include('ClassA').from('ClassA.js');
	var ClassB = include('ClassB').from('ClassB.js');
	var ClassC = include('ClassC').from('ClassC.js');
	var ClassD = include('ClassD').from('ClassD.js');

	main(function(){
		describe('Class inheritance', function () {
			describe('Level-one inheritance', function () {
				it('Should set public base class members on a derived class instance', function () {
					var classB = new ClassB();

					assert(that(classB.aPublic).equals("Class A public message"));
					assert(that(classB.aPublicMethod).is.a.function);
				});
			});

			describe('Level-two inheritance', function () {
				it('Should ensure that final members of base classes are not overriden by any descendant classes', function () {
					var classC = new ClassC();

					assert(that(classC.aFinal).equals("Class A final message"));
				});
			});
		});
	});
})();