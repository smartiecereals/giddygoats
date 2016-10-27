var http = require('http');
var port = 80;
var ip = 'safehipposerver.herokuapp.com';
var bodyParser = require('body-parser');
var path = require('path');
var express = require('express');
var request = require('request');
var app = express();
var createCrimeQuery = require('./queryCrime')

app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/../client/web'));
app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());

app.get('/shortestRoute', function(req, res) {
  //retrieve source lat and lon and dest lat and lon of user
  var sourceLat = req.query.sourceLat;
  var sourceLon = req.query.sourceLon;
  var destLat = req.query.destLat;
  var destLon = req.query.destLon;
  var waypoints = [];

  //url of api
  var url = 'https://maps.googleapis.com/maps/api/directions/json?'

  //fill in query parameters for the google maps api
  var queryUrl = 
    url +
    'origin=' + sourceLon + ',' + sourceLat +
    '&' +
    'destination=' + destLon + ',' + destLat + 
    '&' +
    'mode=walking' +
    '&' +
    'alternatives=true' +
    '&'
    'key=AIzaSyBgXiNUqN5OlBHE7hAVxV9phqHQrfKldXw';
  request(queryUrl, function(err, response, body) {
    //parse the response body
    var data = JSON.parse(body);
    //send back the directions information for the client
    res.send(200, JSON.stringify([
          {lat: 37.772, lng: -122.214},
          {lat: 21.291, lng: -157.821},
          {lat: -18.142, lng: 178.431},
          {lat: -27.467, lng: 153.027}
        ]));
  });
});

app.get('/testDanger', function(req, res) {
  //Create the URL to query the Crime API with based on co-ordinates
  var queryUrl = createCrimeQuery(req.query.long, req.query.lat)

  request(queryUrl, function(err, response, body){
    var data = JSON.parse(body);
    var newArr = data.map(function(item) {
      //Create newArr so that it is an array of tuples with the coordinates in them
      return item.location.coordinates;
    });
    res.status(200).send(newArr);
  });
});

app.listen(app.get('port'), function() {
  console.log('Listening in on http://' + ip + ':' + port);
});

