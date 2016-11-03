import React from 'react';
import styles from './styles.js';
import {
  Platform,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Switch,
} from 'react-native';
import { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';

import Overlays from './Overlays';

const IOS = Platform.OS === 'ios';
const ANDROID = Platform.OS === 'android';

class HippoMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
      useGoogleMaps: ANDROID,
    };
  }
  render() {
  return (
        <View style={styles.map}>
          <Overlays provider = {PROVIDER_DEFAULT}/>
        </View>

    );
  }
}

module.exports = HippoMap;
