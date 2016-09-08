Class('TestClass')(function(public, private){
	private.number = 10;
	public.word = "Hello";
	public.name = null;
	public.final.value = 15;
	public.static.string = "Static message";
	private.static.sharedSecret = "Private static secret";
	public.static.final.constant = "Static final message";

	public.new = function (name) {
		this.name = name;
	};

	private.getSecret = function () {
		return "Secret message!";
	};

	public.static.getString = function () {
		return this.string;
	};

	public.static.setConstant = function (string) {
		this.constant = string;
	};

	public.getNumber = function () {
		return this.number;
	};

	public.setNumber = function (number) {
		this.number = number;
	};

	public.getPrivateSecret = function () {
		return this.getSecret();
	};

	public.setSharedSecret = function (string) {
		this.sharedSecret = string;
	};

	public.getSharedSecret = function () {
		return this.sharedSecret;
	};
});