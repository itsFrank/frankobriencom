'use strict';

var app = require('angular').module('app');

app.directive('mainFooter', function() {
    return {
        templateUrl: 'directives/main-footer/main-footer.html',
        restrict: 'AE',
        scope: {},
        controller: ['$scope', function($scope) {

        }],
        link: function(scope, element, attrs, tabsCtrl) {

        }
    };
})