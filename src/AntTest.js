var Class = require('classjs'),
  exec = require('child_process').exec,
  Q = require('Q'),
  deferred = Q.defer(),
  ITest = require('./ITest'),
  TestResult = require('./TestResult');


module.exports = Class.define("AntTest", {
  interfaces: [ITest],
  members: {
    getName: function() {
      return "Apache ANT";
    },
    getInstructions: function() {
      return "Apache ANT is a Java library and command line tool for running build proccesses.\n\n\
In order to build Android applications locally will need ANT to be installed on your\n\
system and available in your path at anytime.\n\nIf you are a Mac user and have Homebrew installed ".grey +
        "(http://brew.sh/)".blue + " you can simple run\n".grey +
        "brew install ant".cyan + "\n\nTo manually Install Apache Ant first visit\n".grey +
        "http://ant.apache.org/bindownload.cgi\n".blue +
        "\nHere you will download a zipped binary distrubition of ANT. Once downloaded you can unzip this\n\
anywhere onyour system. For example on OSX you could use ".grey + "'/usr/local/ant'".cyan + " as your root.\n\
On windows you could use ".grey + "c:\\Program Files\\Ant".cyan + "\n\nOnce you have downloaded and installed \
ant you will need to make it is added correctly to your system path.\nFor Windows users you will \
want to open your Environmental Variables and add the following to your Path\n".grey +
        "c:\\Program Files\\Ant\\bin\n\n".cyan +
        "OSX users have a few options\nFirst options is to edit there ~/.bash_profile and add the following lines\n".grey +
        "export PATH = $PATH:/usr/local/ant/bin".cyan + "\n\nThe Second option is to symlink the binary by running\n".grey +
        "ln -s /usr/local/ant/bin/ant /usr/bin/ant".cyan;
    },
    run: function() {
      var me = this;
      exec("ant -version",
        function(error, stdout, stderr) {
          var success = error === null,
            result = new TestResult(success, me.getName());
          result.setInstructions(me.getInstructions());
          if (success) {
            result.setMessage(stdout.replace(/[\n\r]/g, '') + " was found.")
          } else {
            result.setMessage("Unable to locate ant in your path");
          }
          deferred.resolve(result)
        }
      );
      return deferred.promise;
    }
  }
})
