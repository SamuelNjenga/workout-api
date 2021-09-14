/**
 * Setup app root
 */
const path = require('path')
global.appRoot = path.resolve(__dirname)

/**
 * Setup .env
 */
const config = require('dotenv')

/**
 * Custom logger
 */
const http = require('http')
const Logger = require('./src/main/utils/logger')

/**
 * Setup Server
 */
const app = require('./app')

config.config()
const logger = new Logger().logger()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000
server.listen(PORT)
server.on('listening', () => {
  logger.info(`App started on port ${PORT}`)
})
