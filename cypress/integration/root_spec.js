describe('Root path', () => {
    it('should redirect to /login on authenticated-user: 401', () => {
        cy.server()
        cy.route({
            url: '/api/v1/authenticated-state',
            method: 'GET',
            status: 401,
            response: {}
        })
        cy.visit('')
        cy.hash().should('equal', '#/login')
    })
    it('should redirect to /operations on authenticated-user: 200', () => {
        cy.server()
        cy.route({
            url: '/api/v1/authenticated-state',
            method: 'GET',
            status: 200,
            response: {}
        })
        cy.visit('')
        cy.hash().should('equal', '#/operations')
        cy.hash().should('not.equal', '#/login')
    })
});