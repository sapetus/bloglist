import React, { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Message from './components/Message'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [messageStyle, setMessageStyle] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const successStyle = {
    color: 'rgb(0, 128, 0)',
    backgroundColor: 'darkgrey',
    fontSize: 25,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const failureStyle = {
    color: 'red',
    backgroundColor: 'darkgrey',
    fontSize: 25,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  //effect hook for getting blogs in db
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(sortBlogs(blogs))
    )
  }, [])

  //effect hook for checking if user is in storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  //sort blogs in to descending order
  const sortBlogs = (blogs) => {
    blogs.sort((a, b) => {
      const likesA = a.likes
      const likesB = b.likes

      if (likesA < likesB) {
        return 1
      }
      if (likesA > likesB) {
        return -1
      }

      return 0
    })

    return blogs
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessageStyle(failureStyle)
      setMessage('Wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    const response = await blogService.create(blogObject)
    setBlogs(blogs.concat(response))

    setMessageStyle(successStyle)
    setMessage('A new blog; ' + response.title + ' by ' + response.author + ' has been added')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const updateBlog = async (blogObject, id) => {
    await blogService.update(blogObject, id)

    //update the list of blogs
    const blogsInDb = await blogService.getAll()
    setBlogs(sortBlogs(blogsInDb))
  }

  const removeBlog = async (id) => {
    await blogService.remove(id)

    //update the list of blogs
    const blogsInDb = await blogService.getAll()
    setBlogs(sortBlogs(blogsInDb))

    setMessageStyle(successStyle)
    setMessage('Blog has been deleted')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  //when the user is not logged in
  if (user === null) {
    return (
      <div>
        <h2>Log in</h2>
        <Message message={message} style={messageStyle} />
        <LoginForm
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  //when the user is logged in
  return (
    <div>
      <h2>Blog App</h2>
      <Message message={message} style={messageStyle} />
      <p>
        {user.username} has logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </p>
      <Togglable
        buttonLabel='Create New Blog'
        ref={blogFormRef}
      >
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
          username={user.username}
        />
      )}
    </div>
  )
}

export default App