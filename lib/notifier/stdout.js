/**
 * Created by qeesung on 2017/6/3.
 * put the promise cost record to the stdout
 */

module.exports = (name, cost, caller) => {
  console.log(`${name} ==> ${cost}ms at ${caller.file}:${caller.line}`);
};

