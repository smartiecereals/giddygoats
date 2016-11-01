import React, { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  blur: {
  	flex: 1, 
  	justifyContent: 'center',
  	backgroundColor: 'transparent'
  }
});

export default styles;