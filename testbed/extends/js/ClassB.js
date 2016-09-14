include('ClassA.js');

Class('ClassB').extends('ClassA')(function(public){
	public.new = function (message) {
		console.log(message);
		this.super("Class B calling class A");
	};
});