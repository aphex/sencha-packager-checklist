var Class = require('classjs'),
  exec = require('child_process').exec,
  Q = require('Q'),
  deferred = Q.defer(),
  ITest = require('./ITest'),
  TestResult = require('./TestResult');


module.exports = Class.define("ADBTest", {
  interfaces: [ITest],
  members: {
    getName: function() {
      return "Android ADB";
    },
    getInstructions: function() {
      return "ADB is short for the Android Debug Bridge and should be available on any system \
where the Android SDK is properly installed.\nThe Android SDK can be downloaded here ".grey +
        "https://developer.android.com/sdk/installing/index.html?pkg=tools".blue +
        "\n\nFollow the instructions on the android devloper website for installing the SDK. \
Once installed you will need to add the SDK to your PATH.\nFor Windows users you will \
want to open your Environmental Variables and add the following to your Path\n".grey +
        "c:\\path\\to\\android-sdk-windows\\platform-tools\\\nc:\\path\\to\\android-sdk-windows\\tools\\\n\n".cyan +
        "OSX users will want to edit there ~/.bash_profile and add the following lines\n".grey +
        "export PATH = $PATH:/path/to/android-sdk-mac_x86/platform-tools/\nexport PATH = $PATH:/path/to/android-sdk-mac_x86/tools".cyan;
    },
    run: function() {
      var me = this;
      exec("adb version",
        function(error, stdout, stderr) {
          var success = error === null,
            result = new TestResult(success, me.getName());
          result.setInstructions(me.getInstructions());
          if (success) {
            result.setMessage(stdout.replace(/[\n\r]/g, '') + " was found.")
          } else {
            result.setMessage("Unable to locate adb in your path");
          }
          deferred.resolve(result)
        }
      );
      return deferred.promise;
    }
  }
})
