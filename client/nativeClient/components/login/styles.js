import React, { StyleSheet, Dimensions } from 'react-native';
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  shadow: {
    flex: 1,
    width: null,
    height: null,
  },
  bg: {
    flex: 1,
    marginTop: deviceHeight / 1.75,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 30,
    bottom: 0,
  },
  input: {
    marginBottom: 20,
  },
  btn: {
    marginTop: 20,
    alignSelf: 'center',
  },
  incorrect: {
    alignSelf: 'center',
    color: 'red'
  },
  signup: {
    marginTop: 25,
    alignSelf: 'center',
    fontSize: 14,
    color: 'grey'
  }
});

export default styles;
