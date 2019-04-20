let username = 'hello@hello.com'
describe('Register page', () => {
    before(() => {
        cy.task('clearDb')
        cy.task('addUser', {username: username})
    });
    beforeEach(() => {
        cy.visit('/#/register')
    });
    it('should contain Registrera', () => {
        cy.contains('Registrera')
    });
    it('should show error notification if no email', () => {
        cy.get('[data-cy=register-button]').click()
        cy.get('.oplog-notification.error').should('contain', 'Ange en giltig e-postadress')
    })
    it('should show error notification if user already exists', () => {
        cy.get('[data-cy=email-input]').type(username)
        cy.get('[data-cy=register-button]').click()
        cy.get('.oplog-notification.error').should('contain', 'E-postadressen används redan')
    })
    it('should show info notification', function() {
        if (Cypress.env('TEST_EMAIL') === true) {
            cy.get('[data-cy=email-input]').type('oplog.dev@gmail.com')
            cy.get('[data-cy=register-button]').click()
            cy.get('.oplog-notification.error').should('not.exist')
            cy.get('.oplog-notification.info').should('exist')
        } else {
            this.skip()
        }
        
    })
});