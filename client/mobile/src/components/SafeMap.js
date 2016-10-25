import React from 'react';
// import { View } from 'react-native';
import MapView from 'react-native-maps';


const points = [
{ latitude: 37.78825, longitude: -122.4324 },
{ latitude: 37.78825, longitude: -122.4325 },
{ latitude: 37.78827, longitude: -122.4325 },
{ latitude: 37.78828, longitude: -122.4326 },
{ latitude: 37.78829, longitude: -122.4327 },
{ latitude: 37.78827, longitude: -122.4325 },
{ latitude: 37.78828, longitude: -122.4326 },
{ latitude: 37.78829, longitude: -122.4327 },
{ latitude: 37.78827, longitude: -122.4325 },
{ latitude: 37.78828, longitude: -122.4326 },
{ latitude: 37.78829, longitude: -122.4327 },
{ latitude: 37.78827, longitude: -122.4325 },
{ latitude: 37.78828, longitude: -122.4326 },
{ latitude: 37.78829, longitude: -122.4327 },
{ latitude: 37.78825, longitude: -122.4324 },
{ latitude: 37.78825, longitude: -122.4325 },
{ latitude: 37.78827, longitude: -122.4325 },
{ latitude: 37.78828, longitude: -122.4326 },
{ latitude: 37.78829, longitude: -122.4327 },
{ latitude: 37.78827, longitude: -122.4325 },
{ latitude: 37.78828, longitude: -122.4326 },
{ latitude: 37.78829, longitude: -122.4327 },
{ latitude: 37.78827, longitude: -122.4325 },
{ latitude: 37.78828, longitude: -122.4326 },
{ latitude: 37.78829, longitude: -122.4327 },
{ latitude: 37.78827, longitude: -122.4325 },
{ latitude: 37.78828, longitude: -122.4326 },
{ latitude: 37.78829, longitude: -122.4327 },
{ latitude: 37.78829, longitude: -122.4328 }
];

const SafeMap = ({ onRegionChange, region }) => {
	console.log('MapView', MapView);
	console.log('MapView.Heatmap', MapView.Heatmap);
	return (
		<MapView
		style={styles.mapStyle}
		initialRegion={region}
		onRegionChange={onRegionChange}
		>
		<MapView.Heatmap points={points} />
		</MapView>
	);
};

const styles = {
	mapStyle: {
		flex: 1
	}
};
export default SafeMap;
