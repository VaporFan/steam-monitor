var path = require('path');
var config = require('./lib/config');
var http = require('http');
var querystring = require('querystring');
var url = require('url');
var lobbies = require('./lobby_types.json');
var log = require('../app/lib/log')(module);
var MatchHistoryModel = require('./models/matchhistory').MatchHistoryModel;

module.exports = function (app) {
    app.get('/api/userinfo', function (req, res) {
        var qs = querystring.stringify({
            'key': config.get("key"),
            'steamids': req.query.steamids
        });
        get(qs, "v0002", "ISteamUser", "GetPlayerSummaries", function (err, data) {
            res.send(data);
        });
    });

    app.get('/api/lobbies', function (req, res) {
        res.send(lobbies);
    });

    app.get('/api/appinfo', function (req, res) {
        var qs = querystring.stringify({
            'key': config.get("key"),
            'appid': req.query.appid,
            'steamid': req.query.steamid
        });
        get(qs, "v0002", "ISteamUserStats", "GetUserStatsForGame", function (err, data) {
            res.send(data);
        });
    });

    app.get('/api/matchlist', function (req, res) {
        var expr = {};
        if (req.query.account_id) {
            expr = {'players.account_id': req.query.account_id};
        }
        return MatchHistoryModel.find(expr, function (err, matches) {
            if (!err) {
                return res.send(matches);
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({
                    error: 'Server error'
                });
            }
        });
    });

    app.get('/api/updatestat', function (req, res) {
        var qs = querystring.stringify({
            'key': config.get("key"),
            'account_id': req.query.account_id,
            'matches_requested': 25
        });
        get(qs, "v1", "IDOTA2Match_570", "GetMatchHistoryBySequenceNum", function (err, data) {
            var saveErr = null;
            data.result.matches.forEach(function (element) {
                var loadPlayers = function (data) {
                    var players = [];
                    data.forEach(function (element) {
                        var player = {
                            account_id: element.account_id,
                            player_slot: element.player_slot,
                            hero_id: element.hero_id
                        };
                        players.push(player)
                    });
                    return players
                };
                var matchHistory = new MatchHistoryModel({
                    match_id: element.match_id,
                    start_time: element.start_time,
                    lobby_type: element.lobby_type,
                    players: loadPlayers(element.players)
                });
                matchHistory.save(function (err) {
                    saveErr = err;
                });
            });
            if (!saveErr) {
                log.info('info updated');
                return res.send({
                    status: 'OK'
                });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({
                    error: 'Server error'
                });
            }
        });
    });

    app.get('/api/match', function (req, res) {
        var qs = querystring.stringify({
            'key': config.get("key"),
            'match_id': req.query.match_id
        });
        get(qs, "v1", "IDOTA2Match_570", "GetMatchDetails", function (err, data) {
            res.send(data);
        });
    });

    app.get('/api/heroes', function (req, res) {
        var qs = querystring.stringify({
            'key': config.get("key"),
            'language': config.get("lang")
        });
        get(qs, "v0001", "IEconDOTA2_570", "GetHeroes", function (err, data) {
            res.send(data);
        });
    });

    app.get('/api/items', function (req, res) {
        var qs = querystring.stringify({
            'key': config.get("key"),
            'language': config.get("lang")
        });
        get(qs, "v0001", "IEconDOTA2_570", "GetGameItems", function (err, data) {
            res.send(data);
        });
    });

    app.get('/api/steamid', function (req, res) {
        var qs = querystring.stringify({
            'key': config.get("key"),
            'vanityurl': req.query.vanityurl
        });
        get(qs, "v0001", "ISteamUser", "ResolveVanityURL", function (err, data) {
            res.send(data);
        });
    });

    app.all('*', function (req, res) {
        res.sendFile('index.html', {root: path.resolve(__dirname, '../public')});
    });
};

function get(qs, versionApi, category, command, callback) {
    var urlStr = url.format({
        "protocol": "http",
        "slashes ": true,
        "hostname": config.get("api"),
        "pathname": url.resolve("", path.join(category, command, versionApi)),
        "search": qs
    });
    return http.get(urlStr, function (result) {
        var res = "";
        result.setEncoding('utf8');
        result.on('data', function (chunck) {
            res += chunck;
        });
        result.on('end', function () {
            callback(null, JSON.parse(res));
        });
    });
}
