# No jQuery

No jQuery - an alternative vanillia js implementation of jQuery's most used features. Code taken from youmaynotneedjquery.com

1. [Install](#install)
1. [Feature](#features)
1. [Testing](#testing)

## Install


## Features

### Ajax

```javascript
njq.getJSON("/some/path", function(data) {
  console.log("JSON:", data);
});

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

## Testing

`npm test`
