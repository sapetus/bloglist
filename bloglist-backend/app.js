const express = require('express')
const app = express()
//THIS NEEDS TO BE HERE FOR ERRORHANDLER TO WORK
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login.js')

const config = require('./utils/config.js')
const logger = require('./utils/logger.js')
const middleware = require('./utils/middleware.js')

logger.info('Connecting to MongoDB')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch(error => {
        logger.error('Error connecting to MongoDB', error.message)
    })

app.use(express.static(path.join(__dirname, '../bloglist-frontend/build')));

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor, blogsRouter)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing.js')
    app.use('/api/testing', testingRouter)
    console.log('testing mode')
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../bloglist-frontend/build/index.html'))
})

module.exports = app