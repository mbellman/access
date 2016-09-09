Class('Application')(function(public, private){
	private.people = {};

	public.addPerson = function (person) {
		var name = person.getName();
		this.people[name] = person;
	};

	public.getPerson = function (name) {
		return this.people[name];
	};
});