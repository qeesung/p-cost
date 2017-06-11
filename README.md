# p-cost

[![Build Status](https://travis-ci.org/qeesung/p-cost.svg?branch=master)](https://travis-ci.org/qeesung/p-cost)

How long will a Promise to be resolved(rejected) ? 

When I used nodejs for backend development，I always create many promises to interact between multiple systems, 
such as database, or some other systems. These systems have different response times，in other word， 
these promises consume different lengths of time, some promises will take long time until it resolved, and some 
promises would only take very short time. I need a tool to count the length of each created promise cost。

So I extend the ES6 Promise to resolve this problem.


## Examples

### basic usage

```node
new Promise((resolve) => {
  setTimeout(resolve, 1000);
});
//output: anonymous ==> 1004ms at /p-cost/examples/stdout.example.js:6
```

### custom name
```node
new Promise((resolve) => {
  setTimeout(resolve, 1000);
}, {name: "p-cost"});
//output: p-cost ==> 1003ms at /p-cost/examples/stdout.example.js:11
```

### sum the time cost in same promise chain
```node
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
```

### custom notifier

```node
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
```

more examples can be found in [example](https://github.com/qeesung/p-cost/tree/master/examples) directory
