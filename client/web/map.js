// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

var userLat = 37.782745;
var userLong = -122.444586;

var map, heatmap;


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 37.775, lng: -122.434},
    mapTypeId: 'roadmap'
  });

  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      //Update global variables to be query the API for relevant radius
      console.log('set the window user location')
      userLat = position.coords.latitude;
      userLong = position.coords.longitude;

      //TODO: Run the query for this location??

      infoWindow.setPosition(pos);
      infoWindow.setContent('You are here');
      map.setCenter(pos);
      console.log('position.coords.longitude, position.coords.latitude', position.coords.longitude, position.coords.latitude)
      //queryCrime

      fetch('/testDanger' + "?long=" + position.coords.longitude + "&lat=" + position.coords.latitude)
      .then(function(rawData) {
        return rawData.json();
      })
      .then(function(crimePoints) {
        var mapPoints = [];
        for (let i = 0; i < crimePoints.length; i++) {
              mapPoints.push(new google.maps.LatLng(crimePoints[i][1], crimePoints[i][0]));
        }
        console.log('crimePoints', crimePoints)

        console.log('finished creating points')
        return mapPoints
      })
      .then(function(mapPoints) {
        heatmap = new google.maps.visualization.HeatmapLayer({
          data: mapPoints,
          map: map
        });
      })

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }



}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  var gradient = [
  'rgba(0, 255, 255, 0)',
  'rgba(0, 255, 255, 1)',
  'rgba(0, 191, 255, 1)',
  'rgba(0, 127, 255, 1)',
  'rgba(0, 63, 255, 1)',
  'rgba(0, 0, 255, 1)',
  'rgba(0, 0, 223, 1)',
  'rgba(0, 0, 191, 1)',
  'rgba(0, 0, 159, 1)',
  'rgba(0, 0, 127, 1)',
  'rgba(63, 0, 91, 1)',
  'rgba(127, 0, 63, 1)',
  'rgba(191, 0, 31, 1)',
  'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

function renderHeat(long, lat) {
  getPoints(long, lat)
  .then(function(mapPoints) {
    console.log('About to create heatmap')
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: mapPoints,
      map: map
    });
  })
}