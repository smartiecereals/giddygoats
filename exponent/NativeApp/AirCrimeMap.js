import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Linking
} from 'react-native';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;

class AirCrimeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      region: {
        latitude: this.props.currLocation.lat,
        longitude: this.props.currLocation.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0922 * ASPECT_RATIO,
      }
    }
  }
  render () {
    const { region } = this.state;
    const { provider,
      destLocation,
      currLocation,
      safeRoute, 
      crimeData,
      showCrime,
      getSafestRoute,
      getCrimeStats, 
      originIsSync,
      destinationIsSync } = this.props
    let HeatMap = [];
    let crimePoints = crimeData || [];
    let polyline = safeRoute || [];
    let originMarker;
    let destMarker;

    if (!originIsSync() && currLocation) {
      getCrimeStats();
    }
    if (
      !destinationIsSync() && destLocation 
      ||
      !originIsSync() && currLocation && destLocation)
      {
        getSafestRoute();
      }
    if (showCrime) {
      HeatMap = crimePoints.map((dataObj, index) => {
            return (
              <MapView.Circle
                key={index}
                center={dataObj}
                radius={20}
                fillColor="rgba(66, 244, 137, 0.3)"
                strokeColor="rgba(244, 86, 66, 1)"
              /> 
            )
          })      
    }
    if(destLocation) {
      destMarker = <MapView.Marker 
          coordinate={{ latitude: destLocation.lat, longitude: destLocation.lng }} />
    }
    return (
      <View style={ styles.container }>
          <MapView
            provider={ provider }
            style={ styles.map }
            initialRegion={ region }
          > 
          {destMarker}
          <MapView.Marker 
          coordinate={{latitude: currLocation.lat, longitude: currLocation.lng}}
          pinColor="#2E7575" />  
          {HeatMap}
          <MapView.Polyline
            coordinates={ polyline }
            strokeColor="rgba(0,0,200,0.5)"
            strokeWidth={3}
            lineDashPattern={[5, 2, 3, 2]}
          /> 
          </MapView>
          <View style={ styles.buttonContainer }>
          </View>
        </View>
    )
  }
}


AirCrimeMap.propTypes = {
  provider: MapView.ProviderPropType
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});


export default AirCrimeMap
