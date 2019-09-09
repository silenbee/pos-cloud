/**
 *   For
 *   Created by xs at 2018/1/12
 */
"use strict";
(function () {
		var enableMockHttp = false;
	  var title = 'POS';

    var server='http://localhost:81/pos/api/v0/'   //'https://hotpot.club/pos/api/v0/';

		server = server||location.host;

    var tmp = {
			  enableMockHttp:enableMockHttp,
        base_url:'http://localhost:81/pos/api/v0/',
        title:title
    };
    angular.module('app')
        .constant('APP_CONFIGURE',tmp);
})();
