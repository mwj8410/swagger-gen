/* global describe, it, require*/

const expect = require('chai').expect;
const express = require('express');
const st = require('supertest');

const sg = require('../swagger-gen');

describe('swagger-gen', () => {
  
  describe('generate()', () => {
    
    it('exists', () => {
      expect(sg.generate).to.be.a('function');
    });
    
    it('returns an array', () => {
      expect(sg.generate('./example').length).to.be.a('number');
    });
    
  });

  describe('hosted documents', () => {
    let host = express();
    let server;
    let req = st(host);

    before(() => {
      sg.host(host);
      server = host.listen(8080);
    });

    after(() => {
      server.close();
    });

    it('hosts the index', done => {
      req.get('/swagger')
      .then(response => {
        // console.log(response.text);
        expect(response.statusCode === 200);
        expect(response.text.indexOf('html') > -1).to.equal(true);
        done();
      });
    });
  });

});
