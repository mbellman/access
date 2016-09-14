include('ClassB.js');

Class('ClassC').extends('ClassB')(function(public){
	public.aFinal = "Second-level final message override attempt";

	public.new = function (message) {
		console.log(message);
		this.super("Class C calling class B");
	};
});