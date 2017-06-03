/**
 * Created by qeesung on 2017/6/3.
 * put the promise cost to the bunyan record
 */
const bunyan = require('bunyan');

module.exports = (name, cost, caller, options) => {
  let logger = bunyan.createLogger(options);
  logger.info({name, cost: cost+"ms", location: caller});
};
