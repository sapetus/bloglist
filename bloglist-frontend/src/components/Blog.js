import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog, username }) => {
  const [visible, setVisible] = useState(false)

  const handleClick = () => {
    setVisible(!visible)
  }

  const update = (event) => {
    event.preventDefault()

    const blogObject = {
      user: blog.user[0].id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    updateBlog(blogObject, blog.id)
  }

  const remove = (event) => {
    event.preventDefault()

    const confirm = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)

    if (confirm) {
      removeBlog(blog.id)
    }
  }

  if (!visible) {
    return (
      <div className='blog'>
        {blog.title}, {blog.author}
        &nbsp;
        <button className='show-button' onClick={handleClick}>View</button>
      </div>
    )
  }

  if (visible) {
    //if user logged in matches the user who posted the blog, show delete button
    if (username === blog.user[0].username) {
      return (
        <div className='blog'>
          Title: {blog.title} <br />
          Author: {blog.author} <br />
          URL: {blog.url} <br />
          Likes: {blog.likes} <button className='like-button' onClick={update}>Like</button> <br />
          User: {blog.user[0].name} <br />
          <button className='hide-button' onClick={handleClick}>Hide</button>
          <button className='delete-button' onClick={remove}>Delete</button>
        </div>
      )
    }
    //else dont show the delete button
    return (
      <div className='blog'>
        Title: {blog.title} <br />
        Author: {blog.author} <br />
        URL: {blog.url} <br />
        Likes: {blog.likes} <button className='like-button' onClick={update}>Like</button> <br />
        User: {blog.user[0].name} <br />
        <button className='hide-button' onClick={handleClick}>Hide</button>
      </div>
    )
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}

export default Blog