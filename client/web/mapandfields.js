var map, heatmap;
var autocomplete;

//This function will be called once the google api script in index.html


function initMapAndFields () {
  initMap();
  initAutocomplete();
}

function initAutocomplete() {
   // Create the autocomplete object, restricting the search to geographical
   // location types.
   origin = new google.maps.places.Autocomplete(
     (document.getElementById('origin-field')),
     {types: ['geocode']});

   destination = new google.maps.places.Autocomplete(
     (document.getElementById('destination-field')),
     {types: ['geocode']});

   // origin.addListener('place_changed', setAddress)
   origin.addListener('place_changed', setOrigin)
   destination.addListener('place_changed', setDestination)
 }

 function setDestination() {
  var place = destination.getPlace();
  var scope = angular.element(document.querySelector('[ng-controller="ViewController"]')).scope()

  scope.destinationCoords.lat = place.geometry.location.lat()
  scope.destinationCoords.lng = place.geometry.location.lng()
};

 function setOrigin() {
  var place = origin.getPlace();
  var scope = angular.element(document.querySelector('[ng-controller="ViewController"]')).scope()

  scope.originCoords.lat = place.geometry.location.lat()
  scope.originCoords.lng = place.geometry.location.lng()
};


function initMap() {

  //Create the raw map
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

      var circle = new google.maps.Circle({
        center: pos,
        radius: position.coords.accuracy
      });
      origin.setBounds(circle.getBounds());
      destination.setBounds(circle.getBounds());

      angular.element(document.querySelector('[ng-controller="ViewController"]')).scope().setPos(pos);
      angular.element(document.querySelector('[ng-controller="ViewController"]')).scope().originCoords = pos;
      //Update global variables to be query the API for relevant radius
      userLat = position.coords.latitude;
      userLong = position.coords.longitude;

      //Center the map on the location and add marker
      infoWindow.setPosition(pos);
      infoWindow.setContent('<div class="map-panel"><img src="http://res.cloudinary.com/small-change/image/upload/v1477434563/hippi_mg7ts4.png" class="hippo-small-logo"/>YOU ARE HERE</div>');

      map.setCenter(pos);

      fetch('/testDanger' + "?long=" + position.coords.longitude + "&lat=" + position.coords.latitude)
      //Get an array of all of the long/lat co-ordinates from crime in current region
      .then(function(rawData) {
        return rawData.json();
      })
      .then(function(crimePoints) {
      //Process these co-ordinates and create an array of the data points that google heat maps API requires
      var mapPoints = [];
      for (let i = 0; i < crimePoints.length; i++) {
        mapPoints.push(new google.maps.LatLng(crimePoints[i][1], crimePoints[i][0]));
      }

      return mapPoints
    })
      .then(function(mapPoints) {
        //Create the heatmap from the array created in the previous step
        heatmap = new google.maps.visualization.HeatmapLayer({
          data: mapPoints,
          map: map
        });
        angular.element(document.querySelector('[ng-controller="ViewController"]')).scope().flipMapLoaded();
      })

    }), function() {
      handleLocationError(true, infoWindow, map.getCenter());
    };
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

/*===============================
Not currently used: but keep them
===============================*/

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