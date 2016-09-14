Class('ClassA')(function(public, protected, private){
	private.aPrivate = "Class A secret message";
	protected.aProtected = "Class A protected message";
	public.aPublic = "Class A public message";
	public.final.aFinal = "Class A final message";

	public.new = function (message) {
		console.log(message);
	};

	public.aPublicMethod = function () {
		console.log("Class A public method");
	};

	protected.aProtectedMethod = function () {
		console.log("Class A protected method");
	};

	private.aPrivateMethod = function () {
		console.log("Class A private method");
	};
});