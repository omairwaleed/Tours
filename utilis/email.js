const pug = require('pug');
const { convert } = require('html-to-text');
const nodemailer = require('nodemailer');
const fs = require('fs');
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `omair waleed <${process.env.EMAIL_FROM}>`;
  }
  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        port: '25',
        // tls: {
        //   ciphers: 'SSLv3',
        //   rejectUnauthorized: false,
        // },
        auth: {
          user: '',
          pass: '',
        },
      });
    } else {
      return nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: '2525',
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false,
        },
        auth: {
          user: '',
          pass: '',
        },
      });
    }
  }
  async send(template, subject) {
    //  1-render html based bug template
    //  2-define email option
    //  3-create transport , send email
    const html = pug.renderFile(
      'D:/backend/complete-node-bootcamp-master/4-natours/starter/views/email/welome.pug',
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.createTransport().sendMail(emailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', "welcome to Natour's Family");
  }
};
