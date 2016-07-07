# No jQuery

[![Build Status](https://travis-ci.org/scttdavs/njq.svg?branch=master)](https://travis-ci.org/scttdavs/njq)

No jQuery - an alternative vanillia js implementation of jQuery's most used features. Code taken from youmightnotneedjquery.com

1. [Install](#install)
1. [Feature](#features)
1. [Testing](#testing)

## Install


## Features

### Ajax

#### getJSON
```javascript
njq.getJSON("/some/path", function(data) {
  console.log("JSON:", data);
});
```

#### ajax (GET)
```javascript
njq.ajax({
  type: "GET",
  url: "/some/path",
  success: function(data) {
    console.log("RESULT:", data);
  },
  error: function() {
    // error
  }
});
```

#### ajax (POST)
```javascript
njq.ajax({
  type: "POST",
  url: "/some/path",
  data: { test: true },
  success: function(data) {
    console.log("RESULT:", data);
  },
  error: function() {
    // error
  }
});
```

### Elements

#### selector
```javascript
var foo = njq("#foo");
foo.find("#bar").length; // some number
```

#### find
```javascript
var foo = njq("#foo");
foo.find("#bar").length; // some number
```

#### next
```javascript
var foo = njq("#foo"); // <div id="foo">foo</div><div id="bar">bar</div>
foo.next(); // <div id="bar">bar</div>
```

#### prev
```javascript
var foo = njq("#bar"); // <div id="foo">foo</div><div id="bar">bar</div>
foo.prev(); // <div id="foo">foo</div>
```

#### is
```javascript
var foo = njq(".foo");
foo.is(".foo"); // true
```

#### hasClass
```javascript
var foo = njq(".foo");
foo.hasClass("foo"); // true
```

#### addClass
```javascript
var foo = njq(".foo");
foo.addClass("bar");
foo.hasClass("bar"); // true
```

#### removeClass
```javascript
var foo = njq(".foo"); // <div class="foo bar">stuff</div>
foo.removeClass("bar"); //
foo.hasClass("bar"); // false
```

#### toggleClass
```javascript
var foo = njq(".foo"); // <div class="foo">stuff</div>
foo.toggleClass("bar"); //
foo.hasClass("bar"); // true
```

#### toggle
```javascript
var foo = njq(".foo"); // <div class="foo">stuff</div>
foo.toggle(); // <div class="foo" style="display: none;">stuff</div>
```

#### width
```javascript
var foo = njq(".foo"); // <div class="foo">stuff</div>
foo.width("100px"); // <div class="foo" style="width: 100px;">stuff</div>
foo.width(); // 100
```

#### height
```javascript
var foo = njq(".foo"); // <div class="foo">stuff</div>
foo.height("100px"); // <div class="foo" style="height: 100px;">stuff</div>
foo.height(); // 100
```

#### each
```javascript
var foo = njq(".foo");
foo.each(function(el) {
  console.log(el);
});
```

#### empty
```javascript
var foo = njq(".foo"); // <div class="foo">BAR</div>
foo.empty(); // <div class="foo"></div>
```

#### html
```javascript
var foo = njq(".foo"); // <div class="foo">BAR</div>
foo.html(); // BAR
```

#### text
```javascript
var foo = njq(".foo"); // <div class="foo"><span>BAR</span></div>
foo.text(); // BAR
```

#### children
```javascript
var foo = njq(".foo"); // <div class="foo"><span>BAR</span></div>
foo.children(); // <span>BAR</span>
```

#### append
```javascript
var foo = njq(".foo").append("<p>bar</p>"); // <div class="foo">stuff<p>bar</p></div>
```

#### prepend
```javascript
var foo = njq(".foo").prepend("<p>bar</p>"); // <div class="foo"><p>bar</p>stuff</div>
```

#### attr
```javascript
var foo = njq(".foo"); // <div class="foo" data-bar="bar"></div>
foo.attr("data-bar"); // bar
foo.attr("data-bar", "fooBar");
```

#### val
```javascript
var foo = njq("#foo"); // <input id="foo" type="text" value="foo" />
foo.val(); // foo
foo.val("bar"); // bar
```

#### data
```javascript
var foo = njq(".foo"); // <div class="foo" data-bar="bar"></div>
foo.data("bar"); // bar
foo.data("bar", "newBar");
```

#### css
```javascript
var foo = njq(".foo"); // <div class="foo" style="color: red;"></div>
foo.css("color"); // red
foo.css("color", "blue"); // blue
```

### Events

#### on
```javascript
njq(".foo").on("bar", function(data) {
  console.log(data);
}).trigger("bar", "foobar");
// LOG foobar
```

#### off
```javascript
var listener = function(data) {
  console.log(data);
};
njq(".foo").on("bar", listener).off("bar", listener).trigger("bar", "foobar");
// LOG nothing happens
```

#### trigger
```javascript
njq(".foo").on("bar", function(data) {
  console.log(data);
}).trigger("bar", "foobar");
// LOG foobar
```

#### ready
```javascript
njq(document).ready(function() {
  // document is ready
});
```

### Effects

#### hide
```javascript
var foo = njq(".foo").hide(); // sets display to none;
```

#### show
```javascript
var foo = njq(".foo").show(); // removes display value
```

## Testing

`npm test`
