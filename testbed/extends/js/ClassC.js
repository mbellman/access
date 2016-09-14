include('ClassB.js');

Class('ClassC').extends('ClassB')(function(public){
	public.new = function (message) {
		console.log(message);
		this.super("Class C calling class B");
	};
});