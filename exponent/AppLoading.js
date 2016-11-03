import React from 'react';
import {
  AppRegistry,
  Image,
  Text,
  View,
} from 'react-native';
import {
  Asset,
  Components,
} from 'exponent';

class App extends React.Component {
  state = {
    isReady: false,
  };

  componentWillMount() {
    this._cacheResourcesAsync();
  }

  render() {
    if (!this.state.isReady) {
      return <Components.AppLoading />;
    }

    return (
      <View>
        <Image source={require('./assets/images/app-splash-safe-hippo_640.png')} />
      </View>
    );
  }

  async _cacheResourcesAsync() {
    const images = [
      require('./assets/images/app-splash-safe-hippo_640.png')
    ];

    for (let image of images) {
      await Asset.fromModule(image).downloadAsync();
    }

    this.setState({isReady: true});
  }
}

AppRegistry.registerComponent('main', () => App);