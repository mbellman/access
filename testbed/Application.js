(function(){
	Class('ClassTest').extends('BaseClass').implements('BaseInterface')(function(public, private){
		public.static.object = {
			here: "is some data",
			this: "is some more data",
			and: {
				this: "is even more data!"
			}
		};

		public.superMethod = function () {
			this.super.method();
		};

		public.method = function () {
			console.log('Hello');
		};
	});

	Class('BaseClass')(function(public){
		public.value = 'A string.';

		public.method = function () {
			console.log('A method.');
		};
	});

	Interface('BaseInterface')(function(public){
		public.action = function () {
			console.log('An interface method.');
		};
	});
})();