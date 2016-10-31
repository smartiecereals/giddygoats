const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const redis = require('redis');
require('../env.js');
const utils = require('./lib/helpers.js');
const request = require('request')
const createCrimeQuery = require('./lib/queryCrime')
mongoose.connect('mongodb://127.0.0.1:27017/dangerDataDB');

const client = redis.createClient();

app.use(express.static(__dirname + '/../client'));



//-----------------------------------------------------------------
//-----------------------GET SAFEST ROUTE--------------------------
//-----------------------------------------------------------------

// I:
// Takes in origin and destination location. This information is stored 
// in the params of the url. The destination is always in plain text.
// The origin will sometimes be in plain text (if the user changes the
// origin address from their current location). But otherwise, the origin
// address will be an object containing latitude and location.

// O:
// Sends an object back to the client called 'safestRoute'. The object 
// contains a google maps url stored on the property 'shortURL', which 
// describes the safest route. The returned object also contains an array 
// of all the 'waypoints'.


app.get('/safestRoute', function(req, res) {
  // returnRoute accepts the long/lat values of the source & destination.
  // It sends the safest route (a google URL & an array of 'waypoints')
  // back to the client.

  var returnRoute = function(sourceLat, sourceLon, destLat, destLon, mobile) {
    console.log('req.query in server: ', req.query);
    var redisKey = sourceLat+sourceLon+destLat+destLon;
    client.get(redisKey, function(err, reply) {
      if (reply) {
        var parsed = JSON.parse(reply);
        console.log('found in redis!', reply);
        res.send(200, reply);
      } else {
        console.log('not found on redis!');
        const googleQueryString = utils.queryStringGoogle(sourceLat, sourceLon, destLat, destLon);
        utils.getSafestRoute(redisKey, googleQueryString, function(safestRoute) {
          if (mobile) {
            utils.sendSms(mobile, safestRoute.shortURL);
          }
          res.status(200).send(JSON.stringify(safestRoute));
        })
      }
    });
  };

  // convert destination address from plain text to lat/long - desination will ALWAYS need geocoding
  //If both are strings, then geocode them both and call returnRoute
  //Else, call return route with the geocoded data

  //If the origin and destination are strings, then it must be a SMS query - so decode them
  if (req.query.strOrigin && req.query.strDest) {
    utils.geocodeAddress(req.query.strDest, function(latLongDestObj) {
      const destLat = latLongDestObj.lat;
      const destLon = latLongDestObj.lng;
      utils.geocodeAddress(req.query.strOrigin, function(latLongOriginObj) {
        const originLat = latLongOriginObj.lat;
        const originLon = latLongOriginObj.lng;

        returnRoute(originLat, originLon, destLat, destLon, req.query.mobile)
      })
    })
  } else {
    //In this case is was a web query and we should have the coordinates of both in the query
    returnRoute(req.query.originLat, req.query.originLon, req.query.destLat, req.query.destLon, req.query.mobile)
  }

});

//-----------------------------------------------------------------
//-----------------------GET TEST DANGER --------------------------
//-----------------------------------------------------------------

// I: Current coordinates and the radius in which to check our database for hits
// O: An array of tuples with coordinates of where incidents have occurred.


app.get('/testDanger', function(req, res) {    
   //Create the URL to query the Crime API with based on co-ordinates    

   var queryUrl = createCrimeQuery(req.query.long, req.query.lat, req.query.radius)    

   request(queryUrl, function(err, response, body){    
     var data = JSON.parse(body);
     var newArr = data.map(function(item) {    
       //Create newArr so that it is an array of tuples with the coordinates in them   
       return item.location.coordinates;   
     });   

     res.status(200).send(newArr);   
   });   
 });

//If typed in a wrong route, redirect back to home
app.get('/*', function(req, res) {
  res.redirect(302, '/');
})


app.listen(port, function() {
  console.log('listening on port: ', port);
});

module.exports = app;

