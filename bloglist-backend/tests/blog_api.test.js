const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const api = supertest(app)
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const helper = require('./test_helper.js')

describe('Blog tests', () => {
    beforeEach(async () => {
        const userId = await helper.getUserIdInDb()

        const blogsToInsert = helper.initialBlogs
        blogsToInsert.map(blog => {
            blog.user = userId
        })

        await Blog.deleteMany({})
        await Blog.insertMany(blogsToInsert)
    })

    //these work
    describe('HTTP GET for blogs', () => {
        test('return blogs as JSON', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('return all blogs', async () => {
            const response = await api.get('/api/blogs')

            expect(response.body).toHaveLength(helper.initialBlogs.length)
        })

        test('a specific blog is returned', async () => {
            const response = await api.get('/api/blogs')
            const contents = response.body

            contents.map(blog => {
                blog.user = blog.user[0].id
                delete blog.id
            })

            expect(contents).toContainEqual(helper.initialBlogs[0])
        })

        test('identifying field is named id', async () => {
            const response = await api.get('/api/blogs')
            const propertyNames = Object.getOwnPropertyNames(response.body[0])

            expect(propertyNames).toContain('id')
        })
    })

    //these work
    describe('HTTP POST for blogs', () => {
        const newBlog = {
            user: '',
            title: 'Test Title',
            author: 'Test Author',
            url: 'Test URL',
            likes: 999
        }
        const newBlogWithoutLikes = {
            title: 'Test Title',
            author: 'Test Author',
            url: 'Test URL'
        }
        const newBlogWithoutTitleAndURL = {
            author: 'Test Author',
            likes: 999
        }

        test('posting a blog without a token doesnt work', async () => {
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)

            const blogsInDb = await helper.blogsInDb()

            expect(blogsInDb).toHaveLength(helper.initialBlogs.length)
        })

        //this aint working on CI/CD pipeline
        test('when a blog is POSTed, number of blogs increases', async () => {
            const x = await api.post('/api/login').send(helper.user)
            console.log(x)

            const loginResponse = await api
                .post('/api/login')
                .send(helper.user)
                .expect(200)

            const loginToken = loginResponse.body.token

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `bearer ${loginToken}`)
                .expect(201)

            const blogsInDb = await helper.blogsInDb()

            expect(blogsInDb).toHaveLength(helper.initialBlogs.length + 1)
        })

        test('POSTed blog has right content', async () => {
            //log in with user and get the login token
            const loginResponse = await api
                .post('/api/login')
                .send(helper.user)
                .expect(200)
            const loginToken = loginResponse.body.token

            //get an id of an user in the db to be used 
            //in the user field of a blog
            const usersInDb = await helper.usersInDb()
            const userId = usersInDb[0].id

            //blog to be posted
            const copyOfNewBlog = { ...newBlog }
            copyOfNewBlog.user = userId

            //post a blog
            await api
                .post('/api/blogs')
                .send(copyOfNewBlog)
                .set('Authorization', `bearer ${loginToken}`)
                .expect(201)

            const blogsInDb = await helper.blogsInDb()
            //removes the id field of each blog and set user
            blogsInDb.map(blog => {
                //change the id to a string for this to work
                blog.user = blog.user[0].toString()
                delete blog.id
            })

            expect(blogsInDb).toContainEqual(copyOfNewBlog)
        })

        test('POSTed blog with no likes value has it set to 0', async () => {
            const loginResponse = await api
                .post('/api/login')
                .send(helper.user)
                .expect(200)

            const loginToken = loginResponse.body.token

            await api
                .post('/api/blogs')
                .send(newBlogWithoutLikes)
                .set('Authorization', `bearer ${loginToken}`)
                .expect(201)

            const response = await api.get('/api/blogs')
            const notesInDb = response.body

            expect(notesInDb[notesInDb.length - 1].likes).toEqual(0)
        })

        test('POSTing a blog with no title and url isnt added to db', async () => {
            const loginResponse = await api
                .post('/api/login')
                .send(helper.user)
                .expect(200)

            const loginToken = loginResponse.body.token

            await api
                .post('/api/blogs')
                .send(newBlogWithoutTitleAndURL)
                .set('Authorization', `bearer ${loginToken}`)
                .expect(400)

            const response = await api.get('/api/blogs')
            const notesInDb = response.body

            expect(notesInDb).toHaveLength(helper.initialBlogs.length)
        })
    })

    //these work
    describe('HTTP DELETE for blogs', () => {
        const newBlog = {
            title: 'Test Title',
            author: 'Test Author',
            url: 'Test URL',
            likes: 999
        }

        test('a specific blog is deleted', async () => {
            const loginResponse = await api
                .post('/api/login')
                .send(helper.user)
                .expect(200)

            const loginToken = loginResponse.body.token

            const results = await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `bearer ${loginToken}`)
                .expect(201)

            const savedNote = results.body

            const response_1 = await api.get('/api/blogs')
            const notesInDbBeforeDeletion = response_1.body

            await api
                .delete(`/api/blogs/${savedNote.id}`)
                .set('Authorization', `bearer ${loginToken}`)
                .expect(204)

            const response_2 = await api.get('/api/blogs')
            const notesInDbAfterDeletion = response_2.body

            expect(notesInDbBeforeDeletion.length).toEqual(notesInDbAfterDeletion.length + 1)
        })
    })

    //these work
    describe('HTTP PUT for blogs', () => {
        const newBlog = {
            user: '',
            title: 'Test Title',
            author: 'Test Author',
            url: 'Test URL',
            likes: 999
        }

        test('a blog can be updated', async () => {
            const loginResponse = await api
                .post('/api/login')
                .send(helper.user)
                .expect(200)

            const loginToken = loginResponse.body.token

            //post a blog to be modified
            const postResults = await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `bearer ${loginToken}`)
                .expect(201)
            //data of the post
            const postedBlog = postResults.body

            //information to be updated
            const updateInformation = { likes: 1000, user: postedBlog.user[0] }

            //this is an identical object to the one being updated
            const blogWithUpdatedInformation = { ...newBlog, ...updateInformation }

            //the update itself
            await api
                .put(`/api/blogs/${postedBlog.id}`)
                .send(updateInformation)
                .set('Authorization', `bearer ${loginToken}`)
                .expect(200)
            
            //clean the objects
            const blogsInDb = await helper.blogsInDb()
            blogsInDb.map(blog => {
                delete blog.id
                blog.user = blog.user.toString()
            })

            expect(blogsInDb).toContainEqual(blogWithUpdatedInformation)
        })
    })
})

//these work
describe('User tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })

    test('a new user can be added', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'testUsername',
            name: 'testName',
            password: 'testPassword'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('user with invalid password cannot be added', async () => {
        const usersAtStart = await helper.usersInDb()

        const invalidUser = {
            username: 'test',
            name: 'test',
            password: 'a'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('user with no password cannot be added', async () => {
        const usersAtStart = await helper.usersInDb()

        const invalidUser = {
            username: 'test',
            name: 'test'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('user with invalid username cannot be added', async () => {
        const usersAtStart = await helper.usersInDb()

        const invalidUser = {
            username: 'a',
            name: 'test',
            password: 'test'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('user with no username cannot be added', async () => {
        const usersAtStart = await helper.usersInDb()

        const invalidUser = {
            name: 'test',
            password: 'test'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('user with invalid username and password cannot be added', async () => {
        const usersAtStart = await helper.usersInDb()

        const invalidUser = {
            username: 'a',
            name: 'test',
            password: 'a'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('user with no username and no password cannot be added', async () => {
        const usersAtStart = await helper.usersInDb()

        const invalidUser = {
            name: 'test'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})