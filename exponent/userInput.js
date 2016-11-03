import React from 'react';
import styles from './styles.js';

import {View, Text, TextInput} from 'react-native';

let UserInput = (props) => {

  var origin = props.origin;

    return (
        <View style={styles.inputContainer}>
          <TextInput style={styles.textBox}
            placeholder={origin}
            onChangeText={(text) => props.handleUserOriginInput(text)}
          />
          <TextInput style={styles.textBox}
            placeholder="Destination"
            onChangeText={(text) => props.handleUserDestinationInput(text)}
          />
          <Text> User Input </Text>
        </View>

    );
  
}

export default UserInput