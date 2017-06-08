/**
 * Created by qeesung on 2017/6/8.
 */
const Promise = require("../");

new Promise(resolve => {
  setTimeout(resolve, 1000);
}, {
  notifier: {
    notify: (name, time, caller, option) => {
      console.log({
        name,
        time,
        file: caller.file,
        line: caller.line,
        system: option.system
      })
    },
    notifyOpt: {
      system: "linux"
    }
  },
  sum: true
}).then(() => {

});
//output:
//  { name: 'anonymous',
//    time: 1005,
//    file: '/p-cost/examples/custom-notifier.example.js',
//    line: '6',
//    system: 'linux' }
//  { name: 'anonymous-#1',
//    time: 1009,
//    file: '/p-cost/examples/custom-notifier.example.js',
//    line: '24',
//    system: 'linux' }
