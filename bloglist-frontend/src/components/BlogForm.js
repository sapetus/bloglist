import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      url: newUrl,
      author: newAuthor,
      title: newTitle
    }

    createBlog(blogObject)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Add a new Blog</h2>
      <form id='blog-form' onSubmit={addBlog}>
        Title:
        <input
          id='title'
          type='text'
          value={newTitle}
          onChange={handleTitleChange}
        />
        <br />
        Author:
        <input
          id='author'
          type='text'
          value={newAuthor}
          onChange={handleAuthorChange}
        />
        <br />
        URL:
        <input
          id='url'
          type='text'
          value={newUrl}
          onChange={handleUrlChange}
        />
        <br />
        <button id='create-button' type='submit'>create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm