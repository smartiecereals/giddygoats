function getCrimeAPI (long, lat) {
  var currDate = new Date()
  var currHour = currDate.getHours()

  //Fetch from official api
  var queryString = "https://data.sfgov.org/resource/cuks-n6tp.json?"
  + "$limit=500&"
  + "$where=category in('SEX OFFENSES, FORCIBLE','ASSAULT', 'LOITERING','LARCENY/THEFT','KIDNAPPING','WEAPON LAWS','DISORDERLY CONDUCT','DRUNKENNESS','DRUG/NARCOTIC')"
  + " AND " + time(currHour, 1)
  + " AND " + location(lat, long, 1000)
  + "&$order=date DESC";

  console.log('queryString', queryString)
  return new Promise(function(resolve, reject) {
  resolve(fetch(queryString))
  })
  .then(function(data){
    return data.json();
  })
  .then(function(records) {
    return records;
  })
}

function getPoints(long, lat) {

  var mapPoints = [];
  
  return new Promise(function(resolve, reject) {
    resolve(getCrimeAPI(long, lat))
  })
  .then(function(crimes) {
    for (let i = 0; i < crimes.length; i++) {
      console.log(crimes[i].y, crimes[i].x, crimes[i].date)
          mapPoints.push(new google.maps.LatLng(crimes[i].y, crimes[i].x));
    }
    console.log('finished creating points')
    return mapPoints
  })
  //create an array for google maps coordinates
}