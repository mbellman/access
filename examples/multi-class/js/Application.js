Class('Application')(function(public, private){
	private.people = null;

	public.new = function () {
		this.people = {};
	};

	public.addPerson = function (person) {
		var name = person.getName();
		this.people[name] = person;
	};

	public.getPerson = function (name) {
		return this.people[name];
	};
});