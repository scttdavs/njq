/* globals document, window, require, describe, it, afterEach */
"use strict";

var chai = require("chai");
var expect = chai.expect;
var njq = require("./../");
var zock = require("zock");

var Promise = require('es6-promise').Promise; // zock needs this
var domain = "http://www.fake.com";
var GET = "GET";
var POST = "POST";

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
    var el = createElement("div", "foo");
    addToDocument(el);

    expect(njq("#foo").length).to.equal(1);
  });

  it("gets finds elements within", function() {
    var el = createElement("div", "foo");
    var bar = createElement("div", "bar");
    el.appendChild(bar);
    addToDocument(el);

    expect(njq("#foo").find("#bar").length).to.equal(1);
  });

  it("tests for a class", function() {
    var el = createElement("div", "foo");
    el.className = 'foo';
    addToDocument(el);

    expect(njq("#foo").hasClass("foo")).to.be.true;
  });

  it("adds a class", function() {
    var el = createElement("div", "foo");
    addToDocument(el);

    var newClass = njq("#foo").addClass("bar");
    expect(newClass.hasClass("bar")).to.be.true;
  });

  it("empties an element", function() {
    var el = createElement("div", "foo");
    var bar = createElement("div", "bar");
    el.appendChild(bar);
    addToDocument(el);

    var foo = njq("#foo");
    expect(foo.get(0).innerHTML).to.not.be.empty;
    foo.empty();
    expect(foo.get(0).innerHTML).to.be.empty;
  });

  it("gets html", function() {
    var el = createElement("div", "foo");
    var bar = createElement("div", "bar");
    el.appendChild(bar);
    addToDocument(el);

    var foo = njq("#foo");
    expect(foo.html()).to.equal('<div id="bar"></div>');
  });
});

describe("Effects", function() {
  afterEach(function() {
    document.body.innerHTML = "";
  });

  it("hides", function() {
    var el = createElement("div", "foo");
    addToDocument(el);

    expect(el.style.display).to.equal("");
    var newEl = njq("#foo").hide();
    expect(el.style.display).to.equal("none");
  });

  it("shows", function() {
    var el = createElement("div", "foo");
    addToDocument(el);

    el.style.display = "none";
    expect(el.style.display).to.equal("none");
    var newEl = njq("#foo").show();
    expect(el.style.display).to.equal("");
  });
});
