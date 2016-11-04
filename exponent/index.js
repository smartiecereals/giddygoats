import Exponent from 'exponent';
import React from 'react';
import UserInput from './userInput.js';
import HippoMap from './maps.js';
import MapLink from './mapLink.js';
import styles from './styles.js';
import AppLoading from './AppLoading.js';
import Example from './inputExample.js'
import Overlays from './Overlays';
import { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import axios from 'axios';
import API_KEY from './keys.js';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';



class App extends React.Component {
  constructor () {
    super ();
    this.state = {
      currLocation: {
        lat: 37.783697,
        lng: -122.408966
      },
      currAddress: null,
      destination: null,
      view: 'main',
      inputView: 'current'
    }

  this.handleUserInput = this.handleUserInput.bind(this);
  this.getSafestRoute = this.getSafestRoute.bind(this);
  this.getAddress = this.getAddress.bind(this);
  }

  componentDidMount() {
    this.setCurrLocation();
    this.getAddress('currLocation');
  }

  handleUserInput (type) {
    return function(text) {
      console.log(text, 'in handleUserTextInput');
      if(type === 'current') {
        this.setState({currAddress: text});
      }
      if(type === 'destination') {
        this.setState({destAddress: text});
      }
    }
  }


  getSafestRoute(destination, mobile, origin) {
    console.log('destination: ', destination);
    console.log('mobile: ', mobile);
    console.log('origin: ', origin);

    let originCoords = this.state.origin;
    let destinationCoords = destination;
    let locationURL = '/safestRoute?'

    let route = (route) => {
      return route.json();
    };
    route = route.bind(this)

    let jsonRoute = (jsonRoute) => {
      this.setState({safeRoute: jsonRoute});
      renderRoute(this.state.safeRoute.waypoints);
    };
    jsonRoute = jsonRoute.bind(this)

    let checkMobile = (mobile) => {
      if (mobile) {
        locationURL += ('&mobile=' + mobile)
      }
    }
    
    axios.get(locationURL, {
        params: {
          originLat: originCoords.lat,
          originLon: originCoords.lon,
          destLat: destinationCoords.lat,
          destLat: destinationCoords.lon
        }
      })
      .then(function(route) {
        console.log('indexSafetyGet Route', route)
        return route(route);
      }).then(function(jsonRoute) {
        console.log('indexSafetyGet JsonRoute', jsonRoute)
        jsonRoute(jsonRoute);
      })
      .catch(function (error) {
        console.log(error);
      });
      // TODO: This is a hard coded response. The api call should update
      // $scope.safeRoute = {"url":"https://www.google.com/maps?saddr=37.7901786,-122.4071487&daddr=37.7764555,-122.4082531+to:37.7854928,-122.4062062+to:37.7804776,-122.4125511+to:37.77676659999999,-122.4078552&via=1,2,3"
      //                   ,"waypoints":[{"lat":37.7901786,"lng":-122.4071487},{"lat":37.7854928,"lng":-122.4062062},{"lat":37.7804776,"lng":-122.4125511},{"lat":37.77676659999999,"lng":-122.4078552},{"lat":37.7764555,"lng":-122.4082531}]
      //                   ,"shortURL":"https://goo.gl/8eh9uX"}

      // $scope.renderRoute($scope.safeRoute.waypoints);
    }


  getAddress (currOrDest) {
    const context = this;
    let url ='https://maps.googleapis.com/maps/api/geocode/json?latlng=';
    let currLocation = this.state[currOrDest];
    let coords = currLocation.lat.toString() +','+ currLocation.lng.toString();
    let key = '&key=' + API_KEY;
    let getUrl = url+coords+key;
    axios.get(getUrl).then(function(geoLocation) {
      formattedAddress = geoLocation.data.results[1].formatted_address;
      context.setState({currAddress: formattedAddress})
    });
  }

  setCurrLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = {}
        initialPosition.lat = position.coords.latitude;
        initialPosition.lon = position.coords.longitude;
        console.log('setcurrlocation', initialPosition)
        this.setState({currLocation: initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  setInputView (view) {
    this.setState({inputView: view})
  }

  renderButton(key, fnOnPress, text) {
    return (
      <TouchableOpacity
        key={key}
        style={styles.button}
        onPress={fnOnPress}
      >
        <Text>{text}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    
    const {view} = this.state;
    
    if (view === 'main') {
      return (
        <View style={styles.container}>
          <View style={styles.map}>
            <Overlays 
              setInputView={this.setInputView}
              changeText={this.handleUserInput}
              provider = {PROVIDER_DEFAULT}
            />
          </View>
          {/*this.renderButton('origin', this.setInputView(, )}
          {this.renderButton('destination', this.setInputView())*/}
          <MapLink/>
        </View>
      )
    }
    if (view === 'origin') {
     
    }
    if (view === 'destination') {
     
    }

  }
  
}

Exponent.registerRootComponent(App);

