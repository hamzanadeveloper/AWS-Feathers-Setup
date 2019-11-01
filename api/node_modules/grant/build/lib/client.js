'use strict';

var qs = require('qs');

var parse = function parse() {
  return function (_ref) {
    var options = _ref.options,
        res = _ref.res,
        headers = _ref.res.headers,
        body = _ref.body,
        raw = _ref.raw;


    raw = body;

    var header = Object.keys(headers).find(function (name) {
      return name.toLowerCase() === 'content-type';
    });

    if (/json|javascript/.test(headers[header])) {
      try {
        body = JSON.parse(body);
      } catch (err) {}
    } else if (/application\/x-www-form-urlencoded/.test(headers[header])) {
      try {
        // use qs instead of querystring for nested objects
        body = qs.parse(body);
      } catch (err) {}
    }

    // some providers return wrong `content-type` like: text/html or text/plain
    else {
        try {
          body = JSON.parse(body);
        } catch (err) {
          // use qs instead of querystring for nested objects
          body = qs.parse(body);
        }
      }

    return { options, res, body, raw };
  };
};

module.exports = require('request-compose').extend({
  Request: { oauth: require('request-oauth') },
  Response: { parse }
}).client;