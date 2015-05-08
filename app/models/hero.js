var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HeroSchema = new Schema({
    name: String,
    id: String,
    localized_name: String
});

var HeroModel = mongoose.model('Hero', HeroSchema, 'Hero');

module.exports.HeroModel = HeroModel;