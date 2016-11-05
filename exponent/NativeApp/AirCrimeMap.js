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
// const LATITUDE = 37.78825;
// const LONGITUDE = -122.4324;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// const SPACE = 0.01;

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
    const { region, } = this.state;

    const {
      provider,
      destLocation,
      currLocation,
      safeRoute, 
      originIsSync,
      destinationIsSync,
      getCrimeStats, 
      crimeData,
      getSafestRoute
    } = this.props

    let context = this;
    let HeatMap = [];
    var originMarker;
    var destMarker;
    crimePoints = crimeData || [];
    let polyline = safeRoute || [];

    if (!originIsSync() && currLocation) {
      getCrimeStats();
    }
    if (!destinationIsSync() && destLocation ||  !originIsSync() && currLocation && destLocation) {
      getSafestRoute();
    }
    if (this.props.showCrime) {
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
          coordinate={{latitude: destLocation.lat, longitude: destLocation.lng}} />
    }
    return (
      <View style={styles.container}>
          <MapView
            provider={provider}
            style={styles.map}
            initialRegion={region}
          > 
          {destMarker}
          <MapView.Marker 
          coordinate={{latitude: currLocation.lat, longitude: currLocation.lng}}
          pinColor="#2E7575" />  
          {HeatMap}
          <MapView.Polyline
            coordinates={polyline}
            strokeColor="rgba(0,0,200,0.5)"
            strokeWidth={3}
            lineDashPattern={[5, 2, 3, 2]}
          /> 
          </MapView>
          <View style={styles.buttonContainer}>
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
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  }
});


export default AirCrimeMap
