const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

const initialBlogs = [
    {
        title: 'A blog',
        author: 'Blog Bloginton',
        url: 'www.pagewithblog.com',
        likes: 10,
        user: ''
    },
    {
        title: 'stuff i do',
        author: 'Author McAuthorface',
        url: 'www.webpagewithaplog.com',
        likes: 100,
        user: ''
    }
]

const user = {
    username: 'test',
    name: 'test',
    password: 'test'
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

/*
/clear db and create an user whos id is used for test blogs
*/
const getUserIdInDb = async () => {
    await User.deleteMany({})

    const initialUserPasswordHash =
        await bcrypt.hash(user.password, 10)
    const initialUser = {
        username: user.username,
        name: user.name,
        passwordHash: initialUserPasswordHash
    }
    await User.create(initialUser)

    const userInDb = await usersInDb()
    const userId = userInDb[0].id

    return userId
}

module.exports = {
    initialBlogs,
    user,
    usersInDb,
    blogsInDb,
    getUserIdInDb
}