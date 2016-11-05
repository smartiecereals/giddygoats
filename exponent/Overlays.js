import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Linking
} from 'react-native';
import Example from './inputExample.js'
import MapView from 'react-native-maps';
import axios from 'axios';

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
      shortURL: 'bla',
      data: [],
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polyline:
      [
      {"latitude":37.7836636,"longitude":-122.4091892}
      ]
    };
  }
  componentDidMount () {
    console.log(this.props, 'LOOKING FOR PROPS')
    context = this;
    axios.get('http://138.68.62.73:3000/testDanger?long=-122.40898400000003&lat=37.7865518&radius=.01')
      .then(function(res) {
        let crimeData = res.data.map(function(dataPoint) {
          return {longitude: dataPoint[0], latitude:dataPoint[1]}
        })
        context.setState({
          data: crimeData
        })
    })
      console.log('COMPONENT DID MOUNT OVERLAYS')
  }

  getUrl (originLon, originLat, destLon, destLat) {
    context = this;
    axios.get('https://safehippo.com/safestRoute?originLat=37.7836883&originLon=-122.40898400000003&destLat=37.7865518&destLon=-122.40307710000002')
      .then(function(res) {
        context.setState({
          url: res.shortURL
        })
    })
  }

  getPolyData() {
    // get polygon for grid area around walking route
  }


  render() {
    const { region } = this.state;
    const {provider, safeRoute, destLocation, currLocation, destinationIsSync, getSafestRoute} = this.props;
    let polyline = safeRoute || this.state.polyline;
    console.log('polyLine', polyline)
    var HeatMap = []
    if (!destinationIsSync() && destLocation) {
      getSafestRoute()
    }
    if(this.state.data.length > 0) {
      HeatMap = this.state.data.map((dataObj, index) => {
        return (
          <MapView.Circle
            key={index}
            center={dataObj}
            radius={20}
            fillColor="rgb(66, 244, 137, .30)"
            strokeColor="rgb(244, 86, 66)"
          /> 
        )
      })
    }
    return (
      <View style={styles.container}>
        <MapView
          provider={provider}
          style={styles.map}
          initialRegion={region}
        >
          <MapView.Polyline
            coordinates={polyline}
            strokeColor="rgba(0,0,200,0.5)"
            strokeWidth={3}
            lineDashPattern={[5, 2, 3, 2]}
          />
          
          {HeatMap}
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

// <MapView.Marker 
//           coordinate={circle.center} 
//           onPress={() => Linking.openURL('https://www.google.com/maps/dir/37.7836636,-122.4091892/37.7852914,-122.4095192/37.7857207,-122.4059059/37.7849899,-122.4048666/37.7850684,-122.4047512/37.7853724,-122.404164/37.7861407,-122.4031622/37.7864958,-122.4036929/37.7867666,-122.4033535/@37.7852649,-122.4106916,16z/data=!3m1!4b1!4m2!4m1!3e2')}
//           >
//           </MapView.Marker>
