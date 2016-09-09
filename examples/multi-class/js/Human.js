Class('Human')(function(public, private, protected){
	protected.age = 0;

	public.new = function (age) {
		this.age = age;
	};
});