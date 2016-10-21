var Sequelize = require('sequelize');
var db = require('../config.js');

var Danger = db.define('danger', {
  lat: {
    type: Sequelize.INTEGER
  },
  lon: {
    type: Sequelize.INTEGER
  },
  count: {
    type: Sequelize.INTEGER
  }
});



module.exports = Danger;
