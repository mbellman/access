(function(){
	Class('ClassTest')(function(public, private){
		private.attribute = 10;
		private.static.message = "Hello";

		public.report = function () {
			console.log(this.message);
		};

		public.setMessage = function(message) {
			this.message = message;
		};

		public.static.reportMessage = function() {
			console.log(this.message);
		};
	});
})();