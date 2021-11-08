import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog.js'

let component
let updateBlog
let removeBlog

const blog = {
  author: 'Author',
  title: 'Title',
  url: 'url',
  likes: 1,
  //this id doesnt match anything in db, only for test purposes
  user: '60eea09d36d242da9935ff9a'
}
const username = 'username'

beforeEach(() => {
  updateBlog = jest.fn()
  removeBlog = jest.fn()

  component = render(
    <Blog
      blog={blog}
      updateBlog={updateBlog}
      removeBlog={removeBlog}
      username={username}
    />
  )
})

test('Render author and title but not url or likes', () => {
  expect(component.container).toHaveTextContent(
    blog.author
  )
  expect(component.container).toHaveTextContent(
    blog.title
  )
  expect(component.container).not.toHaveTextContent(
    blog.url
  )
  expect(component.container).not.toHaveTextContent(
    'Likes'
  )
})

test('When button is pressed, show url and likes', () => {
  const showMoreButton = component.getByText('View')
  fireEvent.click(showMoreButton)

  expect(component.container).toHaveTextContent(
    blog.author
  )
  expect(component.container).toHaveTextContent(
    blog.title
  )
  expect(component.container).toHaveTextContent(
    blog.url
  )
  expect(component.container).toHaveTextContent(
    'Likes'
  )
})

test('Liking a blog twice, calls eventHandler twice', () => {
  const showMoreButton = component.getByText('View')
  fireEvent.click(showMoreButton)

  const likeButton = component.getByText('Like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(updateBlog.mock.calls).toHaveLength(2)
})