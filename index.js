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

  var slice = Array.prototype.slice;

  var flatten = function(arr, final) {
    final = final || [];
    arr.forEach(function(i) {
      if (Array.isArray(i)) {
        final = final.concat(flatten(i));
      } else {
        final.push(i);
      }
    });
    return final;
  };

  var isDomElement = function(o) {
    return (
      typeof Node === "object" ? o instanceof Node :
      o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
    ) || (
      typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
  };

  var isDomCollection = function(obj) {
      return HTMLCollection.prototype.isPrototypeOf(obj) || NodeList.prototype.isPrototypeOf(obj);
  };

  var hasClass = function(item, className) {
    if (item.classList) {
      return item.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(item.className);
    }
  };

  var camelCase = function(str) {
    return str.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
  };

  var pxOrInt = function(value) {
    return (value^0) === value ? value + "px" : value;
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
  };

  var setHeightOrWidth = function(rule, value) {
    if (value) {
      return this.each(function() {
        this.style[rule] = pxOrInt(value);
      });
    }

    return this.get(0).getBoundingClientRect()[rule];
  };

  var pseudoSelectors = {
    last: function(items) {
      return items.last().get(0);
    },

    first: function(items) {
      return items.first().get(0);
    }
  };

  var getPseudoSelector = function(selector) {
    var selectors = selector.split(' ');
    var results;
    selectors.forEach(function(sel) {
      var sels = sel.split(":");
      results = results ? results.find(sels[0]) : njq(sels[0]);

      if (sels[1]) {
        var r = pseudoSelectors[sels[1]](results);
        results = njq(r);
      }
    });

    return results.length === undefined ? [results] : results;;
  };

  var wrappedElProto = {
    get: function(index) {
      if (this.getEl().length) {
        return this.getEl()[index];
      }
      return this.getEl();
    },

    each: function(func) {
      var els = this.getEl();
      for(var i = 0; i < this.length; i++) {
        func.call(els[i], i);
      }
      
      return this;
    },

    every: function(func) {
      return Array.prototype.every.call(this.getEl(), func);
    },

    map: function(func) {
      return Array.prototype.map.call(this.getEl(), func);
    },

    queryEach: function(func) {
      return njq(flatten(this.map(func)));
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

      return njq(children);
    },

    find: function(selector) {
      return this.queryEach(function(item) {
        // TODO fix this
        // if (selector.indexOf(":") > -1) {
        //   return getPseudoSelector(selector);
        // }
        return slice.call(item.querySelectorAll(selector));
      });
    },

    first: function() {
      return njq(this.get(0));
    },

    last: function() {
      return njq(this.get(this.length - 1));
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
      return this.each(function() {
        if (this.classList) {
          this.classList.add(className);
        } else {
          this.className += ' ' + className;
        }
      });
    },

    removeClass: function(className) {
      return this.each(function() {
        if (this.classList) {
          this.classList.remove(className);
        } else {
          this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
      });
    },

    toggleClass: function(className) {
      return this.each(function() {
        if (this.classList) {
          this.classList.toggle(className);
        } else {
          var classes = this.className.split(' ');
          var existingIndex = classes.indexOf(className);

          if (existingIndex >= 0) {
            classes.splice(existingIndex, 1);
          } else {
            classes.push(className);
          }

          this.className = classes.join(' ');
        }
      });
    },

    display: function(value) {
      return this.each(function() {
        this.style.display = value;
      });
    },

    toggle: function() {
      return this.each(function() {
        this.style.display = this.style.display === "none" ? "" : "none";
      });
    },

    show: function() {
      return this.display("");
    },

    hide: function() {
      return this.display("none");
    },

    empty: function() {
      return this.each(function() {
        this.innerHTML = '';
      });
    },

    html: function() {
      return this.get(0).innerHTML;
    },

    attr: function(attr, value) {
      if (value) {
        return this.each(function() {
          this.setAttribute(attr, value);
        });
      }
      return this.get(0).getAttribute(attr);
    },

    css: function(rule, value) {
      if (value) {
        return this.each(function() {
          this.style[camelCase(rule)] = value;
        });
      }
      return getComputedStyle(this.get(0))[rule];
    },

    width: function(value) {
      return setHeightOrWidth.call(this, "width", value);
    },

    height: function(value) {
      return setHeightOrWidth.call(this, "height", value);
    },

    on: function(eventName, listener) {
      return this.each(function() {
        this.addEventListener(eventName, listener);
      });
    },

    off: function(eventName, listener) {
      return this.each(function() {
        this.removeEventListener(eventName, listener);
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
      return this.each(function() {
        this.appendChild(childEl.cloneNode(true));
      });
    },

    prepend: function(childEl) {
      childEl = getElFromInput(childEl);
      return this.each(function() {
        this.insertBefore(childEl.cloneNode(true), this.firstChild);
      });
    },

    is: function(selector) {
      return this.length > 0 && this.every(function(item) {
        return (item.matches || item.matchesSelector || item.msMatchesSelector || item.mozMatchesSelector || item.webkitMatchesSelector || item.oMatchesSelector).call(item, selector);
      });
    },

    // Check the reqs for this
    data: function(attr, value) {
      return this.attr("data-" + attr, value);
    },

    val: function(value) {
      return this.attr("value", value);
    }
  };

  function WrappedEl(el) {
    this.getEl = function() {
      return el;
    };
    this.length = el.length;
  }

  var njq = function(selector) {
    if (selector === document || selector === window) {
      return new WrappedEl(selector);
    }

    if (isDomElement(selector)) {
      return new WrappedEl([selector]);
    }

    if (Array.isArray(selector) || isDomCollection(selector)) {
      return new WrappedEl(selector);
    }

    // has pseudo selector
    if (selector.indexOf(":") > -1) {
      return getPseudoSelector(selector);
    }

    return new WrappedEl(document.querySelectorAll(selector));
  };

  njq.fn = WrappedEl.prototype = wrappedElProto;


  // TODO tests for map and each
  njq.map = function(items, callback) {
    Array.prototype.map.call(items, callback);
  };

  njq.each = function(items, callback) {
    Array.prototype.each.call(items, function(el, i) {
      callback(i, el);
    });
  };

  njq.support = {}; // bootstrap

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
