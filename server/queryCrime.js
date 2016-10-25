var urlHelper = require('./urlHelper')

module.exports = function createCrimeQuery (long = -122.444586, lat = 37.782745, radius = 1000) {
  var currDate = new Date()
  var currHour = currDate.getHours()
  console.log('long, lat in the createCrimeQuery', long, lat)
  //Fetch from official api
  var queryString = "https://data.sfgov.org/resource/cuks-n6tp.json?"
  + "$limit=500&"
  + "$where=category in('SEX OFFENSES, FORCIBLE','ASSAULT', 'LOITERING','LARCENY/THEFT','KIDNAPPING','WEAPON LAWS','DISORDERLY CONDUCT','DRUNKENNESS','DRUG/NARCOTIC')"
  + " AND " + urlHelper.time(currHour, 1)
  + " AND " + urlHelper.location(lat, long, radius)
  + "&$order=date DESC";

  return queryString
}