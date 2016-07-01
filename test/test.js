/* globals document, window, require, describe, it */
"use strict";

var chai = require("chai");
var expect = chai.expect;
var njq = require("./../");
var zock = require("zock");

var Promise = require('es6-promise').Promise; // zock needs this
var domain = "http://www.fake.com";
var GET = "GET";
var POST = "POST";

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
  it("gets elements", function() {
    var el = document.createElement("div");
    el.setAttribute("id", "foo");
    document.body.appendChild(el);

    expect(njq("#foo").length).to.equal(1);
    el.parentNode.removeChild(el);
  });

  it("gets finds elements within", function() {
    var el = document.createElement("div");
    var bar = document.createElement("div");
    el.setAttribute("id", "foo");
    bar.setAttribute("id", "bar");
    el.appendChild(bar);
    document.body.appendChild(el);

    expect(njq("#foo").find("#bar").length).to.equal(1);
    bar.parentNode.removeChild(bar);
    el.parentNode.removeChild(el);
  });

  it("tests for a class", function() {
    var el = document.createElement("div");
    el.setAttribute("id", "foo");
    el.className = 'foo';
    document.body.appendChild(el);

    expect(njq("#foo").hasClass("foo")).to.be.true;
    el.parentNode.removeChild(el);
  });

  it("adds a class", function() {
    var el = document.createElement("div");
    el.setAttribute("id", "foo");
    document.body.appendChild(el);

    var newClass = njq("#foo").addClass("bar");
    expect(newClass.hasClass("bar")).to.be.true;
    el.parentNode.removeChild(el);
  });
});
