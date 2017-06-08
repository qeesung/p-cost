/**
 * Created by qeesung on 2017/6/8.
 * create promise cost with custom name
 */

const Promise = require("../");

new Promise(resolve => {
  setTimeout(resolve, 1000);
}, {
  name: "cost"
});
// output: cost ==> 1005ms at /p-cost/examples/name.example.js:8

new Promise(resolve => {
  setTimeout(resolve, 1000);
}, {
  name: "cost",
  sum: true    // sum the time cost in the promise chain
}).then(() => { // cost-#1
  // do something here
}).then(() => { // cost-#2
  // do something here
});
// output:
//         cost ==> 1009ms /p-cost/examples/name.example.js:15
//         cost-#1 ==> 1011ms /p-cost/examples/name.example.js:20
//         cost-#2 ==> 1010ms /p-cost/examples/name.example.js:22
