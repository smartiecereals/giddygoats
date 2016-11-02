import Exponent from 'exponent';
import React from 'react';
import styles from './styles.js';

import {
  View,
  Text,
  TextInput
} from 'react-native';


class App extends React.Component {
  //onChangeText={(textInput) => this.setState({text})
  render() {
    return (
      <View style={styles.container}>

        <View style={styles.userInput}/>
          <TextInput 
            style={styles.textInput}
            placeholder="Destination"
          />

        <View style={styles.map}/>

      </View>
    );
  }
}



Exponent.registerRootComponent(App);


