(function(){
	angular.module('app')
		.factory('HomeFactory',fn);
	function fn(UrlConstant){
		var self = {};
		self.getWaveformSrc = function(filename){
			return UrlConstant.base_url + 'get-waveform/' + filename;
		}
		self.getAudioSrc = function(filename){
			return UrlConstant.base_url + 'get-audio/' + filename;
		}
		return self;
	}
})();
