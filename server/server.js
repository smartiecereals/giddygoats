const http = require('http');
const ip = '159.203.167.63';
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const redis = require('redis');
const utils = require('./lib/helpers.js');
const request = require('request')
const createCrimeQuery = require('./queryCrime')
mongoose.connect('mongodb://127.0.0.1:27017/dangerDataDB');

const client = redis.createClient();

app.use(express.static(__dirname + '/../client/web'));

app.get('/safestRoute', function(req, res) {
  const sourceLat = req.query.sourceLat;
  const sourceLon = req.query.sourceLon;
  const destLat = req.query.destLat;
  const destLon = req.query.destLon;
  var redisKey = sourceLat+sourceLon+destLat+destLon;
  client.get(redisKey, function(err, reply) {
    if (reply !== null) {
      res.send(200, reply);
    } else {
      const googleQueryString = utils.queryStringGoogle(sourceLat, sourceLon, destLat, destLon);
      console.log('googleQueryString', googleQueryString)
      utils.getSafestRoute(redisKey, googleQueryString, function(safestRoute) {
        console.log('safestRoute', safestRoute)
        utils.shortenURL(safestRoute.url, function(shortURL) {
          safestRoute.shortURL = shortURL
          res.send(200, JSON.stringify(safestRoute));
        })

      });
    }
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

app.get('/*', function(req, res) {
  console.log('Missed the route!')
})


app.listen(port, function() {
  console.log('Listening in on http://' + ip + ':' + port);
});

