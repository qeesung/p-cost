/**
 * Created by qeesung on 2017/6/3.
 */
const Promise = require("../lib/promise-cost");
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

describe("Promise cost", () => {
  describe("default timeout", () => {
    it("it promise resolve time exceed 1000ms, notify function will be called",  () => {
      let notifyMockFn = sinon.spy();
      return new Promise(resolve => {
        setTimeout(resolve, 1000);
      }, {notifier: {
        notify: notifyMockFn
      }}).then(() => {
        notifyMockFn.should.have.been.calledOnce;
      });
    });

    it("it promise resolve time less than 1000ms, notify function will not be called", () => {
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

  describe("config timeout", () => {
    it("config timeout to 2000ms, because the cost is 1000ms , notify function will not be called", () => {
      let notifyMockFn = sinon.spy();
      return new Promise(resolve => {
        setTimeout(resolve, 1000);
      }, {
        timeout: 2000,
        notifier: {
          notify: notifyMockFn
      }}).then(() => {
        notifyMockFn.should.have.not.been.called;
      });
    });

    it("config timeout to 200ms, because the cost is 500ms , notify function will be called", () => {
      let notifyMockFn = sinon.spy();
      return new Promise(resolve => {
        setTimeout(resolve, 500);
      }, {
        timeout: 200,
        notifier: {
          notify: notifyMockFn
        }}).then(() => {
        notifyMockFn.should.have.been.calledOnce;
      });
    });
  });

  describe("promise chain", () => {
    it("every promise in the promise chain will cost more that 100ms, " +
      "notify function should be called multi times", function() {
      this.timeout(5000);
      let notifyMockFn = sinon.spy();
      return new Promise((resolve) => {                // promise1 here , will cost 200ms
        setTimeout(resolve, 200);
      }, {
        timeout: 100,
        notifier: {
          notify: notifyMockFn
        }
      }).then(() => {                                  // promise2 here, will cost long time
        // some heavy cpu work, cost long time here
        for(let i = 0; i < 100000; i++) {
          for(let j = 0; j< 10000; j++);
        }
      }).then(() => {
        notifyMockFn.should.have.been.calledTwice;
      });
    });
  });

  describe("promise reject", () => {
    it("reject the promise in 1000ms, notify should also work", () => {
      let notifyMockFn = sinon.spy();
      return new Promise((resolve, reject) => { // notify function only called here
        setTimeout(reject, 1000);
      }, {
        notifier:{
          notify: notifyMockFn
        },
      }).catch(() => {
      }).then(() => {
        notifyMockFn.should.have.been.calledOnce;
      });
    });

    it("reject the promise in 1000ms, and sum the time cost,  notify should multi times", () => {
      let notifyMockFn = sinon.spy();
      return new Promise((_, reject) => { // notify called here #1
        setTimeout(reject, 1000);
      }, {
        sum: true,
        notifier: {
          notify: notifyMockFn
        }
      }).catch(() => { // notify called here #2
      }).then(() => {
        notifyMockFn.should.have.been.calledTwice;
      })
    });
  });

  describe("promise resolve", () => {
    it("resolve the promise in 1000ms, notify should also work", () => {
      let notifyMockFn = sinon.spy();
      return new Promise((resolve, reject) => { // notify function only called here
        setTimeout(reject, 1000);
      }, {
        notifier:{
          notify: notifyMockFn
        },
      }).catch(() => {
      }).then(() => {
        notifyMockFn.should.have.been.calledOnce;
      });
    });

    it("resolve the promise in 1000ms, and sum the time cost,  notify should multi times", () => {
      let notifyMockFn = sinon.spy();
      return new Promise((resolve, reject) => { // notify called here #1
        setTimeout(resolve, 1000);
      }, {
        sum: true,
        notifier: {
          notify: notifyMockFn
        }
      }).then(() => { // notify called here #2
      }).then(() => {
        notifyMockFn.should.have.been.calledTwice;
      })
    });
  });

  describe("Promise cost name", () => {
    it("when sum option is true, the number at the end of promise name should auto increment", () =>{
      let notifyMockFn = sinon.spy();
      let name = "cost";
      return new Promise(resolve => {
        setTimeout(resolve, 1000);
      }, {
        name: name,
        sum: true,
        notifier: {
          notify: notifyMockFn
        }
      }).then(() => {
        notifyMockFn.should.have.been.calledWith(name);
      }).then(() => {
        notifyMockFn.should.have.been.calledWith(`${name}-#1`);
      }).then(() => {
        notifyMockFn.should.have.been.calledWith(`${name}-#2`);
      });
    });

    it("when sum options is false, the number at the end of promise name should auto increment", function(){
      this.timeout(5000);
      let notifyMockFn = sinon.spy();
      let name = "cost";
      return new Promise(resolve => {
        setTimeout(resolve, 1000);
      }, {
        name: name,
        notifier: {
          notify: notifyMockFn
        }
      }).then(() => { // cost-#1, won't call notify
        notifyMockFn.should.have.been.calledWith(name);
        return new Promise(resolve => {
          setTimeout(resolve, 1000);
        }, {
          notifier: {notify: () =>{}}
        });
      }).then(() => { // cost-#2, cost exceed 1000ms, will be called
      }).then(() => { // cost-#3, won't call notify
        notifyMockFn.should.have.been.calledWith(`${name}-#2`);
      });
    });
  });
});


