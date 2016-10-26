angular.module('app.controllers', [])

.controller('ViewController', function($scope) {

  $scope.mapLoaded = true;

  $scope.flipMapLoaded = function() {
    $scope.mapLoaded = !$scope.mapLoaded;
    $scope.$apply();
  };


  $scope.setPos = function(currentPosition) {
    
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + currentPosition.lat + ',' + currentPosition.lng + '&key=AIzaSyBgXiNUqN5OlBHE7hAVxV9phqHQrfKldXw';
    fetch(url)
    .then(function(addressData) {
      return addressData.json()
    })
    .then(function(addressDataJSON) {
      console.log('addressDataJSON :', addressDataJSON);
      var longAddress = addressDataJSON.results[0].formatted_address;
      var arrSplit = "25 Mason St, San Francisco, CA 94102, USA".split(',');
      shortAddress = arrSplit[0] + ',' + arrSplit[1];
      currentPosition.address = shortAddress;
      $scope.pos = currentPosition;
      $scope.$apply();
      console.log('$scope.pos :', $scope.pos);
    })

  }

  $scope.submitHandler = function(destination, mobile) {
    console.log('inside the Submit Handler');
    console.log('destination: ', destination);
    console.log('mobile: ', mobile);

    navigator.geolocation.getCurrentPosition(function(location) {
      console.log('location in the "then" callback: ', location);
    })
  }
  
});




