/**
 * Created by qeesung on 2017/6/3.
 */
const {getCallerInfo} = require("./utils");
const {stdoutNotifier} = require("./notifiers");


/**
 * Decorator class for promise
 */
class PromiseCost {
  constructor(executor, {
    name = "anonymous",
    timeout = 1000,
    notifier = {
      notify: stdoutNotifier,
      notifyOpt: {}
    }
  } = {}) {

    let caller = getCallerInfo();
    let {notify, notifyOpt} = notifier;

    this.promise = new Promise((resolve, reject) => {
      let start = Date.now();

      /**
       * decorator the promise resolve
       * @param data to be resolved data
       */
      let _resolve = function (data) {
        resolve(data);
        let time = Date.now() - start;
        if(time > timeout)
          notify(name, time, caller, notifyOpt);
      };

      /**
       * decorator the promise reject
       * @param reason reason to be rejected
       */
      let _reject = function (reason) {
        reject(reason);
        let time = Date.now() - start;
        if(time > timeout)
          notify(name, time, caller, notifyOpt);
      };
      return executor(_resolve, _reject);
    })
  }

  then(onFullFilled, onRejected) {
    return this.promise.then(onFullFilled, onRejected);
  }

  catch(onRejected) {
    return this.promise.catch(onRejected);
  }
}

module.exports = PromiseCost;
