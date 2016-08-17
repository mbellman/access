(function(){
	Class('Application')(function(public, private){
		private.secret = function () {
			console.log('Shhh...');
		};

		public.start = function () {
			private.secret();
			console.log('Started...');
		};

		public.stop = function () {
			console.log('Stopped...');
		};
	});
})();