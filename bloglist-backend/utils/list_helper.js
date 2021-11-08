const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (arrayOfBlogs) => {
    const reducer = (sumOfLikes, blog) => {
        return sumOfLikes + blog.likes
    }

    return arrayOfBlogs.reduce(reducer, 0)
}

const favouriteBlog = (arrayOfBlogs) => {
    const reducer = (blogWithMostLikes, blog) => {
        if (blog.likes > blogWithMostLikes.likes) {
            blogWithMostLikes = blog
        }

        return blogWithMostLikes
    }

    return arrayOfBlogs.length === 0 
        ? []
        : arrayOfBlogs.reduce(reducer, arrayOfBlogs[0])
}

//this ?might? get slow with larger lists
const mostBlogs = (arrayOfBlogs) => {
    //list with names of authors and the amount of blogs they have
    let arrayOfAuthors = []

    //add authors names to the list (with 0 blogs)
    arrayOfBlogs.forEach(blog => {
        arrayOfAuthors = arrayOfAuthors.concat([{'author': blog.author, 'blogs': 0}])
    })

    //remove duplicate authors
    arrayOfAuthors = lodash.uniqBy(arrayOfAuthors, 'author')

    //set the amount of blogs each author has
    arrayOfAuthors.forEach(author => {
        arrayOfBlogs.forEach(blog => {
            if (blog.author === author.author) {
                author.blogs++
            }
        })
    })

    //find the index of the author with most blogs
    let authorIndex = 0
    arrayOfAuthors.forEach((author, index) => {
        if (author.blogs > arrayOfAuthors[authorIndex].blogs) {
            authorIndex = index
        }
    })

    //return the author with most blogs
    return arrayOfAuthors[authorIndex]
}

//this ?might? get slow with larger lists
const mostLikes = (arrayOfBlogs) => {
        //list with names of authors and the amount of likes they have
        let arrayOfAuthors = []

        //add authors names to the list (with 0 likes)
        arrayOfBlogs.forEach(blog => {
            arrayOfAuthors = arrayOfAuthors.concat([{'author': blog.author, 'likes': 0}])
        })
    
        //remove duplicate authors
        arrayOfAuthors = lodash.uniqBy(arrayOfAuthors, 'author')
    
        //set the amount of likes each author has
        arrayOfAuthors.forEach(author => {
            arrayOfBlogs.forEach(blog => {
                if (blog.author === author.author) {
                    author.likes += blog.likes
                }
            })
        })
    
        //find the index of the author with most likes
        let authorIndex = 0
        arrayOfAuthors.forEach((author, index) => {
            if (author.likes > arrayOfAuthors[authorIndex].likes) {
                authorIndex = index
            }
        })
    
        //return the author with most blogs
        return arrayOfAuthors[authorIndex]
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}