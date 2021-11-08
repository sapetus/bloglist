const listHelper = require('../utils/list_helper.js')

describe('Total likes', () => {
    const emptyList = []
    const listWithOneBlog = [
        {
            _id: '456azts56syhs6suu',
            title: 'A Blog Title',
            author: 'Author McAuthorface',
            url: 'http://www.blogblog.com',
            likes: 10,
            __v: 0
        }
    ]
    const listWithManyBlogs = [
        {
            _id: '456azts56syhs6suu',
            title: 'A Blog Title',
            author: 'Author McAuthorface',
            url: 'http://www.blogblog.com',
            likes: 10,
            __v: 0
        },
        {
            _id: '123f4yghe5sr5yhsyhsr',
            title: 'This is a Blog',
            author: 'Blog Bloginton',
            url: 'http://www.blogblogblog.com',
            likes: 1,
            __v: 0
        },
        {
            _id: '1314rfggg4q34ggagaeg',
            title: 'A blog: blog',
            author: 'A',
            url: 'http://www.blogblogblogblog.com',
            likes: 4,
            __v: 0
        }
    ]

    test('of an empty list is zero', () => {
        expect(listHelper.totalLikes(emptyList)).toBe(0)
    })

    test('when list has only one blog', () => {
        expect(listHelper.totalLikes(listWithOneBlog)).toBe(10)
    })

    test('of a bigger list', () => {
        expect(listHelper.totalLikes(listWithManyBlogs)).toBe(15)
    })
})

describe('Blog with most likes:', () => {
    const emptyList = []
    const listWithOneBlog = [
        {
            _id: '456azts56syhs6suu',
            title: 'A Blog Title',
            author: 'Author McAuthorface',
            url: 'http://www.blogblog.com',
            likes: 10,
            __v: 0
        }
    ]
    const listWithManyBlogs = [
        {
            _id: '456azts56syhs6suu',
            title: 'A Blog Title',
            author: 'Author McAuthorface',
            url: 'http://www.blogblog.com',
            likes: 10,
            __v: 0
        },
        {
            _id: '123f4yghe5sr5yhsyhsr',
            title: 'This is a Blog',
            author: 'Blog Bloginton',
            url: 'http://www.blogblogblog.com',
            likes: 1,
            __v: 0
        },
        {
            _id: '1314rfggg4q34ggagaeg',
            title: 'A blog: blog',
            author: 'A',
            url: 'http://www.blogblogblogblog.com',
            likes: 4,
            __v: 0
        }
    ]

    test('empty list', () => {
        expect(listHelper.favouriteBlog(emptyList)).toEqual([])
    })

    test('list with only one blog', () => {
        expect(listHelper.favouriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0])
    })

    test('list with many blogs', () => {
        expect(listHelper.favouriteBlog(listWithManyBlogs)).toEqual(listWithManyBlogs[0])
    })
})

describe('Author with most blogs:', () => {
    const listOfManyBlogs = [
        {
            _id: '456azts56syhs6suu',
            title: 'A Blog Title',
            author: 'Author McAuthorface',
            url: 'http://www.blogblog.com',
            likes: 10,
            __v: 0
        },
        {
            _id: '123f4yghe5sr5yhsyhsr',
            title: 'This is a Blog',
            author: 'Blog Bloginton',
            url: 'http://www.blogblogblog.com',
            likes: 1,
            __v: 0
        },
        {
            _id: '1314rfggg4q34ggagaeg',
            title: 'A blog: blog',
            author: 'A',
            url: 'http://www.blogblogblogblog.com',
            likes: 4,
            __v: 0
        },
        {
            _id: '45tyge4h5w5as5aya5h',
            title: 'A blog: blog',
            author: 'Author McAuthorface',
            url: 'http://www.43gz<zg4aggzrg.com',
            likes: 2,
            __v: 0
        },
        {
            _id: '5748725dfgzdfzfasghrsrt3',
            title: 'A blog: blog',
            author: 'Author McAuthorface',
            url: 'http://www.ikaaakakwkaasa.com',
            likes: 21,
            __v: 0
        },
        {
            _id: '4aaa4gae4ga5ga5',
            title: 'A blog: blog',
            author: 'A',
            url: 'http://www.4tsegs5sgsgs5g.com',
            likes: 0,
            __v: 0
        },
        {
            _id: 'as4tsss5gs5g',
            title: 'A blog: blog',
            author: 'Blog Bloginton',
            url: 'http://www.34t4aaaagag4.com',
            likes: 2,
            __v: 0
        },
        {
            _id: '35tgzsgs5y',
            title: 'A blog: blog',
            author: 'Blog Bloginton',
            url: 'http://www.43gz<zg4aggzrg.com',
            likes: 2,
            __v: 0
        },
        {
            _id: 'qt34tty5ygsrg',
            title: 'A blog: blog',
            author: 'Blog Bloginton',
            url: 'http://www.43gz<zg4aggzrg.com',
            likes: 2,
            __v: 0
        }
    ]
    const emptyList = []
    const sameAmountOfBlogs = [
        {
            _id: '456azts56syhs6suu',
            title: 'A Blog Title',
            author: 'Author McAuthorface',
            url: 'http://www.blogblog.com',
            likes: 10,
            __v: 0
        },
        {
            _id: '123f4yghe5sr5yhsyhsr',
            title: 'This is a Blog',
            author: 'Blog Bloginton',
            url: 'http://www.blogblogblog.com',
            likes: 1,
            __v: 0
        },
        {
            _id: '1314rfggg4q34ggagaeg',
            title: 'A blog: blog',
            author: 'A',
            url: 'http://www.blogblogblogblog.com',
            likes: 4,
            __v: 0
        }
    ]

    test('in a list with many blogs', () => {
        expect(listHelper.mostBlogs(listOfManyBlogs))
            .toEqual({ 'author': 'Blog Bloginton', 'blogs': 4 })
    })

    test('in an empty list', () => {
        expect(listHelper.mostBlogs(emptyList)).toEqual(undefined)
    })

    test('authors have same amount of blogs', () => {
        expect(listHelper.mostBlogs(sameAmountOfBlogs))
            .toEqual({'author': 'Author McAuthorface', 'blogs': 1})
    })
})

describe('Author with most likes:', () => {
    const emptyList = []
    const listWithOneBlog = [
        {
            _id: '456azts56syhs6suu',
            title: 'A Blog Title',
            author: 'Author McAuthorface',
            url: 'http://www.blogblog.com',
            likes: 10,
            __v: 0
        }
    ]
    const listWithManyBlogs = [
        {
            _id: '456azts56syhs6suu',
            title: 'A Blog Title',
            author: 'Author McAuthorface',
            url: 'http://www.blogblog.com',
            likes: 10,
            __v: 0
        },
        {
            _id: '123f4yghe5sr5yhsyhsr',
            title: 'This is a Blog',
            author: 'Blog Bloginton',
            url: 'http://www.blogblogblog.com',
            likes: 1,
            __v: 0
        },
        {
            _id: '1314rfggg4q34ggagaeg',
            title: 'A blog: blog',
            author: 'A',
            url: 'http://www.blogblogblogblog.com',
            likes: 4,
            __v: 0
        },
        {
            _id: '56534563456',
            title: 'A blog: blog',
            author: 'A',
            url: 'http://www.blogblogblogblog.com',
            likes: 10,
            __v: 0
        }
    ]
    const listWithSameAmountOfLikes = [
        {
            _id: '456azts56syhs6suu',
            title: 'A Blog Title',
            author: 'Author McAuthorface',
            url: 'http://www.blogblog.com',
            likes: 14,
            __v: 0
        },
        {
            _id: '123f4yghe5sr5yhsyhsr',
            title: 'This is a Blog',
            author: 'Blog Bloginton',
            url: 'http://www.blogblogblog.com',
            likes: 1,
            __v: 0
        },
        {
            _id: '1314rfggg4q34ggagaeg',
            title: 'A blog: blog',
            author: 'A',
            url: 'http://www.blogblogblogblog.com',
            likes: 4,
            __v: 0
        },
        {
            _id: '56534563456',
            title: 'A blog: blog',
            author: 'A',
            url: 'http://www.blogblogblogblog.com',
            likes: 10,
            __v: 0
        }
    ]

    test('in a list with many blogs', () => {
        expect(listHelper.mostLikes(listWithManyBlogs))
            .toEqual({'author': 'A', 'likes': 14})
    })

    test('in an empty list', () => {
        expect(listHelper.mostLikes(emptyList)).toEqual(undefined)
    })

    test('in a list with same amount of likes', () => {
        expect(listHelper.mostLikes(listWithSameAmountOfLikes))
            .toEqual({'author': 'Author McAuthorface', 'likes': 14})
    })
})