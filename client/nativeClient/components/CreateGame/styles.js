import React, { StyleSheet, Dimensions } from 'react-native';

const createGameBtnColor = '#DB343F';
const backgroundColor = 'rgba(255, 255, 255, 1)'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: backgroundColor,
    borderRadius: 10,
    shadowColor: 'grey',
    shadowOpacity: .8,
    shadowRadius: 2,
    shadowOffset: {height: 1, width: 0}
  },
  innerContainer: {
    flex: 1
  },
  title: {
    color: 'black',
    marginBottom: 0,
    marginTop: 30,
    marginBottom: 10
  },
  button: {
    padding: 10,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: createGameBtnColor

  },
  x: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  xtext: {
    color: 'black',
    fontSize: 24,
    lineHeight: 24
  },
  image: {
    width: 380, 
    height: 200,
    marginLeft: 7,
    marginTop: 10
  }

});

export default styles;