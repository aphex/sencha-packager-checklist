#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2)),
  TestRunner = require('../src/TestRunner'),
  testRunner = new TestRunner().run(argv.fail || false);
