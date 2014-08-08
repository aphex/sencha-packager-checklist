var Class = require('classjs'),
  exec = require('child_process').exec,
  Q = require('Q'),
  deferred = Q.defer(),
  ITest = require('./ITest'),
  TestResult = require('./TestResult');


module.exports = Class.define("SenchaTest", {
  interfaces: [ITest],
  members: {
    getName: function() {
      return "Sencha CMD";
    },
    getInstructions: function() {
      return "Sencha CMD allows for everything from code scaffolding to minification and deploying your applications.\n\
It is also the command line tool that powers native cordova & phonegap integration.\n\nTo install Sencha CMD please visit\n".grey +
        "http://www.sencha.com/products/sencha-cmd/download".blue + "\n\nSimply download the executable for your system and install it.".grey
    },
    run: function() {
      var me = this;
      exec("sencha which ",
        function(error, stdout, stderr) {
          var success = error === null,
            result = new TestResult(success, me.getName());
          result.setInstructions(me.getInstructions());
          if (success) {
            result.setMessage("Sencha CMD version " + stdout.replace(/[\n\r]/, ' found in ').replace(/[\n\r]/g, ''))
          } else {
            result.setMessage("Unable to locate Sencha CMD in your path");
          }
          deferred.resolve(result)
        }
      );
      return deferred.promise;
    }
  }
})
