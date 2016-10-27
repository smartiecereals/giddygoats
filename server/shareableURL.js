const createShareableURL = function(coordinates) {
	var start = coordinates[0]
	var end = coordinates[coordinates.length - 1];
	var baseURL = 'https://www.google.com/maps?';
	debugger;
	var waypoints = '';
	var viaPoints = [];

	for (var i = 1; i < coordinates.length - 1; i++) {
		waypoints += ('+to:' + coordinates[i]);
		viaPoints.push(i);
	}

	var finalURL = (baseURL
		+ 'saddr=' + start
		+ '&daddr=' + end
		+ waypoints
		+ '&via=' 
		+ viaPoints.join(','))
	
	console.log('The final shareable URL is', finalURL)
	return finalURL;
	  //format for shared url is
	  // https://www.google.com/maps?saddr=40.802147,-81.941460&daddr=40.814147,-82.061460+to:40.805266,-81.927727&via=1
	  // Add start and finish locations
	  // append +to: for each waypoint inbetween
	  // append &via=x,x+1,… n-1 where x is all the numbers from 1 until the number before the last index of waypoints
	  // i.e. if there are 4 waypoints, this parameter will look like 1,2
	}
	
	module.exports = createShareableURL;



