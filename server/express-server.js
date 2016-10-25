var http = require('http');
var port = 80;
var ip = 'safehipposerver.herokuapp.com';
var bodyParser = require('body-parser');
var path = require('path');
var express = require('express');
var request = require('request');
var db = require('./database/config');
var Danger = require('./database/models/Danger');
var app = express();

app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));
//app.use(express.static(__dirname + '/build'));
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

app.get('/populateDB', function(req, res) {
  var url = 'http://data.sfgov.org/resource/cuks-n6tp.json?category=ASSAULT';

  request(url, function(err, response, body) {
    var data = JSON.parse(body);
    for (var i = 0; i < data.length; i++) {
      Danger.sync().then(function() {
        console.log(data[i].location.coordinates);
        return Danger.create({
          lat: data[i].location.coordinates[0],
          lon: data[i].location.coordinates[1]

        });

      })
        .then(function() {
          res.sendStatus(201);

        }); 

    }

  });

});



app.get('/testDanger', function(req, res) {
  var url = 'http://data.sfgov.org/resource/cuks-n6tp.json?category=ASSAULT&$where=';
  var queryUrl = 
    url 
    + 'x > ' 
    + (parseFloat(req.query.lat) - 0.0005)
    + ' AND x < ' 
    + (parseFloat(req.query.lat) + 0.0005)
    + ' AND y > ' 
    + (parseFloat(req.query.lon) - 0.0005)
    + ' AND y < ' 
    + (parseFloat(req.query.lon) + 0.0005);
  console.log(queryUrl);
  var dangerArray = [];

  request(queryUrl, function(err, response, body){
    var data = JSON.parse(body);
    var newArr = data.map(function(item) {
      return item.location.coordinates;

    });
    res.send(200, newArr);

  });

});


app.get('/dangerData', function(req, res) {
  var dangerArray = []; 

  console.log(req.query);
  var latRange = getRange(parseInt(req.query.lat));
  var lonRange = getRange(parseInt(req.query.lon));
  Danger.findAll( {
    where: {
      lat: {
        between: latRange
      },
      lon: {
        between: lonRange
      }
    }
  })
    .then(function(dangers) {
      var i = 0;
      while (dangers[i]) {
        console.log(dangers[i].dataValues);
        dangerArray.push(dangers[i].dataValues);
        i += 1;
      }
      console.log(dangerArray);
      res.send(dangerArray);
    });
});

var getRange = function(latOrLon) { 
  //use this to get range
  var results = [latOrLon - 50, latOrLon + 50];
  return results;
};

app.post('/dangerData', function(req, res) {
  console.log('this is the req', req.body);

  Danger.sync().then(function () {
    // Table created
    return Danger.create({
      lat: req.body.lat,
      lon: req.body.lon,
      count: req.body.count
    });
  })
    .then(function() {
      res.sendStatus(201);
    }); 
});


app.listen(app.get('port'), function() {
  console.log('Listening in on http://' + ip + ':' + port);
});

