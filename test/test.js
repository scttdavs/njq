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

describe("Basics", function() {
  it("work", function() {
    expect(true).to.be.true;
  });

  it("gets JSON", function(done) {
    var result = { test: true };
    var path = "/some/shit";
    window.XMLHttpRequest = zock
      .base(domain)
      .get(path)
      .reply(200, result)
      .XMLHttpRequest

    njq.getJSON(domain + "/some/shit", function(data) {
      expect(data).to.eql(result);
      done();
    });
  });
});
