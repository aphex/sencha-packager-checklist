var util = require('util'),
  colors = require('colors'),
  TestResult = require('./src/TestResult.js'),

  //Tests
  CordovaTest = require('./src/CordovaTest.js'),
  SenchaTest = require('./src/SenchaTest.js'),
  PhonegapTest = require('./src/PhonegapTest.js'),
  iOSSimTest = require('./src/iOSSimTest.js'),
  iOSDeployTest = require('./src/iOSDeployTest.js'),
  ADBTest = require('./src/ADBTest.js'),
  XCodeBuildTest = require('./src/XCodeBuildTest.js'),

  // Queued Tests to run
  tests = [SenchaTest, CordovaTest, PhonegapTest, XCodeBuildTest, iOSSimTest, iOSDeployTest, ADBTest],
  // tests = [XCodeBuildTest],
  totalTests = tests.length,
  passed = 0,
  failed = 0,
  skipped = 0,

  // Random Variables
  seperator = "------------------------------------",
  testClass, test, result,

  //debug variables
  //Forces all tests to fail
  forceFail = false;

function onTestComplete(result) {
  if (result.getSkipped()) {
    console.log(('- Skipping test: ' + test.getName() + " : " + result.getMessage()).yellow);
    skipped++;
  } else {
    if(forceFail) {
      result.setSuccess(false);
    }

    console.log(prettyResult(result));
    if (result.getSuccess()) {
      passed++;
    } else {
      console.log(test.getInstructions());
      failed++;
    }
  }
  logFooter();
  next();
}

function logHeader() {
  console.log(seperator);
}

function logFooter() {
  console.log(seperator);
  console.log("\n");
}

function next() {
  testClass = tests.shift();
  if (testClass) {
    test = new testClass();
    logHeader();
    console.log(('- Running test: ' + test.getName()).magenta);
    result = test.run();
    if (result instanceof TestResult) {
      onTestComplete(result);
    } else {
      result.then(onTestComplete);
    }
  } else {
    console.log(seperator);
    console.log('Tests Completed.');
    if (passed > 0) {
      console.log((passed + "/" + totalTests + " passed. ").green);
    }

    if (skipped > 0) {
      console.log((skipped + "/" + totalTests + " skipped. ").yellow);
    }

    if (failed > 0) {
      console.log((failed + "/" + totalTests + " failed. ").red);
    }
    console.log(seperator);
  }
}

function prettyResult(result) {
  return "-- " + (result.getSuccess() ? ("Success: " + result.getMessage()).green : ("Failed: " + result.getMessage()).red);
}
next();
