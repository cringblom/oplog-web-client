let username = 'oplog.dev@gmail.com'
describe('Forgot page', () => {
    before(() => {
        cy.task('clearDb')
        cy.task('addUser', {username: username})
    });
    beforeEach(() => {
        cy.visit('/#/forgot')
    });
    it('should contain Återställ lösenord', () => {
        cy.contains('Återställ lösenord')
    });
    it('should show error notification if no email', () => {
        cy.get('[data-cy=register-button]').click()
        cy.get('.oplog-notification.error').should('exist')
    })
    it('should show error notification if wrong email', () => {
        cy.get('[data-cy=email-input]').type('hello@hello.com')
        cy.get('[data-cy=register-button]').click()
        cy.get('.oplog-notification.error').should('exist')
    })
    it('should show info notification', function() {
        if (Cypress.env('TEST_EMAIL') === true) {
            cy.get('[data-cy=email-input]').type(username)
            cy.get('[data-cy=register-button]').click()
            cy.get('.oplog-notification.error').should('not.exist')
            cy.get('.oplog-notification.info').should('exist')
        } else {
            this.skip()
        }
    })
});