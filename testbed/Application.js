(function(){
	Class('ClassTest').extends('BaseClass')(function(public, private){
		public.value = 20;

		public.method = function () {
			console.log(this.value);
			this.super.method();
		};

		public.sayWhat = function () {
			console.log('Nothing');
			this.super.sayWhat();
		};
	});

	Class('BaseClass')(function(public, private, protected){
		private.number = 5;
		protected.final.value = 10;

		protected.method = function () {
			console.log(this.number);
		};

		public.sayWhat = function () {
			console.log(this.number);
		};
	});
})();