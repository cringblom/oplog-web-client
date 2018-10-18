describe('Register page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4000/#/register')
    });
    it('should contain Registrera', () => {
        cy.contains('Registrera')
    });
    it('should show error notification if no email', () => {
        cy.get('[data-cy=register-button]').click()
        cy.get('.oplog-notification.error').should('exist')
    })
    it('should show info notification', () => {
        cy.server()
        cy.route({
            url: '/api/v1/register',
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