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

describe("Query Elements", function() {
  afterEach(function() {
    document.body.innerHTML = "";
  });

  it("gets elements", function() {
    var el = createElement("div", FOO);
    addToDocument(el);

    expect(njq("#foo").length).to.equal(1);
  });

  it("gets finds elements within", function() {
    var el = createElement("div", FOO);
    var bar = createElement("div", BAR);
    el.appendChild(bar);
    addToDocument(el);

    expect(njq("#foo").find("#bar").length).to.equal(1);
  });

  it("gets the next element", function() {
    var el = createElement("div", FOO);
    var bar = createElement("div", BAR);
    addToDocument(el);
    addToDocument(bar);

    expect(njq("#foo").next().get(0)).to.equal(bar);
  });

  it("gets the prev element", function() {
    var el = createElement("div", FOO);
    var bar = createElement("div", BAR);
    addToDocument(el);
    addToDocument(bar);

    expect(njq("#bar").prev().get(0)).to.equal(foo);
  });

  it("tests for a class", function() {
    var el = createElement("div", FOO);
    el.className = FOO;
    addToDocument(el);

    expect(njq("#foo").hasClass(FOO)).to.be.true;
  });

  it("adds a class", function() {
    var el = createElement("div", FOO);
    addToDocument(el);

    var newClass = njq("#foo").addClass(BAR);
    expect(newClass.hasClass(BAR)).to.be.true;
  });

  it("toggles a class", function() {
    var el = createElement("div", FOO);
    addToDocument(el);

    var newClass = njq("#foo").toggleClass(BAR);
    expect(newClass.hasClass(BAR)).to.be.true;
  });

  it("removes a class", function() {
    var el = createElement("div", FOO);
    el.className = "foobar";
    addToDocument(el);

    var foo = njq("#foo");
    expect(foo.hasClass("foobar")).to.be.true;
    foo.removeClass("foobar");
    expect(foo.hasClass("foobar")).to.be.false;
  });

  it("empties an element", function() {
    var el = createElement("div", FOO);
    var bar = createElement("div", BAR);
    el.appendChild(bar);
    addToDocument(el);

    var foo = njq("#foo");
    expect(foo.get(0).innerHTML).to.not.be.empty;
    foo.empty();
    expect(foo.get(0).innerHTML).to.be.empty;
  });

  it("gets html", function() {
    var el = createElement("div", FOO);
    var bar = createElement("div", BAR);
    el.appendChild(bar);
    addToDocument(el);

    var foo = njq("#foo");
    expect(foo.html()).to.equal('<div id="bar"></div>');
  });

  it("gets text", function() {
    var el = createElement("div", FOO);
    var span = createElement("span", BAR);
    span.className = FOO;
    el.className = FOO;
    span.innerHTML = "<span>bar</span>";
    el.appendChild(span);
    addToDocument(el);
    addToDocument(span);

    var foo = njq(".foo");
    expect(foo.text()).to.equal("barbar");
  });

  it("gets child elements", function() {
    var el = createElement("div", FOO);
    var span = createElement("span", BAR);
    span.className = BAR;
    el.appendChild(span);
    addToDocument(el);

    var foo = njq("#foo");
    expect(foo.children().get(0)).to.equal(span);
    expect(foo.children(FOO).length).to.equal(0);
  });

  it("gets an attribute", function() {
    var el = createElement("div", FOO);
    el.setAttribute("data-bar", BAR);
    addToDocument(el);

    var foo = njq("#foo");
    expect(foo.attr("data-bar")).to.equal(BAR);
  });

  it("gets a css rule", function() {
    var el = createElement("div", FOO);
    el.setAttribute("style", "color: rgb(0, 0, 0);");
    addToDocument(el);

    var foo = njq("#foo");
    expect(foo.css("color")).to.equal("rgb(0, 0, 0)");
  });

  it("sets a css rule", function() {
    var el = createElement("div", FOO);
    addToDocument(el);

    var foo = njq("#foo").css("border-radius", "50%");
    expect(foo.css("border-radius")).to.equal("50%");
  });

  it("appends to a parent", function() {
    var foo = createElement("div", FOO);
    var bar = createElement("div", BAR);
    var test = createElement("div", "test");
    foo.className = "foobar";
    bar.className = "foobar";
    addToDocument(foo);
    addToDocument(bar);

    var results = njq(".foobar").append(test);
    expect(results.find("#test").length).to.equal(2);
  });

  it("appends to an html string to parent", function() {
    var foo = createElement("div", FOO);
    var bar = createElement("div", BAR);
    var test = '<div id="test"></div>';
    foo.className = "foobar";
    bar.className = "foobar";
    addToDocument(foo);
    addToDocument(bar);

    var results = njq(".foobar").append(test);
    expect(results.find("#test").length).to.equal(2);
  });

  it("appends to an njq element to parent", function() {
    var foo = createElement("div", FOO);
    var bar = createElement("div", BAR);
    bar.className = "bar";
    addToDocument(foo);

    var results = njq("#foo").append(bar);
    expect(results.find(".bar").length).to.equal(1);
  });

  it("prepends to a parent", function() {
    var foo = createElement("div", FOO);
    var bar = createElement("div", BAR);
    var test = createElement("div", "test");
    foo.className = "foobar";
    bar.className = "foobar";
    addToDocument(foo);
    addToDocument(bar);

    var results = njq(".foobar").prepend(test);
    expect(results.find("#test").length).to.equal(2);
  });

  it("prepends to an html string to parent", function() {
    var foo = createElement("div", FOO);
    var bar = createElement("div", BAR);
    var test = '<div id="test"></div>';
    foo.className = "foobar";
    bar.className = "foobar";
    addToDocument(foo);
    addToDocument(bar);

    var results = njq(".foobar").prepend(test);
    expect(results.find("#test").length).to.equal(2);
  });

  it("prepends to an njq element to parent", function() {
    var foo = createElement("div", FOO);
    var bar = createElement("div", BAR);
    bar.className = "bar";
    addToDocument(foo);

    var results = njq("#foo").prepend(bar);
    expect(results.find(".bar").length).to.equal(1);
  });

  it("checks if element matches selector", function() {
    var foo = createElement("div", FOO);
    foo.className = FOO;
    addToDocument(foo);

    expect(njq("#foo").is(".foo")).to.be.true;
  });

  it("gets a data attribute", function() {
    var foo = createElement("div", FOO);
    foo.setAttribute("data-bar", "bar");
    addToDocument(foo);

    expect(njq("#foo").data("bar")).to.equal("bar");
  });

  it("sets a data attribute", function() {
    var foo = createElement("div", FOO);
    foo.setAttribute("data-bar", "bar");
    addToDocument(foo);
    var njqBar = njq("#foo").data("bar", "nope");
    expect(njqBar.data("bar")).to.equal("nope");
  });

  it("gets a value", function() {
    var foo = createElement("input", FOO);
    foo.setAttribute("value", FOO);
    addToDocument(foo);

    expect(njq("#foo").val()).to.equal(FOO);
  });

  it("sets a value", function() {
    var foo = createElement("input", FOO);
    foo.setAttribute("value", FOO);
    addToDocument(foo);
    var njqBar = njq("#foo").val(BAR);
    expect(njqBar.val()).to.equal(BAR);
  });

  it("toggles an element", function() {
    var foo = createElement("input", FOO);
    addToDocument(foo);
    var njqBar = njq("#foo").toggle();
    expect(njqBar.css("display")).to.equal("none");
  });

  it("toggles an element", function() {
    var foo = createElement("input", FOO);
    addToDocument(foo);
    var njqBar = njq("#foo").css("display", "none").toggle();
    expect(njqBar.css("display")).to.not.equal("none");
  });

  it("gets the width", function() {
    var foo = createElement("input", FOO);
    addToDocument(foo);
    var njqBar = njq("#foo").css("width", "100px").css("box-sizing", "border-box");
    expect(njqBar.width()).to.equal(100);
  });

  it("sets the width", function() {
    var foo = createElement("input", FOO);
    addToDocument(foo);
    var njqBar = njq("#foo").css("width", "100px").css("box-sizing", "border-box");
    njqBar.width(200);
    expect(njqBar.width()).to.equal(200);
    expect(njqBar.css("width")).to.equal("200px");
  });

  it("gets the height", function() {
    var foo = createElement("input", FOO);
    addToDocument(foo);
    var njqBar = njq("#foo").css("height", "100px").css("box-sizing", "border-box");
    expect(njqBar.height()).to.equal(100);
  });

  it("sets the height", function() {
    var foo = createElement("input", FOO);
    addToDocument(foo);
    var njqBar = njq("#foo").css("height", "100px").css("box-sizing", "border-box");
    njqBar.height(200);
    expect(njqBar.height()).to.equal(200);
    expect(njqBar.css("height")).to.equal("200px");
  });
});
