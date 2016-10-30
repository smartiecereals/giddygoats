var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/server');
var should = chai.should();

chai.use(chaiHttp);


describe('Heatmap for current location', function() {
  
  it('return status 200', function(done) {
    chai.request(server)
      .get('/testDanger?long=-122.4084312&lat=37.776543')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
  
  it('return an array of objects with lat/long pairs', function(done) {
    chai.request(server)
      .get('/testDanger?long=-122.4084312&lat=37.776543')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.be.a('array');
        res.body[0][0].should.be.a('number');
        res.body[0][1].should.be.a('number');
        done();
      });
  });

});