const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user.js')

//create user
usersRouter.post('/', async (request, response) => {
  const requestBody = request.body

  //check password
  if (!requestBody.password) {
    return response.status(400).json({ error: 'password missing' })
  } else if (requestBody.password.length < 3) {
    return response.status(400).json({ error: 'invalid password' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(requestBody.password, saltRounds)

  const user = new User({
    username: requestBody.username,
    name: requestBody.name,
    passwordHash
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

//get all users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter