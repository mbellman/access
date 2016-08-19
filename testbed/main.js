(function(){
	var OscillatorNode = include('OscillatorNode').from('Application.js');

	main(function(){
		var t = new Date().getTime();

		var nodes = [];

		for (var i = 0 ; i < 100000 ; i++) {
			nodes[i] = new OscillatorNode();
		}

		window.t = function () { return nodes; };

		console.log(new Date().getTime() - t);
	});
})();