/**
 *   For
 *   Created by xs at 2018/4/3
 */
"use strict";
(function () {
    angular.module('app')
        .factory('Util',tmp);
    function tmp($mdToast,$cookies,$stateParams) {
        var self = {};
        self.notice = function (msg) {
            msg = msg || "something wrong";
            $mdToast.show(
                $mdToast.simple()
                    .textContent(msg)
                    .hideDelay(3000)
            );
        };
				self.getStateParams = function(key){
					return $stateParams[key];
				}
			  self.makeRes = function(res,msg,err){
				  return {
						msg:msg,
						res:res,
						err:err?err:0
					};
				}
        return self;
    }
})();
