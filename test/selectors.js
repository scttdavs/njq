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
    expect(foos.hasClass(BAR)).to.be.true;
    expect(foos.length).to.equal(1);
  });

  it("gets the first element", function() {
    var el = createElement("div", FOO);
    var foo = createElement("div", FOO);
    el.className = "foo";
    addToDocument(el);
    addToDocument(foo);

    var foos = njq("#foo:first");
    expect(foos.hasClass(FOO)).to.be.true;
    expect(foos.length).to.equal(1);
  });

  it("gets the first element with complex selector", function() {
    var a = createElement("a", BAR);
    var b = createElement("a", BAR);
    var el = createElement("div", FOO);
    var foo = createElement("div", FOO);
    foo.className = FOO;
    a.className = BAR
    el.appendChild(a);
    foo.appendChild(b);
    addToDocument(el);
    addToDocument(foo);

    var foos = njq("#foo:first a");
    expect(foos.hasClass(BAR)).to.be.true;
    expect(foos.length).to.equal(1);
  });

  it("gets the visible elements", function() {
    var el = createElement("div", BAR);
    var foo = createElement("div", FOO);
    var bar = createElement("div", BAR);
    foo.style.visibility = "hidden";
    el.style.opacity = 0;
    bar.className = FOO;
    addToDocument(el);
    addToDocument(foo);
    addToDocument(bar);

    var foos = njq("div:visible");
    expect(foos.hasClass(FOO)).to.be.true;
    expect(foos.length).to.equal(1);
  });

  it("gets the first element with complex selector and visible", function() {
    var a = createElement("a", BAR);
    var b = createElement("a", BAR);
    var el = createElement("div", FOO);
    var el2 = createElement("div", FOO);
    var el3 = createElement("div", FOO);
    el.style.opacity = 0;
    el2.className = FOO;
    a.className = BAR
    el2.appendChild(a);
    el3.appendChild(b);
    addToDocument(el);
    addToDocument(el2);
    addToDocument(el3);

    var foos = njq("#foo:visible a:first");
    expect(foos.hasClass(BAR)).to.be.true;
    expect(foos.length).to.equal(1);
  });
});
