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
  var sourceLat = req.query.sourceLat;
  var sourceLon = req.query.sourceLon;
  var destLat = req.query.destLat;
  var destLon = req.query.destLon;
  var waypoints = [];


  var url = 'https://maps.googleapis.com/maps/api/directions/json?'

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
  console.log(queryUrl);
  request(queryUrl, function(err, response, body) {
    var data = JSON.parse(body);
    console.log(data);
    res.send(200, data);
  });
});

app.get('/testDanger', function(req, res) {
  console.log('testDanger recieved')
  console.log('req.query', req.query);
  var queryUrl = createCrimeQuery(req.query.long, req.query.lat)
  console.log('queryUrl', queryUrl);
  request(queryUrl, function(err, response, body){
    var data = JSON.parse(body);
    console.log('the data that is apparently broken is', data)
    var newArr = data.map(function(item) {
      return item.location.coordinates;
    });
    res.status(200).send(newArr);
  });

});




app.listen(app.get('port'), function() {
  console.log('Listening in on http://' + ip + ':' + port);
});

