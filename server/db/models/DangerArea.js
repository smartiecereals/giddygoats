var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

var DangerAreaSchema = new mongoose.Schema({
	lon: 'number',
	lat: 'number'
});

var DangerArea = mongoose.model('DangerArea', DangerAreaSchema);

module.exports = DangerArea;
