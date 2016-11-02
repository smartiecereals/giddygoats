import React, { Component } from 'react';
import { Container, Content, InputGroup, Input, Button, View, Div, Icon } from 'native-base';
import { Image, TouchableHighlight, Text, AsyncStorage, AlertIOS } from 'react-native';
import styles from './styles';
import helper from '../../utils/helper';

let STORAGE_KEY = 'id_token';
const background = require('../images/basketball_rim.jpg');

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      incorrectAttempt: false,
    };
  }

  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
      console.log('token saved!');
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  submitLogin() {
    let self = this;
    let user = {
      email: this.state.email,
      password: this.state.password
    };

    helper.postLogin(user)
    .then(response => {
      let token = response.data.id_token;
      return self._onValueChange(STORAGE_KEY, token)
      .then(function() {
        console.log('redirecting');
        self.redirect('home');
      });
    })
    .catch(error => {
      AlertIOS.alert('Username or password is invalid! Please try again.');
    });
  } 

  redirect(route) {
    this.props.redirect(route);
  }

  signUpAccount() {
    this.redirect('signup');
  }

  render() {
    return (
      <Container style={styles.container}>
        <View>
          <Content>
            <Image source={background} style={styles.shadow}>
              <View style={styles.bg}>
                <InputGroup style={styles.input}>
                  <Icon name='ios-mail' style={{color:'#00C497'}} />
                  <Input 
                    placeholder="EMAIL" 
                    onChangeText={ email => this.setState({ email }) }
                    autoCorrect={false}
                    autoCapitalize="none" />
                  
                </InputGroup>
                <InputGroup style={styles.input}>
                  <Icon name='ios-lock' style={{color:'#00C497'}} />
                  <Input
                    placeholder="PASSWORD" 
                    onChangeText={ password => this.setState({ password }) }
                    secureTextEntry />

                </InputGroup>
                <Button 
                  style={styles.btn} 
                  onPress={() => this.submitLogin()} >
                  Login
                </Button>
                
                <Text 
                  style={styles.signup} 
                  onPress={() => {this.signUpAccount()}}>
                  Don't have an account, sign up here!
                </Text>

              </View>
            </Image>
          </Content>
        </View>
      </Container>
    );
  }
}

export default LogIn;
