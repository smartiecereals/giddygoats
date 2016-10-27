const http = require('http');
const ip = '159.203.167.63';
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const redis = require('redis');
const utils = require('./lib/helpers.js');

mongoose.connect('mongodb://127.0.0.1:27017/dangerDataDB');

const client = redis.createClient();

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

      utils.getSafestRoute(redisKey, googleQueryString, function(safestRoute) {
        res.send(200, safestRoute);
      });
    }
  });
});


app.listen(port, function() {
  console.log('Listening in on http://' + ip + ':' + port);
});

