angular.module('app.controllers', [])

.controller('ViewController', function($scope) {


  $scope.submitHandler = function(destination, mobile) {
    console.log('inside the Submit Handler');
    console.log('destination: ', destination);
    console.log('mobile: ', mobile);

    navigator.geolocation.getCurrentPosition(function(location) {
      console.log('location in the "then" callback: ', location);
    })
  }
  
});




