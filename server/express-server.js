var http = require('http');
var port = 80;
var ip = 'safehipposerver.herokuapp.com';
var bodyParser = require('body-parser');
var path = require('path');
var express = require('express');
var db = require('./database/config');
var Danger = require('./database/models/Danger');
var app = express();

app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));
//app.use(express.static(__dirname + '/build'));
app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());

app.get('/dangerData', function(req, res) {
  var dangerArray = []; 
/*
  Danger.findAll().then(function(dangers) {
    var i = 0;
    while (dangers[i]) {
      console.log(dangers[i].dataValues);
      i += 1;
    }
  }); */

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
  /*
  Danger.sync().then(function () {
    return Danger.bulkCreate(req.body.storage);
  })
    .then(function() {
      res.sendStatus(201);
    }); 

  for (var i = 0; i < storage.length; i++) {
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
  }  */

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

