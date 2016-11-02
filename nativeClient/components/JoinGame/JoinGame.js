import React, {Component} from 'react';
import styles from './styles';
import { View, Image } from 'react-native';
import { Title, Button, Thumbnail } from 'native-base';
import Hr from 'react-native-hr';
import moment from 'moment';

const imagePaths = [<Thumbnail key={1} style={styles.thumbnail} size={60} source={require('../images/profile1.png')} />,
                    <Thumbnail key={2} style={styles.thumbnail} size={60} source={require('../images/profile2.png')} />,
                    <Thumbnail key={3} style={styles.thumbnail} size={60} source={require('../images/profile3.png')} />,
                    <Thumbnail key={4} style={styles.thumbnail} size={60} source={require('../images/profile4.png')} />,
                    <Thumbnail key={5} style={styles.thumbnail} size={60} source={require('../images/profile5.png')} />,
                    <Thumbnail key={6} style={styles.thumbnail} size={60} source={require('../images/profile6.png')} />,
                    <Thumbnail key={7} style={styles.thumbnail} size={60} source={require('../images/profile7.png')} />,
                    <Thumbnail key={8} style={styles.thumbnail} size={60} source={require('../images/profile8.png')} />
];

const lineColor = 'rgba(0, 0, 0, .5)'
const joinGameBtnColor = '#20DA9B';

class JoinGame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
			<View style={styles.container}>
        <View style={styles.innerContainer}>
          
          <Title style={styles.mainTitle}>{this.props.game.court.name}</Title>
          <Image source={{uri: this.props.game.court.imageUrl}} style={styles.image} />

          <Title style={styles.title}>Game Type</Title>
          <Hr lineColor={lineColor}/>
          <Title style={styles.stats}>{this.props.game.type}</Title>

          <Title style={styles.title}>Start Time</Title>
          <Hr lineColor={lineColor}/>
          <Title style={styles.stats}>{moment(this.props.game.time).format('h:MMA')}</Title>

          <Title style={styles.title}>Current Players</Title>
          <Hr lineColor={lineColor}/>

          <View style={styles.wrapper}>
            {imagePaths.slice(0, this.props.game.playerIds.length)}
          </View>



          <Button 
            transparent
            onPress={ () => this.props.exitJoinGame() } 
            textStyle={styles.xtext} 
            style={styles.x}>X</Button>
          <Button 
            block
            onPress={ () => this.props.joinGame() }
            style={styles.button}>Join Game!</Button>
        </View>
			</View>
		);
  }
}

export default JoinGame;