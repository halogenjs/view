var trigger = require("simulate-event");
var fixtures = require('./fixtures.js');

module.exports = {
  useFixture : function(id) {
    return JSON.parse(JSON.stringify(fixtures[id]));
  },
  setValueAndTrigger : function(el, value, event, options) {
    options || (options = {
      cancelable: true,
      bubbles: true
    });
    el.val(value);
    trigger(el.els[0], event, options);
  },

  simulateClick : function(el, options) {
    options || (options = {
      cancelable: true,
      bubbles: true
    });
    trigger(el.els[0], "click", options);
  }
}
