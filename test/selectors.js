/* globals document, window, require, describe, it, afterEach */
"use strict";

var chai = require("chai");
var expect = chai.expect;
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

describe("Query Selectors", function() {
  afterEach(function() {
    document.body.innerHTML = "";
  });

  it("gets the last element", function() {
    var el = createElement("div", FOO);
    var foo = createElement("div", FOO);
    foo.className = "foo";
    addToDocument(el);
    addToDocument(foo);

    var foos = njq("#foo:last");
    expect(foos.hasClass(FOO)).to.be.true;
    expect(foos.length).to.equal(1);
  });

  it("gets the last element with complex selector", function() {
    var a = createElement("a", BAR);
    var b = createElement("a", BAR);
    var el = createElement("div", FOO);
    var foo = createElement("div", FOO);
    foo.className = FOO;
    b.className = BAR
    el.appendChild(a);
    foo.appendChild(b);
    addToDocument(el);
    addToDocument(foo);

    var foos = njq("#foo:last a");
    console.log("RETURN", foos.getEl());
    expect(foos.hasClass(BAR)).to.be.true;
    expect(foos.length).to.equal(1);
  });
});
