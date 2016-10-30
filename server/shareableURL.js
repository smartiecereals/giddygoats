const createShareableURL = function(coordinates) {

	var start = coordinates[0]
	var end = coordinates[1];
	var baseURL = 'https://www.google.com/maps?';

	var waypoints = '';
	// var viaPoints = []; Used for the via parameter to stop displaying waypoints

	for (var i = 2; i < coordinates.length; i++) {
		waypoints += ('+to:' + coordinates[i]);
		// viaPoints.push(i);
	}

	var finalURL = (baseURL
		+ 'saddr=' + start
		+ '&daddr=' + end
		+ waypoints
		+ '&dirflg=w'
		// + '&via=' 
		// + viaPoints.join(',')
		)
	
	return finalURL;
	}
	
	module.exports = createShareableURL;



