exports.time = function (time, timePeriod) {
  var windowTimes = [];
  //Will convert a time such as 25, into 1. Or -2 into 22
  function convertIrregularTime(irrTime) {
    var remainder = irrTime % 24;

    if (remainder >= 0) {
      return remainder;
    } else {
      return 24 + remainder;
    }
  }

  //Will pad a time to have leading 0's i.e. 06, 09, 23, 00
  function padTime (time) {
    var time = time + ''
    var padding = "00"
    var padded = padding.substring(0, padding.length - time.length) + time
    return padded
  }

  //Populate windowTimes to be an array of numbers ['23, '00', '01', '02', '03']
  var start = time - timePeriod
  var finish = time + timePeriod
  for (var i = start; i <= finish; i++) {
    windowTimes.push(padTime(convertIrregularTime(i)))
  }

  //Add the syntax for the web query i.e. (time like '00:%25' or time like '01:%25' or time like '02:%25')
  var timeQuery = windowTimes.join(":%25' or time like '")
  timeQuery = "(time like '" + timeQuery + ":%25')"

  return  timeQuery
}

exports.location = function (long, lat, radius) {
  return 'within_circle(location, ' + long + ', ' + lat + ', 1000)';
}