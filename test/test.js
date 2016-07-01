/* globals document, window, require, describe, it, afterEach */
"use strict";

var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;
var njq = require("./../");
var zock = require("zock");

var Promise = require('es6-promise').Promise; // zock needs this
var domain = "http://www.fake.com";
var GET = "GET";
var POST = "POST";
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

var setGet = function(domain, path, result) {
  window.XMLHttpRequest = zock
    .base(domain)
    .get(path)
    .reply(200, result)
    .XMLHttpRequest;
};

var setPost = function(domain, path, result) {
  window.XMLHttpRequest = zock
    .base(domain)
    .post(path)
    .reply(200, result)
    .XMLHttpRequest;
};

describe("Ajax", function() {
  it("gets JSON", function(done) {
    var result = { test: true };
    var path = "/some/shit";
    setGet(domain, path, result);

    njq.getJSON(domain + "/some/shit", function(data) {
      expect(data).to.eql(result);
      done();
    });
  });

  it("posts data", function(done) {
    var result = { test: false };
    var path = "/some/shit";
    setPost(domain, path, result);

    njq.ajax({
      type: POST,
      url: domain + "/some/shit",
      data: result,
      success: function(data) {
        expect(JSON.parse(data)).to.eql(result);
        done();
      },
      error: function() {
        expect("success").to.not.equal("error");
        done();
      }
    });
  });

  it("gets data", function(done) {
    var result = { test: false };
    var path = "/some/shit";
    setGet(domain, path, result);

    njq.ajax({
      type: GET,
      url: domain + "/some/shit",
      success: function(data) {
        expect(JSON.parse(data)).to.eql(result);
        done();
      },
      error: function() {
        expect("success").to.not.equal("error");
        done();
      }
    });

  });
});

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
});

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
