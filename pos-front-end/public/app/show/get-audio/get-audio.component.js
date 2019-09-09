(function(){
	angular.module('app')
		.component('xxGetAudio', {
			templateUrl:'./app/show/get-audio/get-audio.html',
			controller:ctrl
		});
	function ctrl($scope,Util,HomeFactory,UrlConstant,UserService,$state) {
		var ele = null; 
		var ele1 = null;
		$scope.openFile = function(){
			if( !ele )load(); 
			ele.click(); 
		}
		$scope.openFile1 = function(){
			if( !ele1 )load1(); 
			ele1.click(); 
		}
		function load(){
			ele = document.getElementById("waveformfile");
			console.log(ele);
			ele.addEventListener('change',
					function (e) {
						$scope.audioUrl = '';
						function cb(err, res){
							if(err)return Util.notice(err);
							err = res['err'];
							if( err )return Util.notice(res['msg']||'Something wrong');
							res = res['res'];
							$scope.audioUrl= HomeFactory.getAudioSrc(res['filename']);
							Util.notice('Audio found, now loading audio');
						}
						Util.notice('Uploading waveform file');
						UrlConstant.post('get-audio?get-filename=true', {
							file:e.target.files[0]
						},cb);
					});
		}
		function load1(){
			ele1 = document.getElementById("waveformfile1");
			console.log(ele1);
			ele1.addEventListener('change',
					function (e) {
						$scope.audioUrl = '';
						function cb(err, res){
							if(err)return Util.notice(err);
							err = res['err'];
							if( err )return Util.notice(res['msg']||'Something wrong');
							res = res['res'];
							$scope.audioUrl= HomeFactory.getAudioSrc(res['filename']);
							Util.notice('Audio found, now loading audio');
						}
						Util.notice('Uploading waveform file');
						UrlConstant.post('get-audio1?get-filename=true', {
							file:e.target.files[0]
						},cb);
					});
		}
	}
})();
