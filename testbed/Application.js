(function(){
	Class('ClassTest').extends('BaseClass')(function(public, private){
		public.hey = "Hello";

		public.method = function () {
			console.log(this.hey);
			this.super.method();
		};

		public.sayHello = function () {
			console.log(this.super.sup);
		};
	});

	Class('BaseClass')(function(public, private, protected){
		protected.value = 10;
		public.bye = "See ya!";
		protected.sup = "What's up man";

		protected.method = function () {
			console.log(this.value);
		};
	});
})();