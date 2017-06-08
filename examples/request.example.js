/**
 * Created by qeesung on 2017/6/8.
 */
const request = require("request");
const Promise = require("../");

new Promise(resolve => {
  request("http://www.github.com/qeesung", (err, data) => {
    resolve(data);
  });
}, {
  name: "github-user"
});
//output: github-user ==> 6021ms at /p-cost/examples/request.example.js:7
