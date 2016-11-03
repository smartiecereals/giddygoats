import Exponent from 'exponent';
import React from 'react';
import UserInput from './userInput.js';
import HippoMap from './maps.js';
import MapLink from './mapLink.js';
import styles from './styles.js';
import {
  View,
  Text,
  TextInput
} from 'react-native';


class App extends React.Component {
  constructor () {
    super ();
    this.state = {
      
    };

  this.handleUserDestinationInput = this.handleUserDestinationInput.bind(this);
  this.getSafestRoute = this.getSafestRoute.bind(this);
  }

  componentDidMount() {
    this.getCurrLocation();
  }

  handleUserDestinationInput (text) {
    console.log(text, 'in handleUserTextInput');
    this.setState({destination: text});
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

  getCurrLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = {}
        initialPosition.lat = position.coords.latitude;
        initialPosition.lon = position.coords.longitude;
        this.setState({origin: initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }
  renderSubmitButton() {
    let origin = this.state.origin;
    let destination = this.state.destination;
    return (
      <TouchableOpacity
        key={'Be Safe!'}
        style={styles.button}
        onPress={() => this.getSafestRoute(origin, destination)}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
          <UserInput handleUserDestinationInput={this.handleUserDestinationInput}/>
          <HippoMap />
          <MapLink/>
      </View>
    )
  }
}



Exponent.registerRootComponent(App);


