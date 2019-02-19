'use strict';

const requestId = require('../');


const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/;
const createContext = () => ({
  request: {},
  query: {},
  state: {},
  get: jest.fn(),
  set: jest.fn()
});

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

    it('should expose a named function', () => {
      expect(middleware.name).toEqual('requestId');
    });

    it('should has an uuid formatted request id by default generator', async () => {
      const context = createContext();
      await middleware(context, () => {
        expect(uuidRegex.test(context.state.reqId)).toEqual(true);
        expect(uuidRegex.test(context.id)).toEqual(true);
      });
    });

    it('should use custom generator instead of uuid v4', async () => {
      const middleware = requestId({
        generator: () => 'helloworld'
      });
      const context = createContext();

      await middleware(context, () => {
        const reqId = context.state.reqId;

        expect(reqId).toBeDefined();
        expect(reqId).toEqual('helloworld');
      });
    });

    it('should add a request id to `ctx.state.reqId` and `ctx.id`', async () => {
      const context = createContext();
      await middleware(context, () => {
        expect(context.state.reqId).toBeDefined();
        expect(context.state.reqId).toBeTruthy();
        expect(context.id).toBeDefined();
        expect(context.id).toBeTruthy();
      });
    });

    it('should set `X-Request-Id` response header by default', async () => {
      const context = createContext();

      await middleware(context, () => {
        const reqId = context.state.reqId;
        const [key, value] = context.set.mock.calls[0];

        expect(context.set).toBeCalledTimes(1);
        expect(key).toEqual('X-Request-Id');
        expect(value).toEqual(reqId);
      });
    });

    it('should set into response header with custom header name', async () => {
      const customHeader = 'X-Kasa-Req-Id';
      const middleware = requestId({
        exposeHeader: customHeader
      });
      const context = createContext();

      await middleware(context, () => {
        const reqId = context.state.reqId;
        const [key, value] = context.set.mock.calls[0];

        expect(context.set).toBeCalledTimes(1);
        expect(key).toEqual(customHeader);
        expect(value).toEqual(reqId);
      });
    });

    it('should not set into response header if `exposeHeader` option is falsy', async () => {
      const middleware = requestId({
        exposeHeader: false
      });
      const context = createContext();

      await middleware(context, () => {
        expect(context.set).toBeCalledTimes(0);
      });
    });

    it('should use a given request id from request query if exists', async () => {
      const middleware = requestId({
        query: 'reqId'
      });
      const context = createContext();
      context.query.reqId = 'secret-req-id';
      context.get.mockReturnValue('hack-the-planet');

      await middleware(context, () => {
        const reqId = context.state.reqId;

        expect(context.get).toBeCalledTimes(0);
        expect(reqId).toBeDefined();
        expect(reqId).toEqual(context.query.reqId);
      });
    });

    it('should use a given request id from request header `X-Request-Id` if exists', async () => {
      const context = createContext();
      context.get.mockReturnValue('hack-the-planet');

      await middleware(context, () => {
        const reqId = context.state.reqId;

        expect(context.get).toBeCalledTimes(1);
        expect(context.get).lastCalledWith('X-Request-Id');
        expect(reqId).toBeDefined();
        expect(reqId).toEqual('hack-the-planet');
      });
    });

    it('should use a given request id from custom request header if exists', async () => {
      const middleware = requestId({
        header: 'X-Custom-Id'
      });
      const context = createContext();
      context.get.mockReturnValue('hack-the-planet');

      await middleware(context, () => {
        const reqId = context.state.reqId;

        expect(context.get).toBeCalledTimes(1);
        expect(context.get).lastCalledWith('X-Custom-Id');
        expect(reqId).toBeDefined();
        expect(reqId).toEqual('hack-the-planet');
      });
    });
  });
});
