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
    alignItems: 'stretch',
    backgroundColor: 'white',
  },

  inputContainer: {
    flex: 1,
    backgroundColor: 'powderblue',
  },

  textBox: {
    flex: 1,
    fontSize: 20,
    height: 20,
    textAlign: 'center',
    marginBottom: 10,
  },

  map: {
    backgroundColor: 'skyblue',
    flex: 4,    
  },

  mapLink: {
    backgroundColor: 'steelblue',
    flex: 1,    
  }

});

export default styles;