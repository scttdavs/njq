"use strict";

var chai = require("chai");
var expect = chai.expect;
var njq = require("./../");
var zock = require("zock");
zock
.logger(function(debug) {
  console.log(debug)
});
var Promise = require('es6-promise').Promise; // zock needs this
var domain = "http://www.fake.com";
var GET = "GET";
var POST = "POST";

var setGet = function(domain, path, result) {
  window.XMLHttpRequest = zock
    .base(domain)
    .get(path)
    .reply(200, result)
    .XMLHttpRequest
};

var setPost = function(domain, path, result) {
  window.XMLHttpRequest = zock
    .base(domain)
    .post(path)
    .reply(200, result)
    .XMLHttpRequest
};

describe("Basics", function() {
  it("work", function() {
    expect(true).to.be.true;
  });

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
});
