// cypress/e2e/frontend.cy.js
// Testes automatizados do FRONTEND (interface HTML/CSS/JS)

describe('Frontend - Aplicação To-Do List', () => {

  beforeEach(() => {
    // Limpa todas as tarefas no backend antes de cada teste
    cy.clearAllTasks();
    // Visita a página do frontend
    cy.visit('/');
  });

  // ── Carregamento da página ──
  describe('Carregamento da Página', () => {
    it('deve exibir o título da aplicação', () => {
      cy.contains('Minhas').should('be.visible');
      cy.contains('Tarefas').should('be.visible');
    });

    it('deve exibir o campo de input e o botão de adicionar', () => {
      cy.get('[data-testid="task-input"]').should('be.visible');
      cy.get('[data-testid="add-btn"]').should('be.visible');
    });

    it('deve exibir os contadores zerados inicialmente', () => {
      cy.get('[data-testid="total-count"]').should('have.text', '0');
      cy.get('[data-testid="done-count"]').should('have.text', '0');
      cy.get('[data-testid="pending-count"]').should('have.text', '0');
    });

    it('deve exibir o estado vazio quando não há tarefas', () => {
      cy.get('[data-testid="empty-state"]').should('be.visible');
    });
  });

  // ── Adicionar Tarefas ──
  describe('Adicionar Tarefas', () => {
    it('deve adicionar uma nova tarefa ao digitar e clicar no botão', () => {
      cy.get('[data-testid="task-input"]').type('Estudar para a prova');
      cy.get('[data-testid="add-btn"]').click();
      cy.get('[data-testid="task-item"]').should('have.length', 1);
      cy.get('[data-testid="task-title"]').should('contain.text', 'Estudar para a prova');
    });

    it('deve adicionar uma tarefa ao pressionar Enter', () => {
      cy.get('[data-testid="task-input"]').type('Fazer compras{enter}');
      cy.get('[data-testid="task-item"]').should('have.length', 1);
    });

    it('deve limpar o campo de input após adicionar a tarefa', () => {
      cy.get('[data-testid="task-input"]').type('Lavar a louça');
      cy.get('[data-testid="add-btn"]').click();
      cy.get('[data-testid="task-input"]').should('have.value', '');
    });

    it('deve exibir mensagem de erro ao tentar adicionar tarefa vazia', () => {
      cy.get('[data-testid="add-btn"]').click();
      cy.get('[data-testid="error-msg"]').should('be.visible').and('not.be.empty');
    });

    it('deve atualizar os contadores ao adicionar tarefas', () => {
      cy.get('[data-testid="task-input"]').type('Tarefa 1{enter}');
      cy.get('[data-testid="total-count"]').should('have.text', '1');
      cy.get('[data-testid="pending-count"]').should('have.text', '1');
      cy.get('[data-testid="done-count"]').should('have.text', '0');
    });

    it('deve esconder o estado vazio após adicionar uma tarefa', () => {
      cy.get('[data-testid="task-input"]').type('Nova tarefa{enter}');
      cy.get('[data-testid="empty-state"]').should('not.be.visible');
    });
  });

  // ── Concluir e Desmarcar Tarefas ──
  describe('Concluir Tarefas', () => {
    beforeEach(() => {
      cy.createTask('Tarefa de teste');
      cy.reload();
    });

    it('deve marcar uma tarefa como concluída ao clicar no checkbox', () => {
      cy.get('[data-testid="task-checkbox"]').first().check();
      cy.get('[data-testid="task-item"]').first().should('have.class', 'completed');
    });

    it('deve atualizar os contadores ao concluir uma tarefa', () => {
      cy.get('[data-testid="task-checkbox"]').first().check();
      cy.get('[data-testid="done-count"]').should('have.text', '1');
      cy.get('[data-testid="pending-count"]').should('have.text', '0');
    });

    it('deve permitir desmarcar uma tarefa concluída', () => {
      cy.get('[data-testid="task-checkbox"]').first().check();
      cy.get('[data-testid="task-checkbox"]').first().uncheck();
      cy.get('[data-testid="task-item"]').first().should('not.have.class', 'completed');
    });
  });

  // ── Deletar Tarefas ──
  describe('Deletar Tarefas', () => {
    beforeEach(() => {
      cy.createTask('Tarefa para deletar');
      cy.reload();
    });

    it('deve remover uma tarefa ao clicar no botão de deletar', () => {
      cy.get('[data-testid="task-item"]').should('have.length', 1);
      cy.get('[data-testid="delete-btn"]').first().click();
      cy.get('[data-testid="task-item"]').should('have.length', 0);
    });

    it('deve exibir o estado vazio após deletar a última tarefa', () => {
      cy.get('[data-testid="delete-btn"]').first().click();
      cy.get('[data-testid="empty-state"]').should('be.visible');
    });

    it('deve atualizar os contadores após deletar uma tarefa', () => {
      cy.get('[data-testid="delete-btn"]').first().click();
      cy.get('[data-testid="total-count"]').should('have.text', '0');
    });
  });

  // ── Filtros ──
  describe('Filtros', () => {
    beforeEach(() => {
      cy.createTask('Tarefa pendente');
      cy.createTask('Tarefa concluída');
      cy.reload();
      // Conclui a segunda tarefa
      cy.get('[data-testid="task-checkbox"]').eq(1).check();
    });

    it('deve exibir todas as tarefas no filtro "Todas"', () => {
      cy.get('[data-testid="filter-all"]').click();
      cy.get('[data-testid="task-item"]').should('have.length', 2);
    });

    it('deve exibir apenas tarefas pendentes no filtro "Pendentes"', () => {
      cy.get('[data-testid="filter-pending"]').click();
      cy.get('[data-testid="task-item"]').should('have.length', 1);
      cy.get('[data-testid="task-item"]').first().should('not.have.class', 'completed');
    });

    it('deve exibir apenas tarefas concluídas no filtro "Concluídas"', () => {
      cy.get('[data-testid="filter-completed"]').click();
      cy.get('[data-testid="task-item"]').should('have.length', 1);
      cy.get('[data-testid="task-item"]').first().should('have.class', 'completed');
    });

    it('deve ativar visualmente o filtro selecionado', () => {
      cy.get('[data-testid="filter-pending"]').click();
      cy.get('[data-testid="filter-pending"]').should('have.class', 'active');
      cy.get('[data-testid="filter-all"]').should('not.have.class', 'active');
    });
  });

});
