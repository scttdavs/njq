/* globals document, window, require, describe, it, afterEach */
"use strict";

var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;
var njq = require("./../");

var BAR = "bar";
var FOO = "foo";

var createElement = function(tag, id) {
  var el = document.createElement(tag);
  if (id) {
    el.setAttribute("id", id);
  }
  return el;
};

var addToDocument = function(el) {
  document.body.appendChild(el);
};

describe("Events", function() {
  afterEach(function() {
    document.body.innerHTML = "";
  });

  it("adds an event listener", function(done) {
    var foo;
    var listener = function(data) {
      expect(data.detail).to.equal(BAR);
      done();
    };
    var el = createElement("div", FOO);
    addToDocument(el);
    njq("#foo").on(FOO, listener).trigger(FOO, BAR);
  });

  it("removes an event listener", function() {
    var foo;
    var listener = function(data) {
      assert.fail("this", "should not run");
    };
    var el = createElement("div", FOO);
    addToDocument(el);
    foo = njq("#foo")
          .on(FOO, listener)
          .off(FOO, listener)
          .trigger(FOO, BAR);

  });

  it("triggers an event", function(done) {
    var foo;
    var listener = function(data) {
      var result = data.detail || data;
      expect(result).to.equal(BAR);
      done();
    };
    var el = createElement("div", FOO);
    addToDocument(el);
    foo = document.getElementById(FOO).addEventListener(FOO, listener);
    njq("#foo").trigger(FOO, BAR);
  });
});
