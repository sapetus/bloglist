const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user.js')

loginRouter.post('/', async (request, response) => {
  const requestBody = request.body

  const user = await User.findOne({ username: requestBody.username })

  const passwordCorrect = user == null
    ? false
    : await bcrypt.compare(requestBody.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

loginRouter.get('/', async (request, response) => {
  response.status(200).send({ answer: "this works" })
})

module.exports = loginRouter