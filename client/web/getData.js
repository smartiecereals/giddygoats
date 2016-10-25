//Convert points from API into heatmap array
function getPoints(long, lat) {

  var mapPoints = [];
  //TODO: Replace this with a get request to /testDanger
  return new Promise(function(resolve, reject) {
    resolve(getCrimeAPI(long, lat))
  })
  .then(function(crimes) {
    for (let i = 0; i < crimes.length; i++) {
          mapPoints.push(new google.maps.LatLng(crimes[i].y, crimes[i].x));
    }
    console.log('finished creating points')
    return mapPoints
  })
}