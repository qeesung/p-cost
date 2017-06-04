/**
 * Created by qeesung on 2017/6/3.
 */
const {getCallerInfo} = require("./utils");
const {stdoutNotifier} = require("./notifiers");

class PromiseCast extends Promise {
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
    let start = Date.now();

    super((resolve, reject) => {
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
    });
  }
}

module.exports = PromiseCast;
