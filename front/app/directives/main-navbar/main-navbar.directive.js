'use strict';

var app = require('angular').module('app');

app.directive('mainNavbar', function() {
    return {
        templateUrl: 'directives/main-navbar/main-navbar.html',
        restrict   : 'AE',
        scope      : {},
        controller : ['$scope', '$window', function($scope, $window) {
            //Toggles
            $scope.isToggle = false;

            //Watch width changes
            angular.element($window).bind('resize', function () {
                if ($window.innerWidth > 768 && $scope.isToggle) {
                    $scope.isToggle = false;
                    $scope.$apply();
                }
            });
        }],
        link: function(scope, element, attrs, tabsCtrl) {

        }
    };
});
