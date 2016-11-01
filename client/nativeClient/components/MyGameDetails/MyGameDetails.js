import React, {Component} from 'react';
import styles from './styles';
import { View } from 'react-native';
import { Title } from 'native-base';
import moment from 'moment'


const MyGameDetails = (props) => {
	if (props.shouldRender) {
		return (
			<View style={styles.viewContainer}>
			 <View>
			   <Title style={styles.title}>Your game starts {moment(props.game.time).fromNow()}</Title>
			 </View>
			</View>
		)
	} else {
		return (
			<View style={styles.viewContainer}>
			 <View>
			   <Title style={styles.title}>Your game has started. Have Fun!!</Title>
			 </View>
			</View>
		)
	}
}

export default MyGameDetails;