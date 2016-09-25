ACCESS_BUNDLE_MODE = true;

(function(){
	root('js');

	var Application = include('Application').from('Application.js');

	main(function(){
		var app = new Application();

		app.start();
	});
})();
(function(){
	var User = include('User').from('User.js');

	Class('Application')(function(public, private){
		private.user = null;

		public.new = function () {
			console.log('Starting...');

			this.user = new User("Test");
		};

		public.start = function () {
			console.log('Started!');

			this.user.sayHello();
		};
	});
})();
Class('User')(function(public){
	public.name = null;

	public.new = function (name) {
		this.name = name;
	};

	public.sayHello = function () {
		console.log("Hello, my name is " + this.name + "!");
	};
});