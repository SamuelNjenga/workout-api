const nodemailer = require('nodemailer')
const Email = require('email-templates')
const Logger = require('./logger')
const Shared = require('./shared')
const path = require('path')
require('dotenv').config()
const root = path.join(__dirname, 'emails')

const logger = new Logger().logger()

class Mailer {
  constructor (from) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    //Syntax   (Fred Foo <foo@blurdybloop.com>)
    this.from = from

    this.email = new Email({
      message: {
        from: this.from || `${process.env.EMAIL_USERNAME}`
      },
      send: true,
      transport: this.transporter,
      views: {
        options: {
          extension: 'ejs' // <---- HERE
        }
      }
    })
  }

  // {
  //     template: 'service_verified',
  //     message: {
  //         to: 'my-email@domain.com'
  //     },
  //     locals: {
  //         user: 'User'
  //     }
  // }
  async send (options) {
    try {
      options.template = path.join(appRoot, 'emails', options.template)
      console.log(options.template)
      console.log('send', options)
      let res = await this.email.send(options)
      console.log('sendDD', res)
      console.log(Shared.isProduction)
      if (Shared.isProduction())
        logger.info(
          `Email has been sent to ${options &&
            options.message &&
            options.message.to}`
        )
      else logger.info(res)
    } catch (error) {
      throw error
    }
  }
}

module.exports = Mailer
