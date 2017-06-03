/**
 * Created by qeesung on 2017/6/3.
 * notify user with the email base on nodemail
 */
var nodemailer = require('nodemailer');

module.exports = (name, cost, caller, options) => {
  let ctx ={name, cost, caller};
  let {transport, content, callback} = options;
  let transporter = nodemailer.createTransport(transport);
  transporter.sendMail(content.apply(ctx), callback);
};

