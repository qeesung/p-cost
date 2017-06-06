/**
 * Created by qeesung on 2017/6/3.
 */
const {getCallerInfo} = require("./utils");
const {stdoutNotifier} = require("./notifiers");
const EventEmitter = require('events');

class PromiseCast extends Promise {

  constructor(executor, {
    name = "anonymous",
    timeout = 1000,
    sum = false,
    notifier = {
      notify: stdoutNotifier,
      notifyOpt: {}
    }
  } = {}) {
    let caller = getCallerInfo();
    let resolvedEmitter = new EventEmitter();

    let costOpts = {
      name,
      notifier,
      timeout,
      sum,
      startTime: Date.now(),
    };

    super((resolve, reject) => {
      let callNotifier = function() {
        let end = Date.now();
        let time = end - costOpts.startTime;
        if(time > timeout)
          costOpts.notifier.notify(costOpts.name,
            time, caller, costOpts.notifier.notifyOpt);
        resolvedEmitter.emit("done", end);
      };
      /**
       * decorator the promise resolve
       * @param data to be resolved data
       */
      let _resolve = function (data) {
        resolve(data);
        callNotifier();
      };

      /**
       * decorator the promise reject
       * @param reason reason to be rejected
       */
      let _reject = function (reason) {
        reject(reason);
        callNotifier();
      };
      return executor(_resolve, _reject);
    });

    this.resolvedEmmiter = resolvedEmitter;
    this.costOpts = costOpts;
  }

  then(onFullFilled, onRejected) {
    const returnPromise = super.then(onFullFilled, onRejected);
    // use same sum config for returned promise
    returnPromise.costOpts.sum = this.costOpts.sum;
    returnPromise.costOpts.notifier = this.costOpts.notifier;

    let thenRegexp = /.*(-#\d+)/g;
    let incrementRegexp = /-#(\d+)$/g;
    returnPromise.costOpts.name = thenRegexp.test(this.costOpts.name) ?
      this.costOpts.name.replace(incrementRegexp, (match, number) => {
        return "-#"+(parseInt(number) + 1);
      }) :
      this.costOpts.name+"-#0";
    if(!this.costOpts.sum){
      this.resolvedEmmiter.on("done", function (end) {
        returnPromise.costOpts.startTime = end; //reset the start time
      });
    }
    return returnPromise;
  }
}

module.exports = PromiseCast;
