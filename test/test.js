/**
 * Created by qeesung on 2017/6/3.
 */
const Promise = require("../lib/promise-cost");
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

function hello(name, cb) {
  cb("hello " + name);
}

describe("default timeout", function () {
  it("it promise resolve time exceed 1000ms, notify function will be called", function () {
    let notifyMockFn = sinon.spy();
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    }, {notifier: {
      notify: notifyMockFn
    }}).then(() => {
      notifyMockFn.should.have.been.calledOnce;
    });
  });

  it("it promise resolve time less than 1000ms, notify function will not be called", function () {
    let notifyMockFn = sinon.spy();
    return new Promise(resolve => {
      setTimeout(resolve, 800);
    }, {notifier: {
      notify: notifyMockFn
    }}).then(() => {
      notifyMockFn.should.have.not.been.called;
    });
  });
});


