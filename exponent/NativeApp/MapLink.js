import React from 'react';
import styles from '../styles.js';
import * as Animatable from 'react-native-animatable';

import { View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Linking } from 'react-native';

let MapLink = (props) => {
  let button;
  let buttonWordMark = (
    <Animatable.Image
      source={ require('../assets/images/safe-hippo-wordmark.png') } 
      animation="fadeInUp" 
      style={ styles.wordmark } 
      duration={ 1500 }
    >
    </Animatable.Image>
  );
  let buttonGoogleMapsLink = (
   <Animatable.Text 
     animation="fadeInUp" 
     style={ { color:'#FFF' }, styles.googleMapsLink } 
     duration={1500}
   >
     Open in Google Maps  → 
   </Animatable.Text>
  );

 if (props.googleMapsUrl === 'https://www.google.com/') {
  button = buttonWordMark;
 } else {
  button = buttonGoogleMapsLink;
 } 

  return (
    <Image
      source={ require('../assets/images/gradient90_1024_320.png') }
      style={ styles.gradient }
    >
      <Image 
        source={ require('../assets/images/app-icon-safe-hippo_96.png') } 
        style={styles.logo}
      />
      <TouchableOpacity
      key='googleMapsUrl'
      style={ styles.googleMapsTouch }
      onPress={ ()=>Linking.openURL(props.googleMapsUrl) }
      >
      { button }
      </TouchableOpacity>
      <TouchableOpacity onPress={props.toggleCrime}>
        <Image 
          source={ require('../assets/images/toggle-crime_96.png') } 
          style={ styles.toggleCrime }
        />
      </TouchableOpacity>  
   </Image>
  );
}

export default MapLink;