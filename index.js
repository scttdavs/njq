// most code is from http://youmightnotneedjquery.com/
!function (name, context, definition) {
  if (typeof define == 'function') define(definition);
  else if (typeof module != 'undefined') module.exports = definition();
  else context[name] = definition();
}('$', this, function () {


  var emptyArray = [];
  var isArray = Array.isArray ||
      function(object) { return object instanceof Array };
  var errorReachedMsg = "NjqError: Server reached, but returned an error";
  var errorNotReachedMsg = "NjqError: Connection error, server not reached";
  var NjqError = function(message) {
  	this.message = message;
  };
  NjqError.prototype = Object.create(NjqError.prototype);

  var flatten = function(arr, final) {
    final = final || [];
    arr.forEach(function(i) {
      if (isArray(i)) {
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
    },

    visible: function(items) {
      return emptyArray.filter.call(items, function(el) {
        var computedStyle = getComputedStyle(el);
        return !(parseFloat(computedStyle.opacity) === 0 || computedStyle.visibility === "hidden");
      })
    }
  };

  var getPseudoSelector = function(selector) {
    var selectors = selector.split(' ');
    var results;
    selectors.forEach(function(sel) {
      var sels = sel.split(":");
      results = results ? results.find(sels[0]) : $(sels[0]);

      if (sels[1]) {
        results = $(pseudoSelectors[sels[1]](results));
      }
    });

    return results.length === undefined ? [results] : results;;
  };

  var $ = function(selector) {
    return njq.init(selector);
  };

  $.fn = {
    constructor: N,
    length: 0,
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    splice: emptyArray.splice,
    indexOf: emptyArray.indexOf,
    every: emptyArray.every,

    get: function(index) {
      if (this.length) {
        return this[index];
      }
      return this;
    },

    each: function(callback){
      this.every(function(el, id){
        return callback.call(el, id, el) !== false
      });

      return this
    },

    // TODO tests
    // filter: function(selector){
    //   if (isFunction(selector)) return this.not(this.not(selector))
    //   return $(filter.call(this, function(element){
    //     return this.is(element, selector)
    //   }))
    // },

    // TODO tests
    // map: function(func){
    //   return $($.map(this, function(el, i) { return func.call(el, i, el) }));
    // },

    map: function(func) {
      return emptyArray.map.call(this, func);
    },

    // TODO tests
    // slice: function(){
    //   return $(emptyArray.slice.apply(this, arguments))
    // },

    queryEach: function(func) {
      return $(flatten(this.map(func)));
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

      return emptyArray.reduce.call(this, function(previous, currentEl) {
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

      return $(children);
    },

    find: function(selector) {
      return this.queryEach(function(item) {
        // TODO fix this
        // if (selector.indexOf(":") > -1) {
        //   return getPseudoSelector(selector);
        // }
        return emptyArray.slice.call(item.querySelectorAll(selector));
      });
    },

    first: function() {
      return $(this.get(0));
    },

    last: function() {
      return $(this.get(this.length - 1));
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

  var N = function(dom, selector) {
    var i, len = dom ? dom.length : 0
    for (i = 0; i < len; i++) this[i] = dom[i]
    this.length = len
    this.selector = selector || ''
  };

  var njq = {};

  njq.init = function(selector) {
    var ret;

    if (selector === document || selector === window) {
      ret = [selector];
    } else if (isDomElement(selector)) {
      ret = [selector];
    } else if (isArray(selector) || isDomCollection(selector)) {
      ret = emptyArray.slice.call(selector);
    } else if (selector.indexOf(":") > -1) {
      ret = getPseudoSelector(selector);
    } else {
      ret = document.querySelectorAll(selector);
    }

    return new N(ret, selector);
  };

  N.prototype = $.fn

  // TODO tests for map and each
  // $.map = function(items, callback) {
  //   emptyArray.map.call(items, callback);
  // };
  //
  // $.each = function(items, callback) {
  //   emptyArray.each.call(items, function(el, i) {
  //     callback(i, el);
  //   });
  // };

  $.support = {}; // bootstrap

  $.getJSON = function(string, callback) {
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

  $.ajax = function(options) {
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

  return $;
});
