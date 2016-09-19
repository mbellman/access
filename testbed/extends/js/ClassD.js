include('ClassC.js');

Class('ClassD').extends('ClassC')(function(public){
	public.aFinal = "Third-level final member override attempt";
	public.dCustomValue = "Class D value";

	public.new = function () {
		this.super("Class D calling Class C");
	};

	public.getSuperAFinal = function () {
		return this.super.aFinal;
	};
});