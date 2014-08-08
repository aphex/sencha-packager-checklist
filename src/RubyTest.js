var Class = require('classjs'),
  exec = require('child_process').exec,
  Q = require('Q'),
  deferred = Q.defer(),
  ITest = require('./ITest'),
  TestResult = require('./TestResult');


module.exports = Class.define("RubyTest", {
  interfaces: [ITest],
  members: {
    getName: function() {
      return "Ruby";
    },
    getInstructions: function() {
      return "Ruby is an open source programming langauge required by Compass to properly\n\
compile your enhanced SASS to CSS. To install Ruby on your system there are\n\
multiple options depending on your OS. Please visit\n\n".grey +
        "https://www.ruby-lang.org/en/installation/".cyan +
        "\n\nThen choose the option that works best for your system. OSX users will likely find\n\
homebrew to be the easiest method where windows users will likely use RubyInstaller.".grey;
    },
    run: function() {
      var me = this;
      exec("ruby -v",
        function(error, stdout, stderr) {
          var success = error === null,
            result = new TestResult(success, me.getName());
          result.setInstructions(me.getInstructions());
          if (success) {
            result.setMessage(stdout.replace(/[\n\r]/g, '') + " was found.")
          } else {
            result.setMessage("Unable to locate ruby in your path");
          }
          deferred.resolve(result)
        }
      );
      return deferred.promise;
    }
  }
})
