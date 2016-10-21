var Sequelize = require('sequelize');

var db = new Sequelize('postgres://127.0.0.1:5432/dangerDB');


module.exports = db;
