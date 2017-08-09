'use strict';

module.exports = {
  Mail: {
    transports: {
      host: process.env.MAILGUN_SMTP_SERVER,
      port: process.env.MAILGUN_SMTP_PORT,
      auth: {
        user: process.env.MAILGUN_SMTP_LOGIN,
        pass: process.env.MAILGUN_SMTP_PASSWORD
      }
    }
  }
}