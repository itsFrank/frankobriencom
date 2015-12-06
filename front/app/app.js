'use strict';

require('angular');
require('angular-route');
require('./templates');

var app = angular.module('app', [
    'templates',
    'ngRoute'
]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'views/home/home.html',
                controller: 'homeController'
            }).
//::ROUTE_CURSOR_INDEX::
            otherwise({
                redirectTo: '/home'
            });
}]);

require('./views');
require('./directives');
require('./services');
