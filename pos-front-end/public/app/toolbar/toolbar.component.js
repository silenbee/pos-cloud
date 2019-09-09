(function () {
    angular.module('app')
        .component('xxToolbar',{
            templateUrl:'./app/toolbar/toolbar.html',
            controller:fn
        })
    function fn($scope,$mdSidenav,$timeout,APP_CONFIGURE) {
        $scope.title = APP_CONFIGURE.title;
        $scope.toggleLeft = buildDelayedToggler('left');
        function debounce(func, wait, context) {
            var timer;
            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }
        function buildDelayedToggler(navID) {
            return debounce(function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                    });
            }, 100);
        }
    }
})();