import React from 'react'
import PropTypes from 'prop-types'

const loginForm = ({
  username, setUsername,
  password, setPassword,
  handleLogin
}) => (
  <form id='login-form' onSubmit={handleLogin}>
    <div>
      username
      <input
        id='username'
        type='text'
        value={username}
        name='Username'
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
      <input
        id='password'
        type='password'
        value={password}
        name='Password'
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button id='login-button' type='submit'>login</button>
  </form>
)

loginForm.propTypes = {
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired
}

export default loginForm