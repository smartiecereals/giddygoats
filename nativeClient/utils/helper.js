import axios from 'axios';
import Promise from 'bluebird';

//replace 'http://localhost:8000' with 'https://baller-server.herokuapp.com' to use the hosted Heroku server


let getMainData = function() {
  return axios.get('http://localhost:8000/api/main');
};

let postLogin = function(user) {
  return axios.post('http://localhost:8000/api/login', user);
};

let postSignUp = function(user) {
  return axios.post('http://localhost:8000/api/signup', user);
};

let postNewGame = function(game, token) {
  console.log('need to post game here', game);
  let body = {
    game: game,
    token: token
  };
  return axios.post('http://localhost:8000/api/games', body);
};

let joinGame = function(game, token) {
  var body = {
    game: game,
    token: token
  };

  return axios.post('http://localhost:8000/api/join', body);
};

let getMyGames = function(token) {
  let body = {
    token: token
  };

  return axios.post('http://localhost:8000/api/mygames', body);
}

var data = {
  getMainData: getMainData,
  postLogin: postLogin,
  postSignUp: postSignUp,
  postNewGame: postNewGame,
  joinGame: joinGame,
  getMyGames: getMyGames
};

export default data;
