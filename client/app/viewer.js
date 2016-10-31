angular.module('app.controllers', [])

.controller('ViewController', function($scope) {

  // mapLoaded and 'flipMapLoaded' are used to tell if the map has loaded.
  // We use them to determine when to display the spinner

  $scope.mapLoaded = true;
  $scope.showOriginField = false;
  $scope.safeRoute;
  $scope.originCoords = {};
  $scope.destinationCoords = {};

  // $scope.clearOrigin = function() {
  //   $scope.originCoords = {};
  // }

  // $scope.clearDestination = function() {
  //   $scope.destinationCoords = {};
  // }

  $scope.renderRoute = function(points) {
    var safeRoute = new google.maps.Polyline({
              path: points,
              geodesic: true,
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 2
            });
            safeRoute.setMap(map);
  }

  $scope.flipMapLoaded = function() {
    $scope.mapLoaded = !$scope.mapLoaded;
    $scope.$apply();
  };

  $scope.editHandler = function() {
    $scope.showOriginField = !$scope.showOriginField;
  };

  // setPos converts user's (lon,lat) to street address and append's 
  // address to the $scope object

  // $scope.setAddr = funcion(field, )
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
    console.log('destination: ', destination);
    console.log('mobile: ', mobile);
    console.log('origin: ', origin);

    //If the scope details exist, use those
    // $scope.originCoords = {};
    // $scope.destinationCoords = {};
    var locationURL = '/safestRoute?'
    
    // if ($scope.originCoords.lat && $scope.originCoords.lng) {
      locationURL += ('originLat=' + $scope.originCoords.lat)
      locationURL += ('&originLon=' + $scope.originCoords.lng)
    // } else {
    //   locationURL += ('strOrigin=' + origin.replace(/\s/g, '+'))
    // }

    // if ($scope.destinationCoords.lat && $scope.destinationCoords.lng) {
      locationURL += ('&destLat=' + $scope.destinationCoords.lat)
      locationURL += ('&destLon=' + $scope.destinationCoords.lng)
    // } else {
    //   locationURL += ('&strDest=' + destination.replace(/\s/g, '+'))
    // }


    if (mobile) {
      locationURL += ('&mobile=' + mobile)
    }
    

    fetch(locationURL)
    .then(function(route) {
      return route.json();
    })
    .then(function(jsonRoute) {
      $scope.safeRoute = jsonRoute
      $scope.renderRoute($scope.safeRoute.waypoints);
      $scope.$apply();
      //Update the heatmap with the new relevant data
    })
    .catch(function(err) {
      console.log('There was an error', err)
    })

    // TODO: This is a hard coded response. The api call should update
    // $scope.safeRoute = {"url":"https://www.google.com/maps?saddr=37.7901786,-122.4071487&daddr=37.7764555,-122.4082531+to:37.7854928,-122.4062062+to:37.7804776,-122.4125511+to:37.77676659999999,-122.4078552&via=1,2,3"
    //                   ,"waypoints":[{"lat":37.7901786,"lng":-122.4071487},{"lat":37.7854928,"lng":-122.4062062},{"lat":37.7804776,"lng":-122.4125511},{"lat":37.77676659999999,"lng":-122.4078552},{"lat":37.7764555,"lng":-122.4082531}]
    //                   ,"shortURL":"https://goo.gl/8eh9uX"}

    // $scope.renderRoute($scope.safeRoute.waypoints);

  }
  
});




