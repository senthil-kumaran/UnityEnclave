const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text')

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email,
    this.firstName = user.firstName,
    this.url = url,
    this.from = `Senthil Kumaran <${process.env.EMAIL_FROM}>`
  }

  transporter() {
    // if(process.env.NODE_ENV === 'production') {
    //   return nodemailer.createTransport({
    //     service: 'Mailgun',
    //     auth: {  
    //       API_KEY: '4de08e90-35554a05',
    //       DOMAIN: ''
    //     }
    //   })
    // }

    return nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      }
  })
  }

  async send(template, subject) {
    // Send actual email
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url
    })

    const mailInfo = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html)
    }

    await this.transporter().sendMail(mailInfo)
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Unity Enclave!')
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Password reset verification email')
  }
}

const sendEmail = async option => {
    // const transportor = nodemailer.createTransport({
    //     host: process.env.NODEMAILER_HOST,
    //     port: process.env.NODEMAILER_PORT,
    //     auth: {
    //       user: process.env.NODEMAILER_USER,
    //       pass: process.env.NODEMAILER_PASS
    //     }
    // });
           
    // const mailInfo = {
    //         from: 'Senthil Kumaran <senkum@gmail.com>',
    //         to: option.toEmail,
    //         subject: option.subject,
    //         text: option.message
    //         // html:
    // }

    await transportor.sendMail(mailInfo)
}

// module.exports = sendEmail