let username = 'oplog.dev@gmail.com'
let password = 'testtest'
describe('User page', function() {
    before(function() {
        cy.task('clearDb')
        cy.task('addUser', {
            username: username,
            password: password
        })
    })
    beforeEach(() => {
        cy.request({
            url: '/api/v1/login',
            method: 'POST',
            body: {
                username: username,
                password: password
            }
        })
    })
    beforeEach(() => {
        cy.visit('/#/user')
    });
    it('should contain username', function() {
        cy.get('[data-cy=username-span]').contains(username)
    });
    it('should logout if logout button is clicked', function() {
        cy.get('[data-cy=logout-button').click()
        cy.hash().should('equal', '#/login')
    });
    it('remove account procedure', function() {
        cy.get('[data-cy=remove-account-toggle-button').click()
        cy.get('[data-cy=remove-account-email-input').type(username)
        cy.get('[data-cy=remove-account-submit-button').click()
        cy.hash().should('equal', '#/login')
        cy.request({
            url: '/api/v1/login',
            method: 'POST',
            failOnStatus: false,
            body: {
                username: username,
                password: password
            }
        })
        .then((res) => {
            assert.equal(res.status, 401)
        })
    });
});