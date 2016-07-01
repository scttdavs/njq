// most code is from http://youmightnotneedjquery.com/
!function (name, context, definition) {
  if (typeof define == 'function') define(definition);
  else if (typeof module != 'undefined') module.exports = definition();
  else context[name] = definition();
}('$', this, function () {
  'use strict';

  var NjqError = function(message) {
  	this.message = message;
  };
  NjqError.prototype = Object.create(NjqError.prototype);

  var njq = {};

  njq.getJSON = function(string, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', string, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        callback(JSON.parse(request.responseText));
      } else {
        // We reached our target server, but it returned an error
        throw new NjqError("NjqError: Server reached, but returned an error");
      }
    };

    request.onerror = function(e) {
      console.log(e.target.status);
      console.log(e.target);
      console.log(e);
      // There was a connection error of some sort
      throw new NjqError("NjqError: Connection error, server not reached");
    };

    request.send();
  }

  return njq;
});
