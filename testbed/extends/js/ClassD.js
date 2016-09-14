include('ClassC.js');

Class('ClassD').extends('ClassC')(function(public){
	public.dCustomValue = "Class D value";

	public.new = function () {
		this.super("Class D calling Class C");
	};
});