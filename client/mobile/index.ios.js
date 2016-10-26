/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';
import Header from './src/components/Header';
import SafeMap from './src/components/SafeMap';

export default class mobile extends Component {

state = {
	region: {
	latitude: 0,
	longitude: 0,
	latitudeDelta: 0.0922,
	longitudeDelta: 0.0421,
	}
}


onRegionChange(region) {
  this.setState({ region });
}

componentWillMount() {
	this.setState({
		region: {
			latitude: 37.78825,
			longitude: -122.4324,
			latitudeDelta: 0.0922,
			longitudeDelta: 0.0421,
		}
	});
}

 render() {
    return (
    <View style={styles.mapContainer}>
		<Header headerText={'Safe Hippo'} />
		<SafeMap 
			onRegionChange={this.onRegionChange.bind(this)}
			region={this.state.region}
		/>
	</View>
    );
  }
}

const styles = {
	mapContainer: {
		flex: 1
	}
};

AppRegistry.registerComponent('mobile', () => mobile);
