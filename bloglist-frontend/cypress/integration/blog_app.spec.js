describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const testUser = {
      name: 'test',
      username: 'test',
      password: 'test'
    }
    cy.request('POST', 'http://localhost:3003/api/users', testUser)

    const testUser2 = {
      name: 'test2',
      username: 'test2',
      password: 'test2'
    }
    cy.request('POST', 'http://localhost:3003/api/users', testUser2)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.visit('http://localhost:3000')
    cy.get('#login-form')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('test')
      cy.get('#password').type('test')
      cy.get('#login-button').click()

      cy.contains('test has logged in')
    })

    it('fails with incorrect credentials', function () {
      cy.get('#username').type('test')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('#message')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'test has logged in')
    })

  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'test', password: 'test' })
    })

    it('a blog can be created', function () {
      cy.get('#show-button').click()
      cy.get('#title').type('title')
      cy.get('#author').type('author')
      cy.get('#url').type('url')
      cy.get('#create-button').click()

      cy.get('#message')
        .should('contain', 'A new blog; title by author has been added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('.blog').as('blog')
      cy.get('@blog').get('.show-button')
      cy.get('@blog').should('contain', 'title, author')
    })

    describe('when a blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'title', author: 'author', url: 'url' })
        cy.login({ username: 'test2', password: 'test2' })
        cy.createBlog({ title: 'title2', author: 'author2', url: 'url2' })
      })

      it('blog can be liked', function () {
        cy.get('.blog:last').as('blog')

        cy.get('@blog').children('.show-button').click().then(() => {
          cy.get('@blog').should('contain', 'Likes: 0')
        })

        cy.get('@blog').children('.like-button').click().then(() => {
          cy.get('@blog').should('contain', 'Likes: 1')
        })
      })

      it('a blog can be deleted by the user who created it', function () {
        cy.get('.blog:last').as('blog')

        cy.get('@blog').children('.show-button').click().then(() => {
          cy.get('@blog').children('.delete-button').click().then(() => {
            cy.get('#message')
              .should('contain', 'Blog has been deleted')
              .and('have.css', 'color', 'rgb(0, 128, 0)')
              .and('have.css', 'border-style', 'solid')
          })
        })
      })

      it('a blog cannot be deleted by another user', function () {
        cy.get('.blog:first').as('blog')

        cy.get('@blog').children('.show-button').click().then(() => {
          cy.get('@blog').children('.delete-button').should('not.exist')
        })
      })

      it.only('blogs are in descending order', function () {
        //like the last blog on the page
        cy.get('.blog:last').children('.show-button').click().then(() => {
          cy.get('.blog:last').children('.like-button').click()
        })

        //liking should lift the last blog to be first in the page
        cy.get('.blog:first').should('contain', 'Likes: 1')
        cy.get('.blog:last').children('.show-button').click().then(() => {
          cy.get('.blog:last').should('contain', 'Likes: 0')
        })
      })
    })
  })
})