// ----------------------------------------------------
// --------- FORMATS CRIME DATA HELPER FUNCTION -------
// ----------------------------------------------------

// formatCrimeData takes in data from the SF Data API and
// formats it into an array of objects. Each object has a format
// like:

  // { lat: "137.533", lon: "34.653", count: 5 }

// This example means that 5 criminal events took place at the specified
// location.

var formatCrimeData = function(crimeData) {

  // ----------------------------------------------------
  // - HASHMAP, COUNT HOW MANY CRIMES OCCURED SOMEWHERE -
  // ----------------------------------------------------

  // generateHashMap is a helper function that takes in crimeData as an input.
  // It then that populates a storage object with keys equal to a stringified 
  // longitude-lattitude object, and values equal to how many times that
  // longitude-lattitude object occurs in the crimeData.

  // An example output of generateHashMap:

  // {"lat: '123.234', long: '43.453'" : 4, "lat: '33.234', long: '12.344'" : 3 }

  // This means that 4 crimes occured at the first location, and 3 crimes occured 
  // at the second location.

  var storage = {};

  var generateHashMap = function(crimeData) {
    for (var i = 0; i < crimeData.length; i++) {
      //lat and long are strings rounded to 3 decimal places
      var lat = Number(crimeData[i].y).toFixed(3);
      var lon = Number(crimeData[i].x).toFixed(3);
      var key = JSON.stringify({lat: lat, lon: lon});

      if (!storage[key]) {
        storage[key] = 1;
      } else {
        storage[key] += 1;
      }
    }
    return storage;
  };

  var hashmap = generateHashMap(crimeData);

  // ----------------------------------------------------
  // --- CONVERT HASHMAP INTO AN ARRAY FULL OF OBJECTS --
  // ----------------------------------------------------

  var convertHashToArray = function(hashmap) {
    var newStorage = [];

    for (var key in hashmap) {
      // crime object without count key
      var obj = JSON.parse(key);
      // add count to crime object
      obj.count = hashmap[key]
      newStorage.push(obj);
    }
    return newStorage;
  }

  return convertHashToArray(hashmap);
};




