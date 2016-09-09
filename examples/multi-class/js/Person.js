include('Human.js');

Class('Person').extends('Human')(function(public, private){
	private.name = null;

	public.new = function (name, age) {
		this.name = name;
		this.super(age);
	};

	public.getName = function () {
		return this.name;
	};

	public.report = function () {
		console.log("My name is " + this.name + ", and I am " + this.age + " years old.");
	};
});