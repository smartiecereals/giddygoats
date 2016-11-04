var React = require('react');
var {GooglePlacesAutocomplete} = require('./react-native-google-places-autocomplete/GooglePlacesAutocomplete.js');

const homePlace = {description: 'Home', geometry: { location: { lat: 37.7812941, lng: -122.406819 } }};
const workPlace = {description: 'Tempest', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};
var API_KEY = require ('./keys.js').default;

var Example = (props) => {
  console.log(props.currentAddress)
  //testing if input box can dispaly current address by default
    return (
      <GooglePlacesAutocomplete
        placeholder={props.placeHolder}
        minLength={2} // minimum length of text to search
        autoFocus={false}
        fetchDetails={true}
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          props.handleUserInput(details.formatted_address, details.geometry.location)
          props.setDestinationSync(false);
          console.log('PRESSING DESTINATION INPUT')
        }}
        getDefaultValue={() => {
          return props.currentAddress; // text input default value
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: API_KEY,
          language: 'en', // language of the results
          types: 'geocode', // default: 'geocode'
        }}
        styles={{
          description: {
            fontWeight: 'bold',
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
        
        currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Current location"
        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro

        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
          types: 'address',
        }}
        
        
        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        
        predefinedPlaces={[homePlace, workPlace]}
        
        predefinedPlacesAlwaysVisible={true}
      />
    );
};

module.exports = Example;