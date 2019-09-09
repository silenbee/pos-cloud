/**
 * Created by xs on 2017/12/26.
 */
'use strict';
(function () {
    angular.module('app')
        .config(fn);
    function fn($stateProvider,ROUTER_CONSTANT) {
        ROUTER_CONSTANT.forEach($stateProvider.state);
    }
})();