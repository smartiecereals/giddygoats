import React from 'react';
import { Image, View, TouchableHighlight } from 'react-native';
import { Footer, FooterTab, Button, Title } from 'native-base';
import styles from './styles';

class Foot extends React.Component {
  constructor(props) {
    super(props);
  }

  renderGameInfo() {
    if (this.props.game) {
      return (
        <TouchableHighlight onPress={() => this.props.joinGame()} style={styles.container}>
          <View style={styles.container}>
            <Image source={{uri: this.props.game.court.imageUrl}} style={styles.image} />
            <Title style={styles.name}>{this.props.game.court.name}</Title>
          </View>
        </TouchableHighlight>
      )
    } else {
      return (  
        <View><Title>Please select a game</Title></View>
      )
    }
  }

  renderCourtInfo() {
    if (this.props.court) {
      return (
        <TouchableHighlight onPress={() => this.props.createGame()} style={styles.container}>
          <View style={styles.container}>
            <Image source={{uri: this.props.court.imageUrl}} style={styles.image} />
            <Title style={styles.name}>{this.props.court.name}</Title>
          </View>
        </TouchableHighlight>
      )
    } else {
      return (  
        <View><Title>Please select a court</Title></View>
      )
    }
  }

  render() {
    return (
      <Footer height={100} style={styles.footer}>
        { this.props.mode === 'Current Games' ? this.renderGameInfo() : this.renderCourtInfo() }
      </Footer>
    ) 
  }
}

export default Foot;