'use strict';

var app = require('angular').module('app');

app.directive('gameOfLife', function() {
    return {
        templateUrl: 'directives/game-of-life/game-of-life.html',
        restrict: 'AE',
        scope: {},
        controller: ['$scope', '$interval', function($scope, $interval) {
            $scope.size = 10;
            $scope.interval = 1000;
            $scope.running = false;
            $scope.grid = [];
            $scope.game_handle = undefined;


            $scope.toggle_game_run = function(){
                if ($scope.running) {
                    $scope.running = false;
                    $interval.cancel($scope.game_handle);
                    $scope.game_handle = undefined;
                } else {
                    $scope.running = true;
                    $scope.game_handle = $interval( function(){ $scope.gol_loop(); }, $scope.interval);
                }
            };

            $scope.mod = function(n, m) {
                return ((n % m) + m) % m;
            };

            $scope.clearGrid = function(){
                for (var i = 0; i < $scope.size; i++) {
                    for (var j = 0; j < $scope.size; j++) {
                        $scope.grid[i][j].alive = false;
                    }
                }
            };

            $scope.tileFactory = function(initialState, i, j){
                return {
                    alive: initialState,
                    next: true,
                    index: {i: i, j: j},
                    calcNextGen: function(){
                        var count = 0;
                        for (var x = -1; x < 2; x++){
                            for (var y = -1; y < 2; y++){
                                if (x === 0 && y === 0) {}
                                else if ($scope.grid[$scope.mod(this.index.i + x, $scope.size)][$scope.mod(this.index.j + y, $scope.size)].alive) {
                                    count++;
                                }
                            }
                        }
                        if (count < 2) this.next = false;
                        else if (count == 2 && this.alive) this.next = true;
                        else if (count == 3) this.next = true;
                        else this.next = false;
                    },
                    setNextGen: function(){
                        this.alive = this.next;
                    }
                };
            };

            $scope.resetGrid = function(){
                for (var i = 0; i < $scope.size; i++) {
                    $scope.grid[i] = [];
                    for (var j = 0; j < $scope.size; j++) {
                        $scope.grid[i][j] = $scope.tileFactory(Math.floor(Math.random() * 2) == 1 ? true : false, i, j);
                    }
                }
                for (var i = 0; i < $scope.size; i++) {
                    for (var j = 0; j < $scope.size; j++) {
                        $scope.grid[i][j].calcNextGen();
                    }
                }
            };

            $scope.gol_loop = function(){
                for (var i = 0; i < $scope.size; i++) {
                    for (var j = 0; j < $scope.size; j++) {
                        $scope.grid[i][j].calcNextGen();
                    }
                }

                for (var i = 0; i < $scope.size; i++) {
                    for (var j = 0; j < $scope.size; j++) {
                        $scope.grid[i][j].setNextGen();
                    }
                }
            };

            $scope.resetGrid();
            $scope.toggle_game_run();

        }],
        link: function(scope, element, attrs, tabsCtrl) {

        }
    };
});
