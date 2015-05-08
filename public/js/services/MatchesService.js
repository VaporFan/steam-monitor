'use strict';

var services = angular.module('services');

services.factory('MatchesService', ['$http', function($http) {
    return {
        getMatchesByAccount: function(accountId, matchesRequested) {
            return $http.get('/api/matchlist', {
                params: {
                    'account_id': accountId,
                    'matches_requested': matchesRequested
                }
            });
        },
        getMatches: function() {
            return $http.get('/api/matchlist', {
            });
        },
        getMatchById: function(matchid) {
            return $http.get('/api/match', {
                params: {
                    'match_id': matchid
                }
            })
        }
    }
}]);