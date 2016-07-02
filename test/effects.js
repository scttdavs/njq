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

describe("Effects", function() {
  afterEach(function() {
    document.body.innerHTML = "";
  });

  it("hides", function() {
    var el = createElement("div", FOO);
    addToDocument(el);

    expect(el.style.display).to.equal("");
    var newEl = njq("#foo").hide();
    expect(el.style.display).to.equal("none");
  });

  it("shows", function() {
    var el = createElement("div", FOO);
    addToDocument(el);

    el.style.display = "none";
    expect(el.style.display).to.equal("none");
    var newEl = njq("#foo").show();
    expect(el.style.display).to.equal("");
  });
});
