'use strict';

const requestId = require('../');


describe('request-id', () => {
  let middleware;

  beforeEach(() => {
    middleware = requestId();
  });

  describe('something', () => {
    it('should success', () => {
      return middleware;
    });
  });
});
