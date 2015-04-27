var request = require('request');
var path = require('path');
var config = require('./lib/config');

module.exports = function (app) {
    app.get('/userinfo', function(req, res) {
        var steamId = req.getParameter("steamId");
        var url = path.join(config.get("api"), "ISteamUserStats", "GetUserStatsForGame","v0002", config.get("game"), steamId);
        request.get({
            url: url,
            qs: {
                "key": config.get("key")
            }
        })
    })
};