import React, { StyleSheet } from 'react-native';
const footerBackground = 'rgba(250,250,250,0.9)';

const styles = StyleSheet.create({
  container: {
  	alignSelf: 'stretch', 
  	flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  image: {
    width: 150, 
    height: 100
  },
  name: {
  	marginLeft: 10
  },
  footer: {
    backgroundColor: footerBackground
  }
});

export default styles;