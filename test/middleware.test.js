'use strict';

const requestId = require('../');


const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/;
const createContext = () => ({
  request: {},
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
        const reqId = context.state.reqId;
        expect(uuidRegex.test(reqId)).toEqual(true);
      });
    });

    it('should add a request id to `ctx.state.reqId` by default', async () => {
      const context = createContext();
      await middleware(context, () => {
        const reqId = context.state.reqId;
        expect(reqId).toBeDefined();
        expect(reqId).toBeTruthy();
      });
    });

    it('should add a request id into `ctx.state` with custom parameter name', async () => {
      const customId = 'customId';
      const middleware = requestId({
        propertyName: customId
      });
      const context = createContext();

      await middleware(context, () => {
        const reqId = context.state[customId];
        expect(reqId).toBeDefined();
        expect(reqId).toBeTruthy();
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
        header: customHeader
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

    it('should use a given request id from request header if exists', async () => {
      const context = createContext();
      context.get.mockReturnValue('hack-the-planet');

      await middleware(context, () => {
        const reqId = context.state.reqId;

        expect(context.get).toBeCalledTimes(1);
        expect(reqId).toBeDefined();
        expect(reqId).toEqual('hack-the-planet');
      });
    });
  });
});
