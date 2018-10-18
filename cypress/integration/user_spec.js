describe('User page', () => {
    before(() => {
        cy.exec('node ~/documents/oplog/dev-scripts/add-test-user.js')
    })
    beforeEach(() => {
        cy.request({
            url: '/api/v1/login',
            method: 'POST',
            body: {
                username: 'a.test.user@test.com',
                password: 'testtest'
            }
        })
    })
    beforeEach(() => {
        cy.visit('/#/user')
    });
    it('should contain username', () => {
        cy.get('[data-cy=username-span]').contains('a.test.user@test.com')
    });
    it('should logout if logout button is clicked', () => {
        cy.get('[data-cy=logout-button').click()
        cy.hash().should('equal', '#/login')
    });
    it('should show remove account modal id remove account button is clicked', () => {
        cy.get('[data-cy=remove-account-button').click()
        cy.get('[data-cy=remove-account-modal-view]')
    });
    it('shold dismiss remove account modal if avbryt is clicked', () => {
        cy.get('[data-cy=remove-account-button').click()
        cy.get('[data-cy=remove-account-cancel-button]').click()
        cy.get('[data-cy=remove-account-modal-view]').should('not.exist')
    });
    it('should show error notification if remove account email is incorrect', () => {
        cy.get('[data-cy=remove-account-button').click()
        cy.get('[data-cy=remove-account-email-input').type('hello@hello.com')
        cy.get('[data-cy=remove-account-submit-button').click()
        cy.get('.oplog-notification.error').should('exist')

    });
    it('remove account procedure', () => {
        cy.get('[data-cy=remove-account-button').click()
        cy.get('[data-cy=remove-account-modal-view]')
        cy.get('[data-cy=remove-account-email-input').type('a.test.user@test.com')
        cy.get('[data-cy=remove-account-submit-button').click()
        cy.hash().should('equal', '#/login')
        cy.request({
            url: '/api/v1/login',
            method: 'POST',
            failOnStatus: false,
            body: {
                username: 'a.test.user@test.com',
                password: 'testtest'
            }
        })
        .then((res) => {
            assert.equal(res.status, 401)
        })
    });
});