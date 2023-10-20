/// <reference types="cypress" />

describe('TODO tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:62281');
    cy.get('input').type('Новое дело');
    cy.contains('Добавить дело').click();
    cy.get('ul li:first-child').should('contain.text', 'Новое дело');
  });

  it('Дело успешно удаляется', () => {
    cy.get('ul li:first-child').contains('Удалить').click();
    cy.get('ul').should('be.empty');
  });

  it('Дело успешно отмечается как сделанное или нет', () => {
    cy.get('ul li:first-child').contains('Готово').click();
    cy.get('ul li:first-child').should('have.class', 'list-group-item-success');
    cy.get('ul li:first-child').contains('Готово').click();
    cy.get('ul li:first-child').should('not.have.class', 'list-group-item-success');
  });
})
