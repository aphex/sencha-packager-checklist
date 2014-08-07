var Class = require('classjs');

module.exports = Class.define("TestResult", {
  constructor: function(success, name, message, skip) {
    this.setSuccess(success);
    this.setName(name || "unknown");
    this.setMessage(message || "");
    this.setSkipped(skip || false);
  },
  properties: {
    success: "Boolean",
    skipped: "Boolean",
    name: "String",
    message: "String",
    instructions: "String"
  }
});
