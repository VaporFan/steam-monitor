'use strict';

var app = angular.module('sm', ['ui.router', 'sm.matches', 'sm.match.detail', 'services']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/matches');
});