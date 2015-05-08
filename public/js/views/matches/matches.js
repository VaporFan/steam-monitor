'use strict';

var views = angular.module('sm.matches', ['ui.router', 'services']);

views.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('matches', {
        url: '/matches',
        templateUrl: 'js/views/matches/matches.html',
        controller: 'matchesCtrl',
        resolve: {

        }
    })
}]);

views.controller('matchesCtrl', ['$scope', '$http', 'GameObjectsService', 'MatchesService', function ($scope, $http, GameObjectsService, MatchesService) {
    GameObjectsService.getLobbiesType().then(function(response) {
        $scope.lobbies = response.data.lobbies;
    });
    $scope.formatLobby = function (lobbyType) {
        return $scope.lobbies.filter(function(lobby) {
            return lobby.id == lobbyType
        })[0].name;
    };
    $scope.decodeUnixTime = function (ts) {
        var date = new Date(ts * 1000);
        return date.toLocaleDateString();
    };
    MatchesService.getMatches().success(function (data, status) {
        $scope.matches = data;
    });
}]);