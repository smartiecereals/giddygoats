var http = require('http');
var ip = '159.203.167.63';
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var async = require('async');
var DangerArea = require('./db/models/DangerArea');
var app = express();
var request = require('request');
var port = 3000;
var polyline = require('polyline');
var david = require('./algorerhythm.js');
var redis = require('redis');

mongoose.connect('mongodb://127.0.0.1:27017/dangerDataDB');

var client = redis.createClient();

app.get('/safestRoute', function(req, res) {
  var sourceLat = req.query.sourceLat;
  var sourceLon = req.query.sourceLon;
  var destLat = req.query.destLat;
  var destLon = req.query.destLon;

  var redisKey = sourceLat+sourceLon+destLat+destLon;

  client.get(redisKey, function(err, reply) {
    if (reply !== null) {
      console.log('found in the cache!', reply);
      res.send(200, reply);
    } else {
      console.log('not found in redis cache', redisKey);
      var url = 'https://maps.googleapis.com/maps/api/directions/json?';
      //query to google
      var queryGoogle = 
        url +
        'origin=' + sourceLon + ',' + sourceLat +
        '&' +
        'destination=' + destLon + ',' + destLat + 
        '&' +
        'mode=walking' +
        '&' +
        'alternatives=true' +
        '&' +
        'key=AIzaSyBgXiNUqN5OlBHE7hAVxV9phqHQrfKldXw';

      request(queryGoogle, function(err, response, body) {
        var data = JSON.parse(body);
        var routes = {};

        for (var i = 0; i < data.routes.length; i++) {
          routes['route' + i] = david(polyline.decode(data.routes[i].overview_polyline.points));
        }

        var scores = []; 
        var routesLength = Object.keys(routes).length;

        async.each(Object.keys(routes), function(key) {
          var routeArr = routes[key];
          async.reduce(routeArr, 0, function(memo, coordinate, callback1) {
            getDangersInArea(coordinate[1], coordinate[0], function(err, data) {
              callback1(null, memo + data.length);
            });
          }, function(err, results) {
            var obj = {};
            obj['polyline'] = polyline.encode(routes[key]);
            obj['score'] = results;
            scores.push(obj);
            if (routesLength === scores.length) {
              console.log(scores);
              client.set(redisKey, getMinimumPolyline(scores)); 
              res.send(200, getMinimumPolyline(scores));
            }
          });
        });
      });
    }
  });
});

var getMinimumPolyline = function(arr) {
  var routes = sortByKey(arr, 'score');
  return routes[0].polyline;
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

var getDangersInArea = function(lat, lon, callback) {
  DangerArea
    .where('lat').gte(lat - 0.005).lte(lat + 0.005)
    .where('lon').gte(lon - 0.005).lte(lon + 0.005)
    .exec(callback);
}


app.get('/dbresults', function(req, res) {
  var data = 	DangerArea.find({}, function(err, dangerareas) {
    if (err) {
      console.log(err);
      res.send(404);
    } else {
      res.send(200, dangerareas);
    }
  });
});



app.listen(port, function() {
  console.log('Listening in on http://' + ip + ':' + port);
});

