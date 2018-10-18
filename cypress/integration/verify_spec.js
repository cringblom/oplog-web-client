describe('Verify account page', () => {
    
    it('should contain "Ett fel uppstod" if token is incorrect', () => {
        cy.visit('/#/verify/1234')
    });
    
});
describe('Verify page: new user', () => {
    let token
    before(() => {
        cy.exec('node ~/documents/oplog/dev-scripts/add-test-tempuser.js newuser=false')
        .then((result) => {
            token = result.stdout
        })
    });
    beforeEach(() => {
        cy.visit('/#/verify/'+token)
    });
    it('should contain "Återställ lösenord"', () => {
        cy.contains('Återställ lösenord')
    });
    it('should have email in input', () => {
        cy.get('[data-cy=verify-email-input]').should('have.value', 'a.test.user@test.com')
    });
    it('should show error notification on diffrent passwords', () => {
        cy.get('[data-cy=verify-password-input]').type('hellohello')
        cy.get('[data-cy=verify-password-repeat-input]').type('hollaholla')
        cy.get('[data-cy=verify-submit-button]').click()
        cy.get('.oplog-notification.error').should('exist')
    });
    it('should show error notification on password length < 6', () => {
        cy.get('[data-cy=verify-password-input]').type('hello')
        cy.get('[data-cy=verify-password-repeat-input]').type('hello')
        cy.get('[data-cy=verify-submit-button]').click()
        cy.get('.oplog-notification.error').should('exist')
    });
    it('should show error notification on password length > 6', () => {
        cy.get('[data-cy=verify-password-input]').type('hellohellohellohelloh')
        cy.get('[data-cy=verify-password-repeat-input]').type('hellohellohellohelloh')
        cy.get('[data-cy=verify-submit-button]').click()
        cy.get('.oplog-notification.error').should('exist')
    });
    it('should navigate to #/operations on correct password', () => {
        cy.get('[data-cy=verify-password-input]').type('hellohello')
        cy.get('[data-cy=verify-password-repeat-input]').type('hellohello')
        cy.get('[data-cy=verify-submit-button]').click()
        cy.hash().should('equal', '#/operations')
    });
});
describe('Verify page: reset password', () => {
    let token
    before(() => {
        cy.exec('node ~/documents/oplog/dev-scripts/add-test-tempuser.js newuser=true')
        .then((result) => {
            token = result.stdout
        })
    });
    beforeEach(() => {
        cy.visit('/#/verify/'+token)
    });
    it('should contain "Snart klar!"', () => {
        cy.contains('Snart klar!')
    });
    it('should have email in input', () => {
        cy.get('[data-cy=verify-email-input]').should('have.value', 'a.test.user@test.com')
    });
    it('should navigate to #/operations on correct password', () => {
        cy.get('[data-cy=verify-password-input]').type('hellohello')
        cy.get('[data-cy=verify-password-repeat-input]').type('hellohello')
        cy.get('[data-cy=verify-submit-button]').click()
        cy.hash().should('equal', '#/operations')
    });
});