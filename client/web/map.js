// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var lat = 37.782745;
var long = -122.444586;

function getCrimeAPI (lat, long, date, time) {
  //Fetch from official api
  return new Promise(function(resolve, reject) {
  resolve(fetch('https://data.sfgov.org/resource/cuks-n6tp.json?date=2010-01-02T00:00:00.000'))
  })
  .then(function(data){
    return data.json();
  })
  .then(function(records) {
    return records;
  })

}

var map, heatmap;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 37.775, lng: -122.434},
    mapTypeId: 'roadmap'
  });

  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  console.log(navigator.geolocation)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  getPoints()
  .then(function(mapPoints) {
    console.log('About to create heatmap')
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: mapPoints,
      // data: ([new google.maps.LatLng(37.7778241673064,  -122.407999186749),
      //        new google.maps.LatLng(-122.407999186749, 37.7778241673064)]),
      map: map
    });
    console.log('heatmap.data', heatmap.data)
    console.log('heatmap.map', heatmap.map)
  })

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

// Heatmap data: 500 Points
function getPoints() {

  var mapPoints = [];
  
  return new Promise(function(resolve, reject) {
    resolve(getCrimeAPI())
  })
  .then(function(crimes) {
    for (let i = 0; i < crimes.length; i++) {
          console.log('crimes[i]', crimes[i].x, crimes[i].y);
          mapPoints.push(new google.maps.LatLng(crimes[i].y, crimes[i].x));
    }
    console.log('finished creating points')
    return mapPoints
  })
  //create an array for google maps coordinates
  }

  window.getCrimeAPI = getCrimeAPI;