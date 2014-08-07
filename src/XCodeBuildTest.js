var Class = require('classjs'),
  exec = require('child_process').exec,
  Q = require('Q'),
  deferred = Q.defer(),
  ITest = require('./ITest'),
  TestResult = require('./TestResult');

module.exports = Class.define('XCodeBuildTest', {
  interfaces: [ITest],
  members: {
    getName: function() {
      return 'xcodebuild';
    },
    getInstructions: function() {
      return "xcodebuild is the command line bridge to building your iOS applications.\n\
Without it you will not be able to build or run xcode projects from the command line.\n\
First you must ensure you have xcode installed on your system. This can be done by visiting\n\n".grey +
        "https://developer.apple.com/xcode/downloads/".blue + "\n\n" +
        "From here you can select 'View on the Mac App Store' followed by clicking the Free button to start the download and installation.\n\
Once installed you now must add the command line tools. Do this by opening a terminal window and running the following command\n\n".grey +
        "xcode-select --install\n\n".cyan +
        "You will then be prompted to install the Command line tools.".grey;
    },
    isMac: function() {
      return /^darwin/.test(process.platform);
    },
    run: function() {
      if (!this.isMac()) {
        return new TestResult(true, this.getName(), "Test is OSX Only", true);
      }
      var me = this;
      exec('xcodebuild -version',
        function(error, stdout, stderr) {
          var success = error === null,
            result = new TestResult(success, me.getName());
          if (success) {
            result.setMessage('xcodebuild found with ' + stdout.replace(/[\n\r]/, ' at ').replace(/[\n\r]/g, '') + '.')
          } else {
            result.setMessage('Unable to locate xcodebuild in your path');
          }
          deferred.resolve(result)
        }
      );
      return deferred.promise;
    }
  }
})
