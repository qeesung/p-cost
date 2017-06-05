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
    let {notify, notifyOpt} = notifier;
    let start = {time :Date.now()};
    let resolvedEmitter = new EventEmitter();

    super((resolve, reject) => {
      let callNotifier = function() {
        let end = Date.now();
        let time = end - start.time;
        if(time > timeout)
          notify(name, time, caller, notifyOpt);
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
    this.start = start;
    this.name = name;
    this.sum = sum;
    this.timeout = timeout;
    this.notifier = notifier;
  }

  then(onFullFilled, onRejected) {
    const returnValue = super.then(onFullFilled, onRejected);
    // use same sum config for returned promise
    returnValue.sum = this.sum;
    if(!this.sum){
      this.resolvedEmmiter.on("done", function (end) {
        returnValue.start.time = end;
      });
    }
    return returnValue;
  }
}

module.exports = PromiseCast;
