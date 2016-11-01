import React, { Component } from 'react';
import { View, Dimensions, AsyncStorage, AlertIOS } from 'react-native';
import { Container } from 'native-base';
import MapView from 'react-native-maps';
import styles from './styles';
import helper from '../../utils/helper';
import moment from 'moment';

import GameMarker from '../GameMarker/GameMarker';
import CourtMarker from '../CourtMarker/CourtMarker';

import Foot from '../footer/Footer';
import Head from '../header/header';
import CreateGame from '../CreateGame/CreateGame';
import JoinGame from '../JoinGame/JoinGame';
import MyGameDetails from '../MyGameDetails/MyGameDetails';

const { width, height } = Dimensions.get('window');
const aspectRatio = width / height;
const latitude = 37.78825;
const longitude = -122.4324;
const latitudeDelta = 0.0922;
const longitudeDelta = latitudeDelta * aspectRatio;
const initialRegion = {latitude, longitude, latitudeDelta, longitudeDelta};
const STORAGE_KEY = 'id_token';

class HomeMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [],
      courts: [],
      selectedGame: false,
      selectedCourt: false,
      mode: 'Current Games',
      creatingGame: false,
      joiningGame: false,
      selectedGameType: '5 on 5',
      selectedGameTime: new Date(),
      segmentedIosIndex: 0,
      timeNow: new Date(),
      renderingGameDetails: false,
      myGame: null,
      token: null 
    };
  }

  updateGameType(newGameType) {
    this.setState( {selectedGameType: newGameType} );
  }

  updateGameTime(newTimeData) {
    this.setState( {selectedGameTime: newTimeData} );
  }

  async _getMyGames() {
    let self = this;

    try {
      let token = await AsyncStorage.getItem(STORAGE_KEY);
      this.setState( {token: token} );
      helper.getMyGames(token)
            .then( res => {
              if (res.data.games[0]) { 
                self.setState({renderingGameDetails: true, myGame: res.data.games[0]} );
              } else { 
                self.setState({renderingGameDetails: false}); 
                console.log('setting rendering game details to false')
              }
              console.log(self.state.renderingGameDetails, self.state.myGame)

            })
            .catch(err => console.log('getMyGames:', err))
    } catch (error) {
      console.log('AsyncStorage error getting token: ' + error.message);
    }
  }

  updateGameData() {
    helper.getMainData()
      .then(response => this.setState({games: response.data.games, courts: response.data.courts}))
      .catch(error => console.log('this is the error:', error));

    this._getMyGames();
  }

  componentWillMount() {
    this.updateGameData();

    setTimeout(() => {
      setInterval(() => {
        console.log('Interval running at', (new Date()));
        this.setState({timeNow: new Date()});
        this.updateGameData();
      }, 3000);
    }, (new Date(Math.ceil(new Date().getTime() / 3000) * 3000)) - (new Date));
  }

  renderGames() {
    let self = this;
    return (
      self.state.games.map((game, i) => (
        <MapView.Marker 
          onPress={ event => self.setState({selectedGame: game}) }
          coordinate={{latitude: game.court.latitude, longitude: game.court.longitude}} 
          key={i}>
            <GameMarker 
              amount={game.playerIds.length} 
              countdown={moment(game.time).from(this.state.timeNow)}
            />
        </MapView.Marker>
      ))
    )
  }

  renderCourts() {
    let self = this;
    return (
      this.state.courts.map((court, i) => (
        <MapView.Marker 
          onPress={ event => self.setState({selectedCourt: court}) }
          coordinate={{latitude: court.latitude, longitude: court.longitude}} 
          key={i}>
            <CourtMarker name={court.name}/>
        </MapView.Marker>
      ))
    )
  }

  handleSubmitGame() {
    let game = {
      type: this.state.selectedGameType,
      playerIds: [],
      time: this.state.selectedGameTime,
      court: this.state.selectedCourt.name
    };
    let token = this.state.token;

    helper.postNewGame(game, token)
    .then(res => {
      this.updateGameData();
      this.setState({segmentedIosIndex: 0, creatingGame: false, mode: 'Current Games'})
    })
  }

  renderCreateGame() {
    return (
      <CreateGame ref="createGameData"
        onGameTypeChange= {this.updateGameType.bind(this)}
        onTimeDataChange= {this.updateGameTime.bind(this)}
        exitCreateGame={ () => this.setState({creatingGame: false, mode: 'Create a Game'})}
        submitGame={() => this.handleSubmitGame()} />
    )
  }

  //grabs the json token stored in the app's AsyncStorage
  joinGame(game) {
    helper.joinGame(game, this.state.token)
      .then(response => AlertIOS.alert('You have been added to the game. BALL OUT!'))
      .catch(error => AlertIOS.alert('You are already a part of this game. BALL OUT!'))
  }

  renderJoinGame() {
    return (
      <JoinGame
        game={this.state.selectedGame} 
        exitJoinGame={ () => this.setState({joiningGame: false}) }
        joinGame={ () => { 
          this.joinGame(this.state.selectedGame);
          this.setState({joiningGame: false});
        }}
      />
    )
  }

  renderMyGameDetails() {
    return (
      <MyGameDetails game={this.state.myGame} shouldRender={this.state.renderingGameDetails} />
    )
  }

  renderFoot() {
    return (
      <Foot 
        game={this.state.selectedGame} 
        court={this.state.selectedCourt} 
        mode={this.state.mode}
        createGame={() => this.setState({creatingGame: true})}
        joinGame={() => this.setState({joiningGame: true})}/>
    )
  }

  render() {
    const iosIndex = this.state.segmentedIosIndex === 0 ? 1 : 0;
    return (
      <Container>
        <View style={styles.container}>
          <MapView
            provider={this.props.provider}
            style={styles.map}
            initialRegion = {initialRegion}>

            <Head 
              ref="headData" 
              switchMode={ mode => this.setState({mode: mode, segmentedIosIndex: iosIndex})} 
              index={this.state.segmentedIosIndex}/>

            {this.state.renderingGameDetails && this.renderMyGameDetails() }  

            {this.state.mode === 'Current Games' ? this.renderGames() : this.renderCourts()}
          </MapView>

          {this.state.creatingGame && this.renderCreateGame()}
          {this.state.joiningGame && this.renderJoinGame()}

          {!this.state.creatingGame && !this.state.joiningGame && this.renderFoot()}

        </View>
      </Container>
    );
  }

  componentDidUpdate() {
    console.log("State's gameType is:", this.state.selectedGameType);
    console.log("State's newTimeData is:", this.state.selectedGameTime);
  }
}

export default HomeMap;