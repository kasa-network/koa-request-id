'use strict';

const uuidV4 = require('uuid/v4');
const debug = require('debug')('koa:request-id');


/**
 * Return middleware that gets an unique request id from a header or
 * generates a new id.
 *
 * @param {Object} [options={}] - Optional configuration.
 * @param {string} [options.header=X-Request-Id] - Request and response header name.
 * @param {string} [options.propertyName=reqId] - Context property name.
 * @param {function} [options.generator] - Id generator function.
 * @return {function} Koa middleware.
 */
module.exports = (options = {}) => {
  const {
    header = 'X-Request-Id',
    propertyName = 'reqId',
    generator = uuidV4
  } = options;

  debug('Create a middleware');

  return async function requestId(ctx, next) {
    const reqId = ctx.get(header) || generator();
    debug(`reqId=${reqId}`);

    ctx.state[propertyName] = reqId;
    ctx.set(header, reqId);

    await next();
  };
};
