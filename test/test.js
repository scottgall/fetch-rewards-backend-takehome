const { expect } = require('chai');
const chai = require('chai');
const chaiHTTP = require('chai-http');
const server  =  require('../index'); 

const API = 'http://localhost:5000';

chai.should();

chai.use(chaiHTTP);

describe('Points API',  () => {

  // POST transaction route
  describe("POST /points", () => {
    it("Should POST a new transaction", (done) => {
      const transaction = {"payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z"}
      chai.request(API)
          .post("/points")
          .send(transaction)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.transaction).to.deep.equal(transaction);
          done();
          });
    });

    it("Should NOT POST a new transaction", (done) => {
      const transaction = {"payer": "DANNON", "points": 300, "timestamp": "2020-10-31T1000:00Z", "extra": "extra"}
      chai.request(API)
          .post("/points")
          .send(transaction)
          .end((err, res) => {
            res.should.have.status(422);
          done();
          });
    });
  });

  // GET points route
  describe("GET /points", () => {
    it("Should GET all the points by payer", (done) => {
      const points = {"DANNON":  300};
      chai.request(API)
        .get("/points")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body).to.deep.equal(points);
        done();
        });
    });
  });

  // POST spend points route
  describe("POST /points/spend", () => {
    it("Should spend points available", (done) => {
      const spend = {"points":  200}
      const response  = [{"payer": "DANNON", "points": -200}]
      chai.request(API)
        .post("/points/spend")
        .send(spend)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          expect(res.body).to.deep.equal(response)
        done();
        });
    });
  });

  // GET points route
  describe("GET /points", () => {
    it("Should GET all the points by payer", (done) => {
      const points = {"DANNON":  100};
      chai.request(API)
        .get("/points")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body).to.deep.equal(points);
        done();
        });
    });
  });

  // POST spend points route
  describe("POST /points/spend", () => {
    it("Should not spend unavailable  points", (done) => {
      const spend = {"points":  200}
      chai.request(API)
        .post("/points/spend")
        .send(spend)
        .end((err, res) => {
          res.should.have.status(422);
        done();
        });
    });
  });

  // POST transaction route
  describe("POST /points", () => {
    it("Should NOT POST negative points transaction", (done) => {
      const transaction = {"payer": "DANNON", "points": -200, "timestamp": "2020-10-31T10:00:00Z"}
      chai.request(API)
          .post("/points")
          .send(transaction)
          .end((err, res) => {
            res.should.have.status(422);
          done();
          });
    });

    it("Should NOT POST a new transaction", (done) => {
      const transaction = {"payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z"}
      chai.request(API)
          .post("/points")
          .send(transaction)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.transaction).to.deep.equal(transaction);
          done();
          });
    });
  });


});