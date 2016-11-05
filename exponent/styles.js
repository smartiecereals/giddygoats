
import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  /*
  //TODO: WELCOME SCREEN
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  */
  container: {
    flex: 1,
    flexDirection: 'column', 
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },

  inputContainer: {
    flex: 1
  },

  textBox: {
    flex: 1,
    height: 20,
    textAlign: 'center',
    marginBottom: 10
  },

  destinationBar: {
    backgroundColor: '#27a1ab'
  },

  map: {
    flex: 7
  },

  gradient: {
    flex: 1,
    paddingTop: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: undefined,
    height: undefined,
    backgroundColor: 'transparent'
  },

  logo: {
    width: 45,
    height: 45
  },

  googleMapsTouch: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },

  googleMapsLink: {
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  },

  wordmark: {
    width: 230,
    height: 46,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },

  toggleCrime: {
    width: 45,
    height: 45
  },

  mapLink: {
    flex: 1    
  },
  // container: {
  //   ...StyleSheet.absoluteFillObject,
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  // },
  scrollview: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  button: {
    flex: 1,
    backgroundColor: '#0f5866',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  back: {
    position: 'absolute',
    top: 20,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    padding: 12,
    borderRadius: 20,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  UserInputCurrAddress: {
    flex: 1,
    backgroundColor: '#0f5866',
    paddingTop: 13,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: undefined,
    height: undefined,
    justifyContent: 'space-between'
  },

  UserInputCurrAddressText: {  
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10, 
    textAlign: 'center',
    color: '#fff',  
  },

  UserInputCurrAddressIcon: {
    width: 15,
    height: 15,
    paddingRight: 10
  }
});

export default styles;