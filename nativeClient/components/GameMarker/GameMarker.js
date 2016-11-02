import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

class GameMarker extends Component {
  render() {
    const { amount, countdown} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.bubble}>
          <Text style={styles.amount}>{`${countdown}, ${amount} ${amount === 1 ? 'player':'players'}`}</Text>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    );
  }
}

export default GameMarker;