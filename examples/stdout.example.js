/**
 * Created by qeesung on 2017/6/3.
 */
const Promise = require("..");

new Promise((resolve) => {
  setTimeout(resolve, 1000);
});
//output: anonymous ==> 1004ms at /p-cost/examples/stdout.example.js:6

new Promise((resolve) => {
  setTimeout(resolve, 1000);
}, {name: "stdout-1000"});
//output: stdout-1000 ==> 1003ms at /p-cost/examples/stdout.example.js:6

new Promise((resolve) => {
  setTimeout(resolve, 500);
}, {name: "stdout-500"});
//output nothing, because cost time 500 < default timeout 1000

new Promise((resolve) => {
  setTimeout(resolve, 500);
}, {name: "stdout-500", timeout: 300});
//output: stdout-500 ==> 506ms at /p-cost/examples/stdout.example.js:16

new Promise((resolve, reject) => {
  setTimeout(reject, 1000);
}, {name: "reject-stdout-1000"}).catch(err => {
  // do nothing
});
//output: reject-stdout-1000 ==> 1004ms at /p-cost/examples/stdout.example.js:26

new Promise((resolve) => {
  setTimeout(resolve, 1000);
}, {name: "outer-stdout-1000"}).then( () => {
  return new Promise((resolve) => {
    setTimeout(resolve,2000)
  }, {name: "inner-stdout-2000"});
});
//output:
//       outer-stdout-1000 ==> 1002ms at /p-cost/examples/stdout.example.js:33
//       inner-stdout-2000 ==> 2003ms at /p-cost/examples/stdout.example.js:36
