import Exponent from 'exponent';
import React from 'react';
import UserInput from './userInput.js';
import HippoMap from './maps.js';
import MapLink from './mapLink.js';
import styles from './styles.js';

import {
  View,
  Text,
  TextInput
} from 'react-native';


class App extends React.Component {
  constructor () {
    super ();
    this.state = {
    };

  this.handleUserDestinationInput = this.handleUserDestinationInput.bind(this);
  this.getState = this.getState.bind(this);
  }

  componentDidMount() {
    this.getCurrLocation();
  }

  handleUserDestinationInput (text) {
    console.log(text, 'in handleUserTextInput');
    this.setState({destination: text});
  }
  getLocationData() {

  }

  getCurrLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = {}
        initialPosition.lat = position.coords.latitude;
        initialPosition.long = position.coords.longitude;
        this.setState({currLocation: initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }


  render() {
    return (
      <View style={styles.container}>
          <UserInput handleUserDestinationInput={this.handleUserDestinationInput}/>
          <HippoMap />
          <MapLink/>
      </View>
    )
  }
}



Exponent.registerRootComponent(App);


