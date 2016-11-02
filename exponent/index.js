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

//this.handleUserInput = this.handleUserInput.bind(this);
       //<Maps />
class App extends React.Component {
  constructor () {
    super ();
    this.state = {
        
    };

  this.handleUserDestinationInput = this.handleUserDestinationInput.bind(this);

  }

  getState () {
    return this.state;
  }

  handleUserDestinationInput (text) {
    console.log(text, 'in handleUserTextInput');
    this.setState({destination: text});
  }


  render() {
    return (
      <View style={styles.container}>
          <UserInput handleUserDestinationInput={this.handleUserDestinationInput}/>
   
          <MapLink/>
      </View>

    );
  }
}



Exponent.registerRootComponent(App);


