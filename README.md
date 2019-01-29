<div align="center">
  <h1>@kasa/koa-request-id</h1>
</div>

<p align="center">
  A middleware that generates a unique Request ID for every incoming HTTP request in Koa.
</p>

<div align="center">
  <a href="https://circleci.com/gh/kasa-network/koa-request-id">
    <img alt="CircleCI" src="https://circleci.com/gh/kasa-network/koa-request-id.svg?style=shield" />
  </a>
  <a href="https://coveralls.io/github/kasa-network/koa-request-id">
    <img src="https://coveralls.io/repos/github/kasa-network/koa-request-id/badge.svg" alt='Coverage Status' />
  </a>
  <a href="https://badge.fury.io/js/@kasa/koa-request-id">
    <img alt="npm version" src="https://img.shields.io/npm/v/@kasa/koa-request-id.svg" />
  </a>
  <a href="https://david-dm.org/kasa-network/koa-request-id">
    <img alt="npm" src="https://img.shields.io/david/kasa-network/koa-request-id.svg?style=flat-square" />
  </a>
  <a href="https://opensource.org/licenses/mit-license.php">
    <img alt="MIT Licence" src="https://badges.frapsoft.com/os/mit/mit.svg?v=103" />
  </a>
  <a href="https://github.com/ellerbrock/open-source-badge/">
    <img alt="Open Source Love" src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103" />
  </a>
</div>

<br />


## Installation

```bash
# Using NPM
$ npm install --save @kasa/koa-request-id
# Using Yarn
$ yarn add @kasa/koa-request-id
```


### Dependencies

- [**Koa**](https://github.com/koajs/koa) 2.0+
- [**Node.js**](https://nodejs.org) 8.0.0+


## Usage

Use `koa-request-id` as a middleware for a [koa](https://github.com/koajs/koa) app. By default, it generates a unique uuid (v4) and exposes it on the response via the `X-Request-Id` header. The id is also saved as part of the request *state*.

In the following example, the generated uuid is manually exposed on the body for debugging purposes:

```js
const Koa = require('koa');
const requestId = require('@kasa/koa-request-id');
const app = new Koa();

app.use(requestId());
app.use(async ctx => {
  ctx.body = ctx.state.reqId;
});

app.listen(3000);
```

Execute a request to the running app:

```bash
❯ curl -v http://localhost:3000

< HTTP/1.1 200 OK
< X-Request-Id: a78598a4-6537-45eb-811c-fdc59602a54c

a78598a4-6537-45eb-811c-fdc59602a54c
```

Sometimes it is also useful to pass a custom id via a request header, specifically in tracking requests on the distributed system. Please note that the input id is not sanitized, so the usual precautions apply.

Using the above snippet to send a custom via the default `X-Request-Id` header:

```bash
❯ curl -v -H 'X-Request-Id: foobar' http://localhost:3000

< HTTP/1.1 200 OK
< X-Request-Id: foobar

foobar
```


## API

### Creating an middleware

You can create a new request id middleware by passing the relevant options to `requestId`;

```node
const middleware = requestId({
  header: 'X-Request-Id',
  propertyName: 'reqId',
  generator: require('uuid/v4')
});
```

### Middleware Configuration

These are the available config options for the middleware. All is optional. The middleware set the request id into `ctx.state.reqId` Koa context state object and `X-Request-Id` response header using `uuidv4` generator if any option is not specified.

```node
{
  // Request and response header name
  header: 'X-Transaction-Id',

  // Context property name in Koa
  propertyName: 'tid',

  // Function to generate request id
  generator: () => Date.now().toString()
}
```


## Contributing

#### Bug Reports & Feature Requests

Please use the [issue tracker](https://github.com/kasa-network/koa-request-id/issues) to report any bugs or ask feature requests.


## License

Copyright © 2018, [Kasa](http://www.kasa.network).
