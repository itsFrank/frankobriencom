'use strict';

var app = require('angular').module('app');

app.directive('gameOfLife', function() {
    return {
        templateUrl: 'directives/game-of-life/game-of-life.html',
        restrict: 'AE',
        scope: {},
        controller: ['$scope', '$interval', function($scope, $interval) {
            $scope.size = 10;
            $scope.running = false;
            $scope.grid = [];
            $scope.game_handle = undefined;
            $scope.current_tab = 2;
            $scope.settings = {};
            $scope.settings.speed = 0.5;
            $scope.old_speed = $scope.settings.speed;
            $scope.settings.wrap = true;


            $scope.toggleWrap = function(){
                $scope.settings.wrap = !$scope.settings.wrap;
            }

            $scope.changeSpeed = function(){
                $interval.cancel($scope.game_handle);
                $scope.game_handle = undefined;
                $scope.game_handle = $interval( function(){ $scope.gol_loop(); }, $scope.settings.speed * 1000);
                $scope.old_speed = $scope.settings.speed;
            };

            $scope.tab_to = function(tab){
                $scope.current_tab = tab;
            };

            $scope.toggle_game_run = function(){
                if ($scope.running) {
                    $scope.running = false;
                    $interval.cancel($scope.game_handle);
                    $scope.game_handle = undefined;
                } else {
                    $scope.running = true;
                    $scope.game_handle = $interval( function(){ $scope.gol_loop(); }, $scope.settings.speed * 1000);
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
                                if ($scope.settings.wrap){
                                    if (x === 0 && y === 0) {}
                                    else if ($scope.grid[$scope.mod(this.index.i + x, $scope.size)][$scope.mod(this.index.j + y, $scope.size)].alive) {
                                        count++;
                                    }
                                } else {
                                    if (x === 0 && y === 0) {}
                                    else if (this.index.i + x < 0 || this.index.i + x > $scope.size - 1 || this.index.j + y < 0 || this.index.j + y > $scope.size - 1) {}
                                    else if ($scope.grid[$scope.mod(this.index.i + x, $scope.size)][$scope.mod(this.index.j + y, $scope.size)].alive) {
                                        count++;
                                    }
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
                if ($scope.settings.speed != $scope.old_speed){
                    $scope.changeSpeed();   
                }
                
                
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

            //PRESETS
            
            $scope.setPreset = function(preset){
                for (var i = 0; i < $scope.size; i++) {
                    for (var j = 0; j < $scope.size; j++) {
                        $scope.grid[i][j].alive = (preset.pattern[i][j] === 1) ? true : false;
                        $scope.settings.wrap = preset.wrap;
                    }
                }
            }
            
            
            $scope.presets = {};
            
            $scope.presets.empty = {
                'pattern' : [
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]],
                'wrap' : true};
                
            $scope.presets.glider = {
                'pattern' : [
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,1,0,0],
               [0,0,0,0,0,0,0,0,1,0],
               [0,0,0,0,0,0,1,1,1,0],
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,1,0,0,0,0,0,0,0],
               [0,0,0,1,0,0,0,0,0,0],
               [0,1,1,1,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0]],
               'wrap' : true};           
            $scope.presets.spaceship = {
                'pattern' : [
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,1,0,0,1,0,0,0],
               [0,0,1,0,0,0,0,0,0,0],
               [0,0,1,0,0,0,1,0,0,0],
               [0,0,1,1,1,1,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0]],
               'wrap' : true};            
            
            $scope.presets.ants = {
                'pattern' : [
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0],
               [0,1,1,0,0,0,1,1,0,0],
               [0,0,0,1,1,0,0,0,1,1],
               [0,0,0,1,1,0,0,0,1,1],
               [0,1,1,0,0,0,1,1,0,0],
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0]],
               'wrap' : true};           
                
            $scope.presets.figureeight = {
                'pattern' : [
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,1,1,1,0,0,0,0,0],
               [0,0,1,1,1,0,0,0,0,0],
               [0,0,1,1,1,0,0,0,0,0],
               [0,0,0,0,0,1,1,1,0,0],
               [0,0,0,0,0,1,1,1,0,0],
               [0,0,0,0,0,1,1,1,0,0],
               [0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0]],
               'wrap' : true};               
            $scope.presets.pentapole = {
                'pattern' : [
                [0,0,0,0,0,0,0,0,0,0],
                [0,1,1,0,0,0,0,0,0,0],
                [0,1,0,0,0,0,0,0,0,0],
                [0,0,1,0,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,1,0,1,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,1,0,1,0],
                [0,0,0,0,0,0,0,1,1,0],
                [0,0,0,0,0,0,0,0,0,0]],
                'wrap' : true};
                
            $scope.presets.bars = {
                'pattern' : [
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [1,1,1,1,1,1,1,1,1,1],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]],
                'wrap' : true};
                
            $scope.presets.unix = {
                'pattern' : [
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,1,1,0,0,0,0,0,0],
                [0,0,1,1,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0,0],
                [0,1,0,1,0,0,0,0,0,0],
                [0,1,0,0,1,0,0,1,1,0],
                [0,0,0,0,0,1,0,1,1,0],
                [0,0,0,1,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]],
                'wrap' : false};
                
            $scope.presets.tumbler = {
                'pattern' : [
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,1,0],
                [0,1,0,1,0,0,0,1,0,1],
                [0,1,0,0,1,0,1,0,0,1],
                [0,0,0,1,0,0,0,1,0,0],
                [0,0,0,1,1,0,1,1,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]],
                'wrap' : true};
                
            $scope.presets.beehive = {
                'pattern' : [
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,1,1,0,0,0,0],
                [0,0,0,1,0,0,1,0,0,0],
                [0,0,0,0,1,1,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]],
                'wrap' : true};
                
            $scope.presets.block = {
                'pattern' : [
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,1,1,0,0,0,0],
                [0,0,0,0,1,1,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]],
                'wrap' : true};
                
            $scope.presets.integral = {
                'pattern' : [
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,1,1,0,0,0],
                [0,0,0,0,1,0,1,0,0,0],
                [0,0,0,0,1,0,0,0,0,0],
                [0,0,1,0,1,0,0,0,0,0],
                [0,0,1,1,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]],
                'wrap' : true};
                
            $scope.presets.angryman = {
                'pattern' : [
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,1,1,0,0,1,1,0,0],
                [0,0,0,1,1,1,1,0,0,0],
                [0,1,0,0,0,0,0,0,1,0],
                [1,0,1,1,1,1,1,1,0,1],
                [0,1,0,0,0,0,0,0,1,0],
                [0,0,0,1,1,1,1,0,0,0],
                [0,0,1,1,0,0,1,1,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]],
                'wrap' : false};
                
            $scope.presets.tables = {
                'pattern' : [
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,1,0,0,1,0,0,0],
                [0,0,0,1,1,1,1,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,1,1,1,1,0,0,0],
                [0,0,0,1,0,0,1,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]],
                'wrap' : true};
                
                
            
                



        }],
        link: function(scope, element, attrs, tabsCtrl) {

        }
    };
});
