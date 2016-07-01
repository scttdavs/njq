# No jQuery

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
