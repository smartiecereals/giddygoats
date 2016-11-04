import Exponent from 'exponent';
import React from 'react';
import UserInput from './userInput.js';
import HippoMap from './maps.js';
import MapLink from './mapLink.js';
import styles from './styles.js';
// not working: show loading screen until full app load
// https://docs.getexponent.com/versions/v9.0.0/sdk/app-loading.html
// import AppLoading from './AppLoading.js';
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
      view: 'Hippo',
    };

  this.handleUserInput = this.handleUserInput.bind(this);
  this.handleUserCoords = this.handleUserCoords.bind(this);
  this.getSafestRoute = this.getSafestRoute.bind(this);
  this.getAddress = this.getAddress.bind(this);
  this.getInputView = this.getInputView.bind(this)
  }

  componentDidMount() {
    this.getAddress('currLocation');
    this.alertIfLocationsDisabledAsync();
    this.getLocationPermissionsAsync();
  }

  async getLocationPermissionsAsync() {
    const { Location, Permissions } = Exponent;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log(status);
    if (status === 'granted') {
      return this.setCurrLocation();
    } else {
      console.log('in error');
      throw new Error('Location permission not granted');
    }
  }

  async alertIfLocationsDisabledAsync() {
    const { Permissions } = Exponent;
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Hey! You might want to enable notifications for my app, they are good.');
    }
  }

  setCurrLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = {}
        initialPosition.lat = position.coords.latitude;
        initialPosition.lon = position.coords.longitude;
        console.log(initialPosition, 'position in setCurr');
        this.setState({origin: initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
    );
  }

  handleUserInput (type) {
    return function(text, coords) {
      if(type === 'current') {
        this.setState({currAddress: text, currLocation: coords});
      }
      if(type === 'destination') {
        this.setState({destAddress: text, destLocation: coords});
      }
      console.log(this.state, 'in handleUserTextInput');
    }.bind(this);
  }
  handleUserCoords(type) {
    return function(coords) {
      if(type === 'current') {
        this.setState({currLocation: coords});
      }
      if(type === 'destination') {
        this.setState({destLocation: coords});
      }
        console.log(this.state, 'in handleUserTextInput');
    }.bind(this)
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
        initialPosition.lng = position.coords.longitude;
        if (initialPosition) {
          this.setState({
            defaultCurrLoc: {
              description: 'Home', 
                geometry: { 
                  location: initialPosition 
              }
            }, 
            currLocation: initialPosition,
            inputView: 'destination'
          });
        }
        console.log('setcurrlocation', initialPosition)
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
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
  getInputView() {
    const {inputView, DefaultCurrentLocation} = this.state;
    if(inputView === 'current') {
      let handleUserInput = this.handleUserInput('current')
      let handleUserCoords = this.handleUserCoords('current')
      return (
        <Example handleUserCoords={handleUserCoords} 
          handleUserInput={handleUserInput}
          placeHolder={'Your Address'}
          currentLocation = {DefaultCurrentLocation}
          />
      );
    } 
    if(inputView === 'destination') {
      let handleUserInput = this.handleUserInput('destination')
      let handleUserCoords = this.handleUserCoords('destination')
      return (
        <Example handleUserCoords={handleUserCoords} 
          handleUserInput={handleUserInput}
          placeHolder={'Enter Your Destination'}
          />
      );
    }
  }

  render() {
    const {view} = this.state;
      <View style={styles.container}>

      <View>
        {this.getInputView()}
      </View>
        <View style={styles.map}>
          <Overlays provider = {PROVIDER_DEFAULT}/>
        </View>
      </View>
      );
    } else if (view === 'Destination') {
    } 
  }
}
Exponent.registerRootComponent(App);

