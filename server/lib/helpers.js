const DangerArea = require('../db/models/DangerArea');
const redis = require('redis');
const request = require('request');
const client = redis.createClient();
const bodyParser = require('body-parser');
const david = require('./algorithm.js');
const polyline = require('polyline');
const async = require('async');

const url = 'https://maps.googleapis.com/maps/api/directions/json?'

const sortByKey = function(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

const getMinimumPolyline = function(arr) {
  var routes = sortByKey(arr, 'score');
  return routes[0].polyline;
}

const getDangersInArea = function(lat, lon, callback) {
  DangerArea
    .where('lat').gte(lat - 0.005).lte(lat + 0.005)
    .where('lon').gte(lon - 0.005).lte(lon + 0.005)
    .exec(callback);
}



module.exports.queryStringGoogle = function(sourceLat, sourceLon, destLat, destLon) {
	return (
		url +
		'origin=' + sourceLon + ',' + sourceLat +
		'&' +
		'destination=' + destLon + ',' + destLat + 
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

	  for (var i = 0; i < data.routes.length; i++) {
	    routes['route' + i] = david(polyline.decode(data.routes[i].overview_polyline.points));
	  }

	  async.each(Object.keys(routes), function(key) {
	    const routeArr = routes[key];
	    async.reduce(routeArr, 0, function(memo, coordinate, callback1) {
	      getDangersInArea(coordinate[1], coordinate[0], function(err, data) {
	        callback1(null, memo + data.length);
	      });
	    }, function(err, results) {
	      const obj = {};
	      obj['polyline'] = polyline.encode(routes[key]);
	      obj['score'] = results;
	      scores.push(obj);
	      if (routesLength === scores.length) {
	        client.set(redisKey, getMinimumPolyline(scores)); 
	        callback(getMinimumPolyline(scores));
	      }
	    });
	  });
	});
}