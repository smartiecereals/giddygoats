import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const deadline = 'December 25 2016'; // need to dynamically grab game time from database

class CountDownTimer extends Component {

	getTimeRemaining(endtime){
	  let time = Date.parse(endtime) - Date.parse(new Date());
	  
	  console.log(Date.parse(new Date()) );
	  let seconds = Math.floor( (time/1000) % 60 );
	  let minutes = Math.floor( (time/1000/60) % 60 );
	  let hours = Math.floor( (time/(1000*60*60)) % 24 );
	  let days = Math.floor( time/(1000*60*60*24) );
	  return {
	    'total': time,
	    'days': days,
	    'hours': hours,
	    'minutes': minutes,
	    'seconds': seconds
	  };
	};

	initializeClock(id, endtime){
	  let clock = document.getElementById(id);
	  let updateClock = function(){
	    let time = this.getTimeRemaining(endtime);
	    clock.innerHTML = 'days: ' + time.days + '<br>' +
	                      'hours: '+ time.hours + '<br>' +
	                      'minutes: ' + time.minutes + '<br>' +
	                      'seconds: ' + time.seconds;
	    if(time.total<=0){
	      clearInterval(timeinterval);
	    }
		}
	  updateClock();
	  let timeinterval = setInterval(updateClock,1000);
	}

  render() {
    const { amount, countdown} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.bubble}>
          <Text style={styles.amount}>{this.initializeClock('clockdiv', deadline)}</Text>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    );
  }
}

export default CountDownTimer;