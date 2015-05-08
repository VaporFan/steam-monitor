var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MatchHistorySchema = new Schema({
    match_id: String,
    start_time: String,
    lobby_type: String,
    players: [{
        account_id: String,
        player_slot: String,
        hero_id: String
    }]
});

var MatchHistoryModel = mongoose.model('MatchHistory', MatchHistorySchema, 'MatchHistory');

module.exports.MatchHistoryModel = MatchHistoryModel;