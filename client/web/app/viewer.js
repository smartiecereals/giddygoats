angular.module('app.controllers', [])

.controller('ViewController', function($scope) {

  // mapLoaded and 'flipMapLoaded' are used to tell if the map has loaded.
  // We use them to determine when to display the spinner

  $scope.mapLoaded = true;
  $scope.showOriginField = false;

  $scope.flipMapLoaded = function() {
    $scope.mapLoaded = !$scope.mapLoaded;
    $scope.$apply();
  };

  $scope.editHandler = function() {
    $scope.showOriginField = !$scope.showOriginField;
  };

  // setPos converts user's (lon,lat) to street address and append's 
  // address to the $scope object

  $scope.setPos = function(currentPosition) {
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + currentPosition.lat + ',' + currentPosition.lng + '&key=AIzaSyBgXiNUqN5OlBHE7hAVxV9phqHQrfKldXw';
    fetch(url)
    .then(function(addressData) {
      return addressData.json()
    })
    .then(function(addressDataJSON) {
      var longAddress = addressDataJSON.results[0].formatted_address;
      var arrSplit = longAddress.split(',');
      shortAddress = arrSplit[0] + ',' + arrSplit[1];
      currentPosition.address = shortAddress;
      $scope.pos = currentPosition;
      $scope.$apply();
    })
  }

  // submitHandler takes the form values and does [INSERT PURPOSE]

  $scope.submitHandler = function(destination, mobile, origin) {
    console.log('inside the Submit Handler');
    console.log('destination: ', destination);
    console.log('mobile: ', mobile);
    console.log('origin: ', origin);

    // if user entered an address i.e. they do NOT want to depart
    // from their current location

    var url = '/shortestRoute?sourceLat=' + origin.lat + '&sourceLon=' + origin.lng + '&destLat=' + destination.lat + '&destLon=' + destination.lng; 

    fetch(url)
    .then(function(data) {
      console.log('data', data);

      // render polyline from data
      // repopulate heat map


      var flightPath = new google.maps.Polyline({
        path: JSON.parse(data),
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      }); 

      flightPath.setMap(map);
    })
    // if (typeof(origin)==="string") {
    //   //
    // }

    // navigator.geolocation.getCurrentPosition(function(location) {
    //   console.log('location in the "then" callback: ', location);
    // })
  }
  
});




