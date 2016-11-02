import Exponent from 'exponent';
import React from 'react';

import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  /*
  //TODO: WELCOME SCREEN
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  */
  container: {
    flex: 1,
    flexDirection: 'column', 
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  userInput: {
    flex: 1,
    backgroundColor: 'pink',
  },

  textInput: {
    fontSize: 20,
    height: 20,
    textAlign: 'center',
    marginBottom: 10,
  },

  map: {
    backgroundColor: 'powderblue',
    flex: 4,    
    width: 500
  }
});

export default styles;