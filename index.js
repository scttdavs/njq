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

        var hasClassCurry = function(item) {
          return hasClass(item, className);
        };

        return Array.prototype.every.call(el, hasClassCurry);
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

      removeClass: function(className) {
        this.each(function(i, item) {
          if (item.classList) {
            item.classList.remove(className);
          } else {
            item.className = item.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
          }
        });

        return this;
      },

      toggleClass: function(className) {
        this.each(function(i, item) {
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
      },

      text: function() {
        if (this.length === 1) {
          return this.get(0).textContent;
        }

        return Array.prototype.reduce.call(el, function(previous, currentEl) {
          return currentEl.textContent + currentEl.textContent;
        });
      },

      children: function(selector) {
        var children = Array.prototype.map.call(el, function(item) {
          return item.children[0];
        });

        if (selector) {
          children = children.filter(function(item) {
            return hasClass(item, selector);
          });
        }

        return wrappedEl(children);
      },

      attr: function(attr) {
        return this.get(0).getAttribute(attr);
      },

      css: function(rule) {
        return getComputedStyle(this.get(0))[rule];
      },

      on: function(eventName, listener) {
        var listenerWrapper = function(data) {
          listener(data.detail || data);
        }
        this.each(function(i, item) {
          item.addEventListener(eventName, listenerWrapper);
        });

        return this;
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
