import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';
import Example from './inputExample.js'
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

class Overlays extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      circle: {
        center: {
          latitude: LATITUDE + SPACE,
          longitude: LONGITUDE + SPACE,
        },
        radius: 700,
      },
      polygon: [
        {
          latitude: LATITUDE + SPACE,
          longitude: LONGITUDE + SPACE,
        },
        {
          latitude: LATITUDE - SPACE,
          longitude: LONGITUDE - SPACE,
        },
        {
          latitude: LATITUDE - SPACE,
          longitude: LONGITUDE + SPACE,
        },
      ],
      polyline:
      [
      {"latitude":37.7836636,"longitude":-122.4091892},
      {"latitude":37.7862237,"longitude":-122.4097009},
      {"latitude":37.7867339,"longitude":-122.4046232},
      {"latitude":37.7876538,"longitude":-122.4034605},
      {"latitude":37.7870261,"longitude":-122.4030306},
      {"latitude":37.7867666,"longitude":-122.4033535}
      ]
    };
  }
  getPolyData() {
    // get polygon for grid area around walking route
  }

  getInputView(view) {
    if(view === 'current') {
      let changeText = this.props.changeText('current')
      return (
        <Example changeText={(text) => changeText(text)}/>
      );
    } 
    if(view === 'destination') {
      let changeText = this.props.changeText('destination')
      return (
        <Example changeText={(text) => changeText(text)}/>
      );
    } 
  }

  render() {
    const { region, circle, polygon, polyline } = this.state;
    const {provider, inputType, inputView} = this.props
    return (
      <View style={styles.container}>
        <MapView
          provider={provider}
          style={styles.map}
          initialRegion={region}
        >
        {this.getInputView(inputView)}
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
    );
  }
}

Overlays.propTypes = {
  provider: MapView.ProviderPropType,
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
  },
});
// <View style={styles.bubble}>
//             <Text>Render circles, polygons, and polylines</Text>
// </View>

module.exports = Overlays;
