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
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image
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
      view: 'Hippo',
      inputView: 'current'
    };

  this.handleUserInput = this.handleUserInput.bind(this);
  this.handleUserCoords = this.handleUserCoords.bind(this);
  this.getSafestRoute = this.getSafestRoute.bind(this);
  this.getAddress = this.getAddress.bind(this);
  this.getInputView = this.getInputView.bind(this)
  this.destinationIsSync = this.destinationIsSync.bind(this);
  this.setDestinationSync = this.setDestinationSync.bind(this);
  }

  componentDidMount() {
    console.log('COMPONENT DID MOUNT');
    this.getAddress('currLocation');
    this.alertIfLocationsDisabledAsync();
    this.getLocationPermissionsAsync();
  }

  async getLocationPermissionsAsync() {
    const { Location, Permissions } = Exponent;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log(status);
    if (status === 'granted') {
      console.log('LOCATION GOT')
      return this.setCurrLocation();
    } else {
      console.log('in error');
      console.log('LOCATION NOT GOT')

      throw new Error('Location permission not granted');
    }
  }

  async alertIfLocationsDisabledAsync() {
    const { Permissions } = Exponent;
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Hey! You might want to enable locations for my app, they are useful.');
    }
  }

  setCurrLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = {}
        initialPosition.lat = position.coords.latitude;
        initialPosition.lng = position.coords.longitude;
        console.log(initialPosition, 'position in setCurr');
        this.setState({
          currLocation: initialPosition, 
          defaultCurrLoc: {
              description: 'Home', 
                geometry: { 
                  location: initialPosition 
              }
            },
            inputView: 'destination'
          });
        console.log('SET CURRENT LOCATION');
      },
      (error) => alert(JSON.stringify(error)),
    );
  }

  handleUserInput (type) {
    return function(text, coords) {
      if(type === 'current') {
        this.setState({currAddress: text, currLocation: coords});
        console.log('SET CURRENT ADDRESS AND LOCATION')
      }
      if(type === 'destination') {
        this.setState({destAddress: text, destLocation: coords});
        console.log('SET DESTINATION ADDRESS AND LOCATION')
      }
      console.log(this.state, 'in handleUserInput');
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
      console.log('SETTING USER COORDS');
    }.bind(this)
  }


  getSafestRoute() {
    console.log(this.state)
    console.log('GETTING SAFEST ROUTE')
    console.log('destination: ', this.state.destLocation);
    console.log('origin: ', this.state.currLocation);
    let setDestinationSync = this.setDestinationSync;
    let originCoords = this.state.currLocation;
    let destinationCoords = this.state.destLocation;
    let locationURL = 'http://138.68.62.73:3000/safestRoute?'
    let context = this;
    let checkMobile = (mobile) => {
      if (mobile) {
        locationURL += ('&mobile=' + mobile)
      }
    }
    console.log('COOORDS ARE HEREERE', destinationCoords, originCoords)
    
    axios.get(locationURL, {
        params: {
          originLat: originCoords.lat,
          originLon: originCoords.lng,
          destLat: destinationCoords.lat,
          destLon: destinationCoords.lng
        }
      })
      .then(function(jsonRoute) {
        console.log('JSON ROUTE', jsonRoute);
        let wayPointData = jsonRoute.data.waypoints;
        wayPointData = wayPointData.map(function(waypoint) {
          let newWP = {latitude: waypoint.lat , longitude: waypoint.lng}
          return newWP
        })
        context.setState({safeRoute: wayPointData});
        setDestinationSync(true);
      })
      // TODO: This is a hard coded response. The api call should update
      // $scope.safeRoute = {"url":"https://www.google.com/maps?saddr=37.7901786,-122.4071487&daddr=37.7764555,-122.4082531+to:37.7854928,-122.4062062+to:37.7804776,-122.4125511+to:37.77676659999999,-122.4078552&via=1,2,3"
      //                   ,"waypoints":[{"lat":37.7901786,"lng":-122.4071487},{"lat":37.7854928,"lng":-122.4062062},{"lat":37.7804776,"lng":-122.4125511},{"lat":37.77676659999999,"lng":-122.4078552},{"lat":37.7764555,"lng":-122.4082531}]
      //                   ,"shortURL":"https://goo.gl/8eh9uX"}

      // $scope.renderRoute($scope.safeRoute.waypoints);
    }
    destinationIsSync() {
      return this.state.destinationIsSync;
    }
    setDestinationSync(bool) {
      this.setState({destinationIsSync: bool })
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
      console.log('SETTING CURRENT ADDRESS')
    });
  }


  renderCurrAddressButton(key, fnOnPress, text) {
    return (
      <View style={styles.UserInput}>
      <TouchableOpacity
        key={key}
        style={styles.UserInputCurrAddress}
        onPress={fnOnPress}
      >
        <Text style={{color:'#FFF', fontSize: 15}}>{text}</Text>
        <Image 
        style={styles.UserInputCurrAddressIcon}
        source={require('./assets/images/pencil_96.png')}/>
      </TouchableOpacity>
      </View>

    );
  }

  getInputView() {
    const {inputView, DefaultCurrentLocation, currAddress} = this.state;
    const {handleUserInput, handleUserCoords, setDestinationSync} = this;


    if(inputView === 'current') {
      console.log('INPUT VIEW CURRENT')
      let handleUserInput = this.handleUserInput('current')
      let handleUserCoords = this.handleUserCoords('current')
      return (
        <View style={styles.UserInput}>
        <Example 
          handleUserCoords={handleUserCoords} 
          handleUserInput={handleUserInput}
          placeHolder={'Your Address'}
          currentAddress = {currAddress}
          setDestinationSync = {() => {return;}}
          />
        </View>
      );
    } 

    if(inputView === 'destination') {
      console.log('INPUT VIEW DESTINATION')
      let handleUserInput = this.handleUserInput('destination')
      let handleUserCoords = this.handleUserCoords('destination')
      let currAddressShorten = currAddress.split(',')[0];
      let setCurrView = () => {this.setState({inputView: 'current'})}

      return (
        <View>
        {this.renderCurrAddressButton(
          'currAddress', 
          setCurrView, 
          `Current Location: ${currAddressShorten}`)}
        <Example 
          handleUserCoords={handleUserCoords} 
          handleUserInput={handleUserInput}
          placeHolder={'Enter Your Destination'}
          setDestinationSync = {setDestinationSync}
          />
        </View>
      );
    }
  }

  render() {
    const {view, destLocation, currLocation, safeRoute} = this.state;
    const {getSafestRoute, destinationIsSync} = this;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#27a1ab"
          barStyle="default"
        />
        <MapLink style={styles.mapLink}>
        </MapLink>
        <View>
          {this.getInputView()}
        </View>
        <View style={styles.map}>
          <Overlays destinationIsSync={destinationIsSync} 
          safeRoute={safeRoute} 
          getSafestRoute={getSafestRoute} 
          provider={PROVIDER_DEFAULT} 
          destLocation={destLocation} 
          currLocation={currLocation}/>
        </View>
      </View>
      );
  }
}
Exponent.registerRootComponent(App);

