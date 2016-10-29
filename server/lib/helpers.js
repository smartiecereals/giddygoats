const DangerArea = require('../db/models/DangerArea');
const redis = require('redis');
const request = require('request');
const client = redis.createClient();
const bodyParser = require('body-parser');
const david = require('./algorithm.js');
const polyline = require('polyline');
const async = require('async');
const createShareableURL = require('../shareableURL');
const GoogleURL = require('google-url');


var createDrawableWaypoints = function(points) {
	var drawablePoints = [];
	points.forEach(function(point) {
		var newPoint = {lat: point[0], lng: point[1]}
		drawablePoints.push(newPoint);
	})
	return drawablePoints;
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
						+ '&key=AIzaSyBgXiNUqN5OlBHE7hAVxV9phqHQrfKldXw';

	request(url, function(err, response, body) {
		var latLongObject = JSON.parse(body).results[0].geometry.location;
		callback(latLongObject);
	})
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------


module.exports.shortenURL = function (longUrl, callback) {
	googleUrl = new GoogleURL( { key: 'AIzaSyBgXiNUqN5OlBHE7hAVxV9phqHQrfKldXw' })
	googleUrl.shorten( longUrl, function( err, shortUrl ) {
		console.log('shortUrl', shortUrl)
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
		'key=AIzaSyBgXiNUqN5OlBHE7hAVxV9phqHQrfKldXw'
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
	        // client.set(redisKey, getMinimum(scores,polyline)); //This was breaking the code. Took out for testing

	        var bestRoute = getMinimum(scores)
	        var shareableURL = createShareableURL(bestRoute.waypoints)
	        var drawableWaypoints = createDrawableWaypoints(bestRoute.waypoints)
	        callback({url:shareableURL, waypoints: drawableWaypoints});
	    	}
			});
	  });
	});
}