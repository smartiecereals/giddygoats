import React from 'react';
// import { View } from 'react-native';
import MapView from 'react-native-maps';


const SafeMap = ({ onRegionChange, region }) => {
	return (
	<MapView
	style={styles.mapStyle}
	initialRegion={region}
	onRegionChange={onRegionChange}
	/>
	);
};

const styles = {
	mapStyle: {
		flex: 1
	}
};
export default SafeMap;
