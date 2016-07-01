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

  function wrappedEl(el) {
    var obj = Object.create({
      get: function(index) {
        return el[index];
      },

      each: function(func) {
        Array.prototype.forEach.call(el, function(el, i) {
          func(i, el);
        });
      },

      find: function(selector) {
        var results = [];
        this.each(function(i, item) {
          results = results.concat(item.querySelectorAll(selector));
        });

        return wrappedEl(results);
      },

      length: el.length,

      hasClass: function(className) {
        if (el.length === 0) {
          return false;
        }

        return Array.prototype.every.call(el, function(item) {
          if (item.classList) {
            return item.classList.contains(className);
          } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(item.className);
          }
        });
      },

      addClass: function(className) {
        this.each(function(i, item) {
          if (item.classList) {
            item.classList.add(className);
          } else {
            item.className += ' ' + className;
          }
        });

        return this;
      },

      setDisplay: function(value) {
        this.each(function(i, item) {
          item.style.display = value;
        });
        return this;
      },

      show: function() {
        return this.setDisplay("");
      },

      hide: function() {
        return this.setDisplay("none");
      },

      empty: function() {
        this.each(function(i, item) {
          item.innerHTML = '';
        });

        return this;
      },

      html: function() {
        return this.get(0).innerHTML;
      }
    });

    return obj;
  }

  var njq = function(selector) {
    return wrappedEl(document.querySelectorAll(selector));
  };

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
  };

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
