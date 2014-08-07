var Class = require('classjs'),
  exec = require('child_process').exec,
  Q = require('Q'),
  deferred = Q.defer(),
  ITest = require('./ITest'),
  TestResult = require('./TestResult');


module.exports = Class.define("CordovaTest", {
  interfaces: [ITest],
  members: {
    getName: function() {
      return "Cordova CLI";
    },
    getInstructions: function() {
      return "Cordova CLI can be installed as a node module. Run the following command \
from your Command Prompt or Terminal window.\n".grey + "npm install -g cordova".cyan + "\n\n\
If you are on OSX you may need to run this with Root permissions to do so run the command\n".grey +
        "sudo npm install -g cordova".cyan + "\n\nYou will then be prompted for your root password..\n\n".grey +
        "For more information go to ".grey + "https://github.com/apache/cordova-cli".blue + " or see ".grey + "http://docs.phonegap.com/".blue;
    },
    run: function() {
      var me = this;
      exec("cordova -v",
        function(error, stdout, stderr) {
          var success = error === null,
            result = new TestResult(success, me.getName());
          if (success) {
            result.setMessage("Cordova version " + stdout.replace(/[\n\r]/g, '') + " was found.")
          } else {
            result.setMessage("Unable to locate cordova in your path");
            result.setInstructions(me.getInstructions());
          }
          deferred.resolve(result)
        }
      );
      return deferred.promise;
    }
  }
})
