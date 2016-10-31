const DangerArea = require('../db/models/DangerArea');
const redis = require('redis');
const request = require('request');
const client = redis.createClient();
const bodyParser = require('body-parser');
const david = require('./algorithm.js');
const polyline = require('polyline');
const async = require('async');
const GoogleURL = require('google-url');
const twilioSID = process.env.SAFE_HIPPO_TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.SAFE_HIPPO_TWILIO_ACCOUNT_AUTH_TOKEN;
const twillio = require('twilio')( twilioSID, twilioAuthToken);
const googleKey = process.env.SAFE_HIPPO_GOOGLE_MAPS_KEY;

const createDrawableWaypoints = function(points) {
	var drawablePoints = [];
	points.forEach(function(point) {
		var newPoint = {lat: point[0], lng: point[1]}
		drawablePoints.push(newPoint);
	})
	return drawablePoints;
}

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

//----------------------------------------------------------------------
//-------------------------GEOCODE ADDRESS------------------------------
//----------------------------------------------------------------------

// INPUT: address e.g. "944 Market Street, San Francisco", and a callback function

// RESULT: the callback acts on an object containing the lat & long of the address
// e.g  { lat: 37.771102, lng: -122.4525798 }


module.exports.geocodeAddress = function(strAddress, callback) {
	var addressFormatted = strAddress.split(' ').join('+');
	var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' 
						+ addressFormatted
						+ '&key='
						+ googleKey;
	request(url, function(err, response, body) {
		var latLongObject = JSON.parse(body).results[0].geometry.location;
		callback(latLongObject);
	})
}

//----------------------------------------------------------------------
//----------------------- SEND SMS TO USER -----------------------------
//----------------------------------------------------------------------


module.exports.sendSms = function(mobile, shortURL) {
  twillio.messages.create({
    body: 'Oink Oink, here is the safest way home: ' + shortURL,
    to: mobile,
    from: '+16282222956'
  }, function(err, data) {
    if (err) {
      console.error('Error sending SMS');
      console.error(err);
    } else {
      console.log('SMS successfully sent!');
    }
  });
};


//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------


const shortenURL = function (longUrl, callback) {
	googleUrl = new GoogleURL( { key: googleKey })
	googleUrl.shorten( longUrl, function( err, shortUrl ) {
		callback(shortUrl);
	});
}

const sortByKey = function(array, key) {
	return array.sort(function(a, b) {
		var x = a[key]; var y = b[key];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}

const getMinimum = function(arr) {
	var routes = sortByKey(arr, 'score');
	return routes[0];
}

const getDangersInArea = function(lat, lon, callback) {
	DangerArea
	.where('lat').gte(lat - 0.005).lte(lat + 0.005)
	.where('lon').gte(lon - 0.005).lte(lon + 0.005)
	.exec(callback);
}



module.exports.queryStringGoogle = function(sourceLat, sourceLon, destLat, destLon) {
	const baseURL = 'https://maps.googleapis.com/maps/api/directions/json?'
	return (
		baseURL +
		'origin=' + sourceLat + ',' + sourceLon +
		'&' +
		'destination=' + destLat + ',' + destLon + 
		'&' +
		'mode=walking' +
		'&' +
		'alternatives=true' +
		'&' +
		'key=' + googleKey
		);
}

module.exports.getSafestRoute = function(redisKey, googleQueryString, callback) {


	request(googleQueryString, function(err, response, body) {
		const data = JSON.parse(body);
		const routes = {};
		const scores = []; 
		const routesLength = data.routes.length;

		function getWaypoints (route) {
			// console.log(JSON.stringify(JSON.stringify(route)));
		  	//This will take in a whole root and return the coordinates of all the steps
		  	var waypoints = [];
		  	// var testSteps = []
		  	var startPoint = route.legs[0].start_location;
		  	waypoints.push([startPoint.lat, startPoint.lng]) //Initialise the start point

		  	route.legs[0].steps.forEach(function(step) {
		  		// testSteps.push(step.html_instructions)
		  		waypoints.push([step.end_location.lat, step.end_location.lng])
		  	})
		  	// console.log(testSteps);
		  	return waypoints;
	 	}

	  //Populate an object with all of the routes as keys and the standardised polylines as values
	  for (var i = 0; i < data.routes.length; i++) {
	  	var routeData = {}
	  	routeData.standardPoints = david(polyline.decode(data.routes[i].overview_polyline.points))
	  	routeData.waypoints = getWaypoints(data.routes[i]);
	  	routes['route' + i] = routeData

	  }

	  async.each(Object.keys(routes), function(key) {
	  	const routeArr = routes[key].standardPoints;
	  	async.reduce(routeArr, 0, function(memo, coordinate, callback1) {
	  		getDangersInArea(coordinate[1], coordinate[0], function(err, data) {
	      	//Get the number of crimes nearby this point
	      	callback1(null, memo + data.length);
	      });
	  	}, function(err, results) {
	  		const obj = {};
	  		obj['score'] = results;
	  		obj['waypoints'] = routes[key].waypoints
	  		scores.push(obj);
	  		if (routesLength === scores.length) {
	  			const safestRoute = {};
	        const bestRoute = getMinimum(scores)
	        safestRoute.url = createShareableURL(bestRoute.waypoints)
	        safestRoute.waypoints = createDrawableWaypoints(bestRoute.waypoints)
	        shortenURL(safestRoute.shareableURL, function(shortURL) {
	        	safestRoute.shortURL = shortURL;
	        	const redisValue = JSON.stringify(safestRoute);
	        	client.set(redisKey, redisValue); 
	        	callback(safestRoute);
	        });
	    	}
			});
	  });
	});
}