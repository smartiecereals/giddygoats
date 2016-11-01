import React, { StyleSheet, Dimensions } from 'react-native';

const joinGameBtnColor = '#DB343F';
const backgroundColor = 'rgba(255, 255, 255, 1)';

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
    shadowOffset: {height: 0, width: 0}
  },
  innerContainer: {
    flex: 1
  },
  title: {
    color: 'black',
    marginBottom: 10,
    marginTop: 10
  },
  mainTitle: {
    color: 'black',
    marginBottom: 10,
    marginTop: 10,
    fontSize: 30,
    lineHeight: 30,
    marginTop: 20
  },
  button: {
    padding: 10,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: joinGameBtnColor
  },
  x: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  xtext: {
    color: 'black',
    fontSize: 24,
    lineHeight: 24
  },
  stats: {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 30,
    color: 'grey',
    marginTop: 10,
    marginBottom: 5
  },
  image: {
    width: 380, 
    height: 200,
    marginLeft: 7,
    marginTop: 0,
    borderRadius: 10,
    marginBottom: 10
  },
  thumbnail: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 20
  },
  wrapper: {
    // flex: 1,
    flexWrap: 'wrap', 
    alignItems: 'center',
    flexDirection:'row'
  }

});

export default styles;