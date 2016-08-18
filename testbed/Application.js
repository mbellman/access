(function(){
	Class('Application')(function(public, private){
		private.number = 0;
		public.value = 10;

		public.reveal = function () {
			console.log(this.number, this.value);
		};

		public.setNumber = function(num, val) {
			this.number = num;
			this.value = val;
		};
	});
})();