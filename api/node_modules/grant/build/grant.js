'use strict';

exports.express = function () {
  return require('./lib/consumer/express');
};

exports.koa = function () {
  var version = parseInt(require('koa/package.json').version.split('.')[0]);
  return require('./lib/consumer/koa' + (version < 2 ? '' : '2'));
};

exports.hapi = function () {
  var pkg;
  try {
    pkg = require('hapi/package.json');
  } catch (err) {
    pkg = require('@hapi/hapi/package.json');
  }
  var version = parseInt(pkg.version.split('.')[0]);
  return require('./lib/consumer/hapi' + (version < 17 ? '' : '17'));
};