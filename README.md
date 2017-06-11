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
new Promise(resolve => {
  setTimeout(resolve, 1000);
});
//output: anonymous ==> 1004ms at /p-cost/examples/stdout.example.js:6
```

### custom name
```node
new Promise(resolve => {
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
new Promise(resolve => {
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

## Usage

```node
new Promise((resolve, reject) => {}, options);
```
### options

```node
{
  name: "hello",
  timeout: 500,
  sum: true,
  notifer: {
    notify: () => {}
    notifyOpt: {}
  }
}
```

| name |type| required | default |description | 
|:-:|:-:|:-:|:-:| :-- |
| timeout |boolean| false | 1000 | if promise resolved time exceed `timeout`ms, notify function will be called |
| name | string | false | "anonymous" | promise name |
| sum | boolean | false | false | if sum the time cost in same promise chain |
| notifier.notify | function | false | stdoutNotifier | the way to notify user if `timeout` |
| notifier.notifyOpt | object | false | null | will pass to `notifier.notify` function as argument |

#### options.timeout

Not all promises will notify the user the time it spent, just the promise that exceed the `timeout`, You can set the `timeout` to control the threshold of the reminder.

```node
// default timeout is 1000ms
new Promise((resolve) => {
  setTimeout(resolve, 1000);
});
//output: anonymous ==> 1004ms at /p-cost/examples/stdout.example.js:6
```

```node
// custom timeout
new Promise((resolve) => {
  setTimeout(resolve, 500);
}, {name: "stdout-500", timeout: 300});
//output: stdout-500 ==> 506ms at /p-cost/examples/stdout.example.js:16
```

#### options.name

Give promise a custom `name`，you can make it easier to identify those notify message.

```node
// default promise name
new Promise((resolve) => {
  setTimeout(resolve, 1000);
});
//output: anonymous ==> 1004ms at /p-cost/examples/stdout.example.js:6
```

```node
// custom promise name
new Promise(resolve => {
  setTimeout(resolve, 1000);
}, {
  name: "cost"
});
// output: cost ==> 1005ms at /p-cost/examples/name.example.js:8

// auto increment suffix serial number
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

#### options.sum

> Note: because every promise only have three status: `pending`, `fullfiled`, `rejected`, so the `then` function
will return a **new** Promise, and this new Promise will be resolved after previous promises were fullfilled, so 
the new Promise spent time is the sum of previous promises spent time and it own spent.

If the `sum` is true, the prmise in the same promise chain spent time is the sum of previous promises spent time and it own spent.
If the `sum` is false, the promise in the same promise chain spent time is only the time it own spent.

```node
// sum the time cost
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
```

```node
// do not sum the time cost
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

```

#### options.notifier

When the time the promise spent exceed `timeout`, the `notifier.notify` function will be called to notify the user.

**provided notifer** 

- [stdoutNotifer](https://github.com/qeesung/p-cost/blob/master/lib/notifiers/stdout.js) notify the user by stdout, [example](https://github.com/qeesung/p-cost/blob/master/examples/stdout.example.js)
- [bunyanNotifer](https://github.com/qeesung/p-cost/blob/master/lib/notifiers/bunyan.js) notify the user by bunyan, [example](https://github.com/qeesung/p-cost/blob/master/examples/bunyan.example.js)
- [emailNotifer](https://github.com/qeesung/p-cost/blob/master/lib/notifiers/email.js) notify the user by email., [example](https://github.com/qeesung/p-cost/blob/master/examples/email.example.js)

**how to custom a notifier**

`notifier` is just a normal object, and the `notifier.notify` is a normal function. and notify function will be called with:
- name, promise name
- cost, the promise tim cost
- caller, call stack, promise location
  - caller.file the file define the promise
  - caller.line the line define the promise
- options, notifyOptions

```node
let customNotify = (name, cost, caller, options) => {
  
}
```
