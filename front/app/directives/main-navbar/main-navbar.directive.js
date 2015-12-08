'use strict';

var app = require('angular').module('app');

app.directive('mainNavbar', function() {
    return {
        templateUrl: 'directives/main-navbar/main-navbar.html',
        restrict: 'AE',
        scope: {},
        controller: ['$scope', function($scope) {

        }],
        link: function(scope, element, attrs, tabsCtrl) {

        }
    };
})