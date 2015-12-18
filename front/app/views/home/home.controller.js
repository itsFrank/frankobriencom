'use strict';

var app = require('angular').module('app');

app.controller('homeController', ['$scope', '$window', function($scope, $window){

    $scope.too_small = false;

    angular.element($window).bind('resize', function () {
        if ($window.innerWidth < 996 && !$window.innerWidth < 768) {
            if (!$scope.too_small) {
                $scope.too_small = true;
                $scope.$apply();
            }
        } else {
            if ($scope.too_small) {
                $scope.too_small = false;
                $scope.$apply();
            }
        }
    });

}]);
