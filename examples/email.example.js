/**
 * Created by qeesung on 2017/6/4.
 */
const {emailNotifier} = require("../lib/notifiers");
const Promise = require("..");

// if timeout , send email by outlook email serer
new Promise((resolve) => {
  setTimeout(resolve, 2000);
}, {
  name: "bunyan1000",
  notifier: {
    notify: emailNotifier,
    notifyOpt: {
      transport: {
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
          ciphers:'SSLv3'
        },
        auth: {
          user: 'qeesung@live.com',
          pass: 'password'
        }
      },
      content: function () {
        let {name, cost, caller} = this;
        return {
          from: '"世成 秦" <qeesung@live.com>', // sender address (who sends)
          to: 'qeesung@live.com', // list of receivers (who receives)
          subject: 'Promise timeout', // Subject line
          text: 'Promise timeout ', // plaintext body
          html: `${name} ===> ${cost}ms at ${caller.file}:${caller.line}` // html body
        }
      },
      callback: function (err, info) {
        console.log(info);
      }
    }
  }
});
