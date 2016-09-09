(function(){
	root('js');

	include('mathutils.js');
	include('Vector3.js');

	var MathUtils = use.namespace('MathUtils');

	main(function(){
		console.log(MathUtils.square(5));   // 25
		console.log(MathUtils.cube(5));     // 125

		var vec3 = new MathUtils.Vector3(0, 1, -1);

		console.log(vec3.x, vec3.y, vec3.z);   // 0, 1, -1
	});
})();