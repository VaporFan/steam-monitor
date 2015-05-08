'use strict';

var views = angular.module('sm.match.detail', ['ui.router', 'services']);

views.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('detailMatch', {
        url: '/matches/:matchid',
        templateUrl: 'js/views/matches/detailMatch.html',
        controller: 'detailMatchCtrl'
    })
}]);

views.controller('detailMatchCtrl', ['$scope', '$http', '$stateParams', 'MatchesService', 'GameObjectsService', function ($scope, $http, $stateParams, MatchesService, GameObjectsService) {
    GameObjectsService.getHeroes().then(function(response) {
        $scope.heroes = response.data.result.heroes;
    });

    var id = $stateParams.matchid;
    MatchesService.getMatchById(id).success(function (data, status) {
        $scope.match = data.result;
    });

    $scope.getHeroName = function (heroid) {
        return $scope.heroes.filter(function (obj) {
            return obj.id == heroid;
        })[0].localized_name;
    }
}]);