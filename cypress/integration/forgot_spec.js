
describe('Forgot page', () => {
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
    it('should show info notification', () => {
        cy.server()
        cy.route({
            url: '/api/v1/forgot',
            method: 'POST',
            status: 200,
            response: {}
        })
        cy.get('[data-cy=email-input]').type('hello@hello.com')
        cy.get('[data-cy=register-button]').click()
        cy.get('.oplog-notification.error').should('not.exist')
        cy.get('.oplog-notification.info').should('exist')
    })
});