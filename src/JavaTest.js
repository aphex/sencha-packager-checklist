var Class = require('classjs'),
  exec = require('child_process').exec,
  Q = require('Q'),
  deferred = Q.defer(),
  ITest = require('./ITest'),
  TestResult = require('./TestResult');


module.exports = Class.define("JavaTest", {
  interfaces: [ITest],
  members: {
    getName: function() {
      return "Java";
    },
    getInstructions: function() {
      return "Java is a programming langauge and runtime that is required by many components \n\
of the Sencha CMD build process. In order to install Java please visit".grey + "\n\n" +
        "http://www.oracle.com/technetwork/java/javase/downloads/index.html".blue + "\n\n" +
        "From here you will want to download and run the latest version of the Java JRE.".grey;
    },
    run: function() {
      var me = this;
      exec("java -version",
        function(error, stdout, stderr) {
          var success = error === null,
            r = /version "([0-9._]+)"/g,
            result = new TestResult(success, me.getName()),
            version;
          result.setInstructions(me.getInstructions());

          version = r.exec((stdout || stderr));
          if (success) {
            if (version.length > 1) {
              version = version[1];
              result.setMessage("Java version '" + version + "' was found.");
            } else {
              result.setMessage((stdout || stderr).replace(/[\n\r]/g, ' ') + " was found.");
            }
          } else {
            result.setMessage("Unable to locate java in your path");
          }
          deferred.resolve(result)
        }
      );
      return deferred.promise;
    }
  }
})
