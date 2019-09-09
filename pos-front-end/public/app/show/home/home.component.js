(function () {
    angular.module('app')
        .component('xxHome', {
            templateUrl: './app/show/home/home.html',
            controller: ctrl
        });
	function ctrl($scope,Util,HomeFactory,UrlConstant,UserService,$state) {
		var ele = null;
		$scope.waveformUrl = '';
		$scope.openFile = function(){
			if( !ele )load(); 
			if( !ele )return Util.notice('This page crashes, please try to reload');
			ele.click(); 
		}
		function load() {
			ele = document.getElementById("audiofile");
			ele.addEventListener('change',
					function (e) {
						$scope.waveformUrl = '';
						function cb(err, res){
							if(err)return Util.notice(err);
							err = res['err'];
							if( err )return Util.notice(res['msg']||'Something wrong');
							res = res['res'];
							$scope.waveformUrl= HomeFactory.getWaveformSrc(res['filename']);
							Util.notice('Waveform generated, now loading waveform');
						}
						var file = e.target.files[0];
						if(!file)return;
						Util.notice('Uploading audio file');
						UrlConstant.post('get-waveform?get-filename=true', {
							file:file
						},cb);
					});
		}
	}
})();
