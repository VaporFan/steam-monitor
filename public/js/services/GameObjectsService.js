'use strict';

var services = angular.module('services', []);

services.factory('GameObjectsService', ['$http', function($http){
    return {
        getHeroes: function() {
            return $http.get('/api/heroes', { cache: true});
        },
        getItems: function() {
            return $http.get('/api/items');
        },
        getLobbiesType: function() {
            return $http.get('/api/lobbies', { cache: true});
        }
    }
}]);