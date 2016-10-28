var polyline = require('polyline');

//helper function: determines the distance between two points in meters
var haversineDist = function(locOne, locTwo) {
  var R = 6371000;  // Earth radius in meters
  var dLat = deg2rad(locOne[0] - locTwo[0]);
  var dLon = deg2rad(locOne[1] - locTwo[1]);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(locOne[0])) * Math.cos(deg2rad(locTwo[0])) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; //distance in meters
}

var deg2rad = function(deg) {
  return deg * (Math.PI / 180);
}

//helper function: determines a new set of coords given a start, an end, and a distance in % of overall distance between
var findPoint = function(locOne, locTwo, dist){
  var diff = [(locTwo[0] - locOne[0]) * dist, (locTwo[1] - locOne[1]) * dist];
  return [locOne[0] + diff[0], locOne[1] + diff[1]];
}

//main function: take a google maps plot and return an array of checkpoints
var alGoreRhythm = function(polyPoints) {
  var distance = 50; // distance in meters between crime checkpoints, modify here to change output
  var currentDist = distance; // variable used to keep track of distance between checkpoints in the reduce function below

  //run through the steps and decode the polylines to get an array containing all the x,y coords along the route

  //create a mirrored array containing the distances between each point
  var distances = polyPoints.reduce(function(acc, cur, i, o){
    return i === 0 ? [0] : acc.concat(haversineDist(o[i-1], o[i]));
  }, [0]);

  //Iterates through polypoints, reduces each distance from the counter, pushes to accumulator if result is below zero
  return polyPoints.reduce(function(acc, cur, i, o){
    while (currentDist - distances[i] <= 0){
      acc.push(findPoint(o[i-1], o[i], (currentDist / distances[i])));
      currentDist += distance;
    }
    currentDist -= distances[i];
    return acc;
  }, []);
}

module.exports = alGoreRhythm;