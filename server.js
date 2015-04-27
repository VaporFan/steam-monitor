var express = require('express');
var bodyParser = require('body-parser');
var path  = require('path');
var config = require('./app/lib/config');
var log = require('./app/lib/log')(module);

var app = express();
var mongoose = require('mongoose');

mongoose.connect(config.get('mongoose:uri'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

require('./app/routes')(app);

app.listen(config.get('port'), function () {
    log.info('App listening at %s', config.get('port'));
});