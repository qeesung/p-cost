/**
 * Created by qeesung on 2017/6/3.
 */
const stdoutNotifier = require("./stdout");
const bunyanNotifier = require("./bunyan");
const emailNotifier = require("./email");

module.exports = {
  stdoutNotifier,
  bunyanNotifier,
  emailNotifier
};
