'use strict';

const requestId = require('../');


describe('request-id', () => {
  let middleware;

  beforeEach(() => {
    middleware = requestId();
  });

  it('should be defined as function', () => {
    expect(requestId).toBeDefined();
    expect(requestId).toBeFunction();
  });

  describe('middleware', () => {
    it('should be defined as koa middleware function', () => {
      expect(middleware).toBeDefined();
      expect(middleware).toBeFunction();
    });
  });
});
