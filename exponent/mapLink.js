import React from 'react';
import styles from './styles.js';

import {View, Text, TextInput, Image} from 'react-native';

let MapLink = () => {
  return (
    <Image
      source={require('./assets/images/gradient90_1024_320.png')}
      style={styles.gradient}
    >
      <Image 
        source={require('./assets/images/app-icon-safe-hippo_96.png')} 
        style={styles.logo}
      />
      <Text style={styles.logoText}>Open in Google Maps</Text>
      <Image 
        source={require('./assets/images/toggle-crime_96.png')} 
        style={styles.toggleCrime}
      />
    </Image>
  );
}

export default MapLink;