import React from 'react';
import styles from './styles.js';

import {View, Text, TextInput} from 'react-native';

//onChangeText={(textInput) => this.setState({text})

let UserInput = () => {

    return (
        <View style={styles.inputContainer}>
          <TextInput style={styles.textBox}
            placeholder="Destination"
            //onChangeText={(text) => this.setState({text})}
          />
          <Text> User Input </Text>
        </View>

    );
  
}

export default UserInput