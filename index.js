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

  var hasClass = function(item, className) {
    if (item.classList) {
      return item.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(item.className);
    }
  };

  var getElFromInput = function(input) {
    if (typeof input === "string") {
      var tmp = document.implementation.createHTMLDocument();
      tmp.body.innerHTML = input;
      input = tmp.body.children[0];
    } else if (input.get) {
      input = input.get(0);
    }

    return input;
  }

  var wrappedElProto = {
    get: function(index) {
      if (this.getEl().length) {
        return this.getEl()[index];
      }
      return this.getEl();
    },

    each: function(func) {
      Array.prototype.forEach.call(this.getEl(), function(el, i) {
        func(i, el);
      });
      return this;
    },

    every: function(func) {
      return Array.prototype.every.call(this.getEl(), func);
    },

    map: function(func) {
      return Array.prototype.map.call(this.getEl(), func);
    },

    queryEach: function(func) {
      return wrappedEl(this.map(func));
    },

    hasClass: function(className) {
      return this.length > 0 && this.every(function(item) {
        return hasClass(item, className);
      });
    },

    text: function() {
      if (this.length === 1) {
        return this.get(0).textContent;
      }

      return Array.prototype.reduce.call(this.getEl(), function(previous, currentEl) {
        return currentEl.textContent + currentEl.textContent;
      });
    },

    children: function(selector) {
      var children = this.map(function(item) {
        return item.children[0];
      });

      if (selector) {
        children = children.filter(function(item) {
          return hasClass(item, selector);
        });
      }

      return wrappedEl(children);
    },

    find: function(selector) {
      return this.queryEach(function(item) {
        return item.querySelectorAll(selector);
      });
    },

    next: function() {
      return this.queryEach(function(item) {
        return item.nextElementSibling;
      });
    },

    prev: function() {
      return this.queryEach(function(item) {
        return item.previousElementSibling;
      });
    },

    addClass: function(className) {
      return this.each(function(i, item) {
        if (item.classList) {
          item.classList.add(className);
        } else {
          item.className += ' ' + className;
        }
      });
    },

    removeClass: function(className) {
      return this.each(function(i, item) {
        if (item.classList) {
          item.classList.remove(className);
        } else {
          item.className = item.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
      });
    },

    toggleClass: function(className) {
      return this.each(function(i, item) {
        if (item.classList) {
          item.classList.toggle(className);
        } else {
          var classes = item.className.split(' ');
          var existingIndex = classes.indexOf(className);

          if (existingIndex >= 0) {
            classes.splice(existingIndex, 1);
          } else {
            classes.push(className);
          }

          item.className = classes.join(' ');
        }
      });
    },

    show: function() {
      return this.each(function(i, item) {
        item.style.display = "";
      });
    },

    hide: function() {
      return this.each(function(i, item) {
        item.style.display = "none";
      });
    },

    empty: function() {
      return this.each(function(i, item) {
        item.innerHTML = '';
      });
    },

    html: function() {
      return this.get(0).innerHTML;
    },

    attr: function(attr, value) {
      if (value) {
        return this.each(function(i, item) {
          item.setAttribute(attr, value);
        });
      }
      return this.get(0).getAttribute(attr);
    },

    css: function(rule) {
      return getComputedStyle(this.get(0))[rule];
    },

    on: function(eventName, listener) {
      return this.each(function(i, item) {
        item.addEventListener(eventName, listener);
      });
    },

    off: function(eventName, listener) {
      return this.each(function(i, item) {
        item.removeEventListener(eventName, listener);
      });
    },

    trigger: function(eventName, data) {
      var newEvent;
      if (window.CustomEvent) {
        newEvent = new CustomEvent(eventName, { detail: data });
      } else {
        newEvent = document.createEvent('CustomEvent');
        newEvent.initCustomEvent(eventName, true, true, data);
      }
      this.get(0).dispatchEvent(newEvent);

      return this;
    },

    ready: function(fn) {
      if (document.readyState != 'loading'){
        fn();
      } else {
        document.addEventListener('DOMContentLoaded', fn);
      }

      return this;
    },

    append: function(childEl) {
      childEl = getElFromInput(childEl);
      return this.each(function(i, item) {
        item.appendChild(childEl);
      });
    },

    prepend: function(childEl) {
      childEl = getElFromInput(childEl);
      return this.each(function(i, item) {
        item.insertBefore(childEl, item.firstChild);
      });
    },

    is: function(selector) {
      return this.length > 0 && this.every(function(item) {
        return (item.matches || item.matchesSelector || item.msMatchesSelector || item.mozMatchesSelector || item.webkitMatchesSelector || item.oMatchesSelector).call(item, selector);
      });
    },

    // Check the reqs for this
    data: function(attr, value) {
      if (value) {
        return this.attr("data-" + attr, value);
      }

      return this.attr("data-"+ attr);
    }
  };

  function wrappedEl(el) {
    var obj = Object.create(wrappedElProto);
    obj.getEl = function() {
      return el;
    };
    obj.length = el.length;

    return obj;
  }

  var njq = function(selector) {
    if (selector === document || selector === window) {
      return wrappedEl(selector);
    }
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
