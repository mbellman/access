(function(){
	Class('OscillatorNode')(function(public, private){
		private.volume = 2;
		private.playTime = 10;
		public.pitch = 10;
		public.time = 50;

		public.getVolume = function () {
			console.log(this.volume);
		};

		public.getPlayTime = function () {
			console.log(this.playTime);
		};

		public.setVolume = function (volume) {
			this.volume = volume;
		};

		public.getPitch = function () {
			console.log(this.pitch);
		};
	});
})();