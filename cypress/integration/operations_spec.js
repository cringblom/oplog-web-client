let username = 'oplog.dev@gmail.com'
let password = 'testtest'
describe('Operations page', () => {
    before(() => {
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
        cy.visit('/#/operations')
    });
    it('should contain Inga operationer', () => {
        cy.contains('Inga operationer')
    })
    it('should show modal when add operations is clicked', () => {
        cy.get('[data-cy=add-operation-button]').click()
        cy.get('[data-cy=add-operation-modal-view]')
    })
    it('should navigate to user view if account button from dropdown is clicked', () => {
        cy.get('[data-cy=user-dropdown-button]').click()
        cy.get('[data-cy=user-account-button]').click()
        cy.hash().should('equal', '#/user')
    })
    it('should logout if logout button from dropdown is clicked', () => {
        cy.get('[data-cy=user-dropdown-button]').click()
        cy.get('[data-cy=dropdown-logout-button]').click()
        cy.hash().should('equal', '#/login')
        cy.request({
            url: '/api/v1/authenticated-state',
            failOnStatus: false
        })
        .then((res) => {
            assert.equal(res.status, 401)
        })
    })
})
describe('Operations page: Add/remove operation procedure', () => {
    before(() => {
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
        cy.visit('/#/operations')
    });
    it('add operation procedure', () => {
        cy.get('[data-cy=add-operation-button]').click()
        cy.get('[data-cy=operation-input]').type('jab30')
        cy.get('[data-cy=icd-selector-item]').contains('JAB30').click()
        cy.get('[data-cy=date-picker-wrapper]').contains(/^\s*1\s*$/).click() //Find the 1st day of the month and click
        cy.get('[data-cy=op-button]').click()
        cy.get('[data-cy=operations-view-right-section]').contains('JAB30')
    });
    it('remove operation procedure', () => {
        cy.get('[data-cy=operations-view-right-section]').contains('JAB30').get('[data-cy=delete-operation-button]').click()
        cy.contains('Inga operationer')
    });
})
describe('Operation page: Icd groups', () => {
    before(() => {
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
        cy.task('removeOperations', {username: username})
        cy.request({
            url: '/api/v1/operations',
            method: 'POST',
            body: {
                icd: 'jab30',
                mainOperator: true,
                date: '2018-09-01'
            }
        })
        cy.request({
            url: '/api/v1/operations',
            method: 'POST',
            body: {
                icd: 'JKA21',
                mainOperator: true,
                date: '2018-09-01'
            }
        })
    })
    beforeEach(() => {
        cy.visit('/#/operations')
    });
    it('should navigate to #/operations/JAB30 on icd group click', () => {
        cy.get('[data-cy=operations-view-left-section').contains('JAB30').click()
        cy.hash().should('equal', '#/operations/JAB30')
    });
    it('should navigate to #/operations/ on icd group JAB30 click and JAB30 remove', () => {
        cy.get('[data-cy=operations-view-left-section').contains('JAB30').click()
        cy.hash().should('equal', '#/operations/JAB30')
        cy.get('[data-cy=operations-view-right-section]').contains('JAB30').get('[data-cy=delete-operation-button]').click()
        cy.hash().should('equal', '#/operations')
    });

});