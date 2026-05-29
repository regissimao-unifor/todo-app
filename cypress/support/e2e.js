// cypress/support/e2e.js
// Importações globais e configurações do Cypress

// Comando personalizado: limpa todas as tarefas via API antes de cada teste
Cypress.Commands.add('clearAllTasks', () => {
  cy.request('DELETE', `${Cypress.env('apiUrl')}/tasks`);
});

// Comando personalizado: cria uma tarefa via API
Cypress.Commands.add('createTask', (title) => {
  return cy.request('POST', `${Cypress.env('apiUrl')}/tasks`, { title });
});
