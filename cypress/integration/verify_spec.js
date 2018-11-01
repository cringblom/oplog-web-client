let email = 'oplog.dev@gmail.com'
let token = '12345678'
describe('Verify account page', function() {
    before(function() {
        cy.task('clearDb')
        cy.task('addTempUser', {
            email: email,
            token: token
        })
    });
    it('should contain "Ett fel uppstod" if token is incorrect', () => {
        cy.visit('/#/verify/1234')
        cy.contains('Ett fel uppstod')
    });
});
describe('Verify page: new user', () => {
    before(function() {
        cy.task('clearDb')
        cy.task('addTempUser', {
            email: email,
            newUser: true,
            token: token
        })
    });
    beforeEach(() => {
        cy.visit('/#/verify/'+token)
    });
    it('should contain "Snart klar"', () => {
        cy.contains('Snart klar')
    });
    it('should have email in input', () => {
        cy.get('[data-cy=verify-email-input]').should('have.value', email)
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
    before(function() {
        cy.task('clearDb')
        cy.task('addTempUser', {
            email: email,
            newUser: false,
            token: token
        })
    });
    beforeEach(() => {
        cy.visit('/#/verify/'+token)
    });
    it('should contain "Återställ lösenord"', () => {
        cy.contains('Återställ lösenord')
    });
    it('should have email in input', () => {
        cy.get('[data-cy=verify-email-input]').should('have.value', email)
    });
    it('should navigate to #/operations on correct password', () => {
        cy.get('[data-cy=verify-password-input]').type('hellohello')
        cy.get('[data-cy=verify-password-repeat-input]').type('hellohello')
        cy.get('[data-cy=verify-submit-button]').click()
        cy.hash().should('equal', '#/operations')
    });
});