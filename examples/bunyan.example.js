/**
 * Created by qeesung on 2017/6/4.
 */
const {bunyanNotifier} = require("../lib/notifiers");
const Promise = require("../");

new Promise((resolve) => {
  setTimeout(resolve, 1000);
}, {
  name: "bunyan1000",
  notifier: {
    notify: bunyanNotifier,
    notifyOpt: {name: "overtime promise"}
  }
});

// output
// {
//   "name": "bunyan1000",
//   "hostname": "qeesungdeMacBook-Pro.local",
//   "pid": 18100,
//   "level": 30,
//   "cost": "1004ms",
//   "location": {
//     "file": "/p-cost/examples/bunyan.example.js",
//     "line": "7"
//   },
//   "msg": "",
//   "time": "2017-06-03T16:05:35.527Z",
//   "v": 0
// }

new Promise((resolve) => {
  setTimeout(resolve, 1000);
}, {
  name: "bunyan1000",
  notifier: {
    notify: bunyanNotifier,
    notifyOpt: {
      name: "overtime promise",
      streams:[
        {
          level: "info",
          path: "promise-cost.log"
        }
      ]
    }
  }
});
// all output stream to "promise-cost.log" file
