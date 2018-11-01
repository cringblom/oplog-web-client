describe('Login page', () => {
    let username = 'oplog.dev@gmail.com'
    let password = 'testtest'
    before(() => {
        cy.task('clearDb')
        cy.task('addUser', {
            username: username,
            password: password
        })
    });
    beforeEach(() => {
        cy.visit('/#/login')
    });
    it('should display Logga in', () => {
        cy.contains('Logga in')
    });
    it('should redirect to /forgot if forgot link is clicked', () => {
        cy.get('[data-cy=forgot-link]').click()
        cy.hash().should('equal', '#/forgot')
    });
    it('should redirect to /register if register button is clicked', () => {
        cy.get('[data-cy=register-button]').click()
        cy.hash().should('equal', '#/register')
    });
    it('should show notification if no username/password', () => {
        cy.get('[data-cy=login-button]').click()
        cy.get('.oplog-notification.error').should('exist')
    })
    it('should show notification if no password', () => {
        cy.get('[data-cy=username-input]').type(username)
        cy.get('[data-cy=login-button]').click()
        cy.get('.oplog-notification.error').should('exist')
    })
    it('should show notification if wrong password', () => {
        cy.get('[data-cy=username-input]').type(username)
        cy.get('[data-cy=password-input]').type('1234567')
        cy.get('[data-cy=login-button]').click()
        cy.get('.oplog-notification.error').should('exist')
    })
    it('should show notification if wrong password on enter', () => {
        cy.get('[data-cy=username-input]').type(username)
        cy.get('[data-cy=password-input]').type('1234567{enter}')
        cy.get('.oplog-notification.error').should('exist')
    })
    it('should redirect to /operations on login-button click', () => {
        cy.get('[data-cy=username-input]').type(username)
        cy.get('[data-cy=password-input]').type(password+'{enter}')
        cy.hash().should('equal', '#/operations')
    })
})