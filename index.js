// most code is from http://youmightnotneedjquery.com/
!function (name, context, definition) {
  if (typeof define == 'function') define(definition);
  else if (typeof module != 'undefined') module.exports = definition();
  else context[name] = definition();
}('$', this, function () {
  'use strict';

  var errorReachedMsg = "NjqError: Server reached, but returned an error";
  var errorNotReachedMsg = "NjqError: Connection error, server not reached";
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
        throw new NjqError(errorReachedMsg);
      }
    };

    request.onerror = function(e) {
      // There was a connection error of some sort
      throw new NjqError(errorNotReachedMsg);
    };

    request.send();
  }

  njq.ajax = function(options) {
    var request = new XMLHttpRequest();
    request.open(options.type, options.url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        options.success(request.responseText);
      } else {
        // We reached our target server, but it returned an error
        options.error(new NjqError(errorReachedMsg));
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      options.error(new NjqError(errorNotReachedMsg));
    };

    request.send(options.data);
  };

  return njq;
});
