const expect = require('chai').expect;
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
});