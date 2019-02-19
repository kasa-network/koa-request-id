'use strict';

const uuidV4 = require('uuid/v4');
const debug = require('debug')('koa:request-id');


/**
 * Return middleware that gets an unique request id from a header or
 * generates a new id.
 *
 * @param {Object} [options={}] - Optional configuration.
 * @param {string} [options.query] - Request query name to get the forwarded request id.
 * @param {string} [options.header=X-Request-Id] - Request header name to get the forwarded request id.
 * @param {string} [options.exposeHeader=X-Request-Id] - Response header name.
 * @param {function} [options.generator=uuidV4] - Id generator function.
 * @return {function} Koa middleware.
 */
module.exports = (options = {}) => {
  const {
    query = null,
    header = 'X-Request-Id',
    exposeHeader = 'X-Request-Id',
    generator = uuidV4
  } = options;

  debug('Create a middleware');

  return async function requestId(ctx, next) {
    const reqId = ctx.query[query]
      || (header && ctx.get(header))
      || generator();
    debug(`reqId=${reqId}`);

    ctx.id = reqId;
    ctx.state.reqId = reqId;

    if (exposeHeader) {
      debug(`Expose the request id via headers['${exposeHeader}']`);
      ctx.set(exposeHeader, reqId);
    }

    await next();
  };
};
