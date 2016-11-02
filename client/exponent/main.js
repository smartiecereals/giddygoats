import Exponent from 'exponent';
import React from 'react';
import UserInput from './userInput.js';
import Maps from './maps.js';
import MapLink from './mapLink.js';
import styles from './styles.js';

import {
  View,
  Text,
  TextInput
} from 'react-native';

class App extends React.Component {

  constructor () {
    super ()


  }


  render() {
    return (
      <View style={styles.container}>
          <UserInput test='yo' />
          <Maps />
          <MapLink/>
      </View>

    );
  }
}



Exponent.registerRootComponent(App);


