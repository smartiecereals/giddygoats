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
}

module.exports = HippoMap;
