/**
 * Created by qeesung on 2017/6/3.
 * put the promise cost record to the stdout
 */
require('colors');

module.exports = (name, cost, caller) => {
  console.log(`${name.green} ==> ${(cost+"ms").red.bold} at ${caller.file.yellow}:${caller.line.yellow}`);
};

