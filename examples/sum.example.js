/**
 * Created by qeesung on 2017/6/8.
 * sum the time cost in the same promise chain
 */

const Promise = require("../");

new Promise(resolve => {
  setTimeout(resolve, 1000);
},{
  sum: true
}).then(() => {
  // do something here
}).then(() => {
  // do something here
});
// output:
//         anonymous ==> 1006ms at /p-cost/examples/sum.example.js:9
//         anonymous-#1 ==> 1010ms at /p-cost/examples/sum.example.js:11
//         anonymous-#2 ==> 1010ms at /p-cost/examples/sum.example.js:13


new Promise(resolve => {
  setTimeout(resolve, 1000);
},{
  sum: false
}).then(() => {
  // do something here
}).then(() => {
  // do something here
});
// output: anonymous ==> 1008ms at /p-cost/examples/sum.example.js:24