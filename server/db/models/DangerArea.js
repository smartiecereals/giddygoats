var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

//Define the schema and their columns
var DangerAreaSchema = new mongoose.Schema({
	lon: 'number',
	lat: 'number'
});

//Create a model based on the schema
var DangerArea = mongoose.model('DangerArea', DangerAreaSchema);

module.exports = DangerArea;
