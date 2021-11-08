const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

//get all blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

//post a new blog
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    //checks if the token is valid
    if (!request.token || !request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    //set the user who added the blog
    const user = await User.findById(request.user)
    blog.user = user._id

    //if no likes are given, set likes to 0
    if (!blog.likes) {
        blog.likes = 0
    }

    if (!blog.title || !blog.url) {
        response.status(400).end()
    } else {
        await blog.save()
        response.status(201).json(blog.toJSON())
    }
})

//remove a specific blog
blogsRouter.delete('/:id', async (request, response) => {
    const blogToDelete = await Blog.findById(request.params.id)

    //check that the token is valid
    if (!request.token || !request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    //check that the token's id is same as the blogs user id
    if (blogToDelete.user.toString() === request.user) {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } else {
        response.status(401).json({ error: 'token is invalid' })
    }
})

//update a specific blog
blogsRouter.put('/:id', async (request, response) => {
    //get body of the request
    const requestBody = request.body
    const blogUpdate = { ...requestBody }

    //the blog to be updated
    const blogToUpdate = await Blog.findById(request.params.id)

    //check that the token is valid
    if (!request.token || !request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    //the update itself
    try {
        await Blog.findByIdAndUpdate(request.params.id, blogUpdate, { new: true })
        response.status(200).end()
    } catch (err) {
        response.json({ error: err.message })
    }

    //to allow updating only by the user who created the blog, uncomment this
    // //check that token id is the same as blogs user id
    // if (blogToUpdate.user.toString() === request.user) {
    //     try {
    //         await Blog.findByIdAndUpdate(request.params.id, blogUpdate, {new: true})
    //         response.status(200).end()
    //     } catch (err) {
    //         response.json({ error: err.message })
    //     }
    // } else {
    //     response.status(401).json({ error: 'token is invalid' })
    // }
})

module.exports = blogsRouter