import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm.js'

test('Creation of a blog calls the callback function with right information', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const form = component.container.querySelector('form')
  const titleInput = component.container.querySelector('#title')
  const authorInput = component.container.querySelector('#author')
  const urlInput = component.container.querySelector('#url')

  fireEvent.change(titleInput, {
    target: { value: 'Blog Title' }
  })
  fireEvent.change(authorInput, {
    target: { value: 'Blog Author' }
  })
  fireEvent.change(urlInput, {
    target: { value: 'Blog Url' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Blog Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Blog Author')
  expect(createBlog.mock.calls[0][0].url).toBe('Blog Url')
})