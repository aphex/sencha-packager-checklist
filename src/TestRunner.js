var Class = require('classjs'),
  util = require('util'),
  colors = require('colors'),
  TestResult = require('./TestResult.js'),

  //Tests
  CordovaTest = require('./CordovaTest.js'),
  SenchaTest = require('./SenchaTest.js'),
  PhonegapTest = require('./PhonegapTest.js'),
  iOSSimTest = require('./iOSSimTest.js'),
  iOSDeployTest = require('./iOSDeployTest.js'),
  ADBTest = require('./ADBTest.js'),
  XCodeBuildTest = require('./XCodeBuildTest.js'),
  AntTest = require('./AntTest.js'),
  RubyTest = require('./RubyTest.js'),
  JavaTest = require('./JavaTest.js'),
  tests = [
    JavaTest,
    RubyTest,
    SenchaTest,
    CordovaTest,
    PhonegapTest,
    XCodeBuildTest,
    iOSSimTest,
    iOSDeployTest,
    AntTest,
    ADBTest
  ];


module.exports = Class.define("TestRunner", {
  properties: {
    forceFail: {
      type: "Boolean",
      init: false
    },
    tests: {
      type: "Array",
      init: tests,
      set: false
    },
    totalTests: {
      type: "Number",
      init: tests.length,
      set: false
    },
    passed: {
      type: "Number",
      init: 0,
      set: false
    },
    failed: {
      type: "Number",
      init: 0,
      set: false
    },
    skipped: {
      type: "Number",
      init: 0,
      set: false
    },
    seperator: {
      type: "String",
      init: "------------------------------------"
    }
  },
  members: {
    run: function(forceFail) {
      if (forceFail) this.setForceFail(true);
      this.next()
    },

    next: function() {
      var testClass = tests.shift(),
        test, result;
      if (testClass) {
        test = new testClass();
        this.logHeader();
        console.log(('- Running test: ' + test.getName()).magenta);
        result = test.run();
        if (result instanceof TestResult) {
          this.onTestComplete(result);
        } else {
          result.then(this.onTestComplete.bind(this));
        }
      } else {
        console.log(this.getSeperator());
        console.log('Tests Completed.');
        var totalTests = this.getTotalTests(),
          passed = this.getPassed(),
          skipped = this.getSkipped(),
          failed = this.getFailed();

        if (passed > 0) {
          console.log((passed + "/" + totalTests + " passed. ").green);
        }

        if (skipped > 0) {
          console.log((skipped + "/" + totalTests + " skipped. ").yellow);
        }

        if (failed > 0) {
          console.log((failed + "/" + totalTests + " failed. ").red);
        }
        console.log(this.getSeperator());
      }
    },

    onTestComplete: function(result) {
      var value;

      if (result.getSkipped()) {
        console.log(('- Skipping test: ' + result.getName() + " : " + result.getMessage()).yellow);
        value = this.getSkipped();
        value++;
        this._setSkipped(value);
      } else {
        if (this.getForceFail()) {
          result.setSuccess(false);
        }

        console.log(this.prettyResult(result));
        if (result.getSuccess()) {
          value = this.getPassed();
          value++;
          this._setPassed(value);
        } else {
          console.log(result.getInstructions());
          value = this.getFailed();
          value++;
          this._setFailed(value);
        }
      }

      this.logFooter();
      this.next();
    },

    logHeader: function() {
      console.log(this.getSeperator());
    },

    logFooter: function() {
      console.log(this.getSeperator());
      console.log("\n");
    },
    prettyResult: function(result) {
      return "-- " + (result.getSuccess() ? ("Success: " + result.getMessage()).green : ("Failed: " + result.getMessage()).red);
    }
  }
});
