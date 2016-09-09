namespace('MathUtils');

Class('Vector3')(function(public){
	public.x = 0;
	public.y = 0;
	public.z = 0;

	public.new = function (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	};
});