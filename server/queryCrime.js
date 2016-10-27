var urlHelper = require('./urlHelper')

//The purpose of this function is to construct the URL that will be used to query the Socrata SF crime data API
// Details on the docs of this API can be found at https://dev.socrata.com/foundry/data.sfgov.org/gxxq-x39z
module.exports = function createCrimeQuery (long = -122.444586, lat = 37.782745, radius = 1000) {
  //Get the current hour of the day (i.e. 22, 4, 12)
  var currDate = new Date()
  var currHour = currDate.getHours()

  //Use the helper functions time & location to get the correct string format for the time and location
  var queryString = "https://data.sfgov.org/resource/cuks-n6tp.json?"
  + "$limit=500&"
  + "$where=category in('SEX OFFENSES, FORCIBLE','ASSAULT', 'LOITERING','LARCENY/THEFT','KIDNAPPING','WEAPON LAWS','DISORDERLY CONDUCT','DRUNKENNESS','DRUG/NARCOTIC')"
  + " AND " + urlHelper.time(currHour, 1)
  + " AND " + urlHelper.location(lat, long, radius)
  + "&$order=date DESC";

  return queryString
}