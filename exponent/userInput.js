import React from 'react';
import styles from './styles.js';
import {View, Text, TextInput} from 'react-native';
import Search from './googlePlacesAutocomplete.js';

let UserInput = (props) => {

  var origin = props.origin || '944 Market Street';
  
  return (

    <View style={styles.inputContainer}>
      <TextInput style={styles.textBox}
        placeholder="Destination"
        onChangeText={(text) => props.handleUserDestinationInput(text)}
      />
    </View>

  );
  
}

export default UserInput