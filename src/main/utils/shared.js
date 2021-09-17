require('dotenv').config()
class Shared {
  static isProduction () {
    const environment = process.env.NODE_ENV || 'development'
    return environment === 'production'
  }

  static serverUrl (req) {
    return req.headers.host
  }
}

module.exports = Shared
