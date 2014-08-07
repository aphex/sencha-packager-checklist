var Class = require('classjs'),
  exec = require('child_process').exec,
  Q = require('Q'),
  deferred = Q.defer(),
  ITest = require('./ITest'),
  TestResult = require('./TestResult');


module.exports = Class.define('iOSSimTest', {
  interfaces: [ITest],
  members: {
    getName: function() {
      return 'ios-sim';
    },
    getInstructions: function() {
      return "ios-sim can be installed as a node module. Run the following command \
from your Command Prompt or Terminal window.\n".grey + "npm install -g ios-sim".cyan + "\n\n\
You may need to run this with Root permissions to do so run the command\n".grey +
        "sudo npm install -g ios-sim".cyan + "\n\nYou will then be prompted for your root password.\n\n".grey +
        "For more information go to ".grey + "https://www.npmjs.org/package/ios-sim".blue;
    },
    isMac: function() {
      return /^darwin/.test(process.platform);
    },
    run: function() {
      if (!this.isMac()) {
        return new TestResult(true, this.getName(), "Test is OSX Only", true);
      }
      var me = this;
      exec('ios-sim --version',
        function(error, stdout, stderr) {
          var success = error === null,
            result = new TestResult(success, me.getName());
          if (success) {
            result.setMessage('ios-sim version ' + stdout.replace(/[\n\r]/g, '') + ' was found.')
          } else {
            result.setMessage('Unable to locate ios-sim in your path');
          }
          deferred.resolve(result)
        }
      );
      return deferred.promise;
    }
  }
})
