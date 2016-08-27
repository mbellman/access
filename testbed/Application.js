(function(){
	Class('ClassTest').extends('BaseClass')(function(public, private){
		private.final.hey = "Hello!";

		public.method = function () {
			console.log(this.hey);
		};

		public.setHey = function (v) {
			this.hey = v;
		};
	});

	Class('BaseClass')(function(public){
		public.bye = "See ya!";
	});
})();