(function(){
	Class('ClassTest').extends('BaseClass')(function(public, private, protected){
		public.value = 20;

		public.method = function () {
			console.log('Derived: ' + this.value);
			this.super.method();
		};

		public.sayWhat = function () {
			console.log(this.value);
			this.method();
		};
	});

	Class('BaseClass')(function(public, private, protected){
		private.number = 5;
		protected.value = 10;

		protected.method = function () {
			console.log('Base: ' + this.number);
		};

		public.sayWhat = function () {
			console.log(this.number);
		};
	});
})();