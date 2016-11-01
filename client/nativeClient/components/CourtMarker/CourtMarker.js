import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

class CourtMarker extends Component {
  render() {
    const { name } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.bubble}>
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    );
  }
}

export default CourtMarker;