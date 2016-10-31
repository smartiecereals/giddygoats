var mongoose = require('mongoose');
var dangers = require('../data');
var DangerArea = require('./models/DangerArea');

mongoose.connection.on('open', function() {
  console.log('mongoose connection open');
});
mongoose.connection.on('disconnected', function() {
  console.log('mongoose connection closed');
});


var db = mongoose.connect('mongodb://127.0.0.1:27017/dangerDataDB');

//Populate the database with incidents from SFOpenData
var populateDB = function() {
    DangerArea.collection.drop();
	dangers.forEach(danger => {
		var newDanger = DangerArea({
			lat: danger.location.coordinates[0],
			lon: danger.location.coordinates[1]
		});
		console.log(newDanger);
		newDanger.save();
	});
	mongoose.disconnect();
}

populateDB();