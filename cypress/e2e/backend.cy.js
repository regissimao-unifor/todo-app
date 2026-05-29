// cypress/e2e/backend.cy.js
// Testes automatizados do BACKEND (API REST com Express)

const API = Cypress.env('apiUrl') || 'http://localhost:3001';

describe('Backend - API REST To-Do List', () => {

  beforeEach(() => {
    // Limpa todas as tarefas antes de cada teste
    cy.request('DELETE', `${API}/tasks`);
  });

  // ── GET /tasks ──
  describe('GET /tasks - Listar tarefas', () => {
    it('deve retornar status 200 e um array vazio inicialmente', () => {
      cy.request('GET', `${API}/tasks`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array').and.have.length(0);
      });
    });

    it('deve retornar todas as tarefas criadas', () => {
      cy.request('POST', `${API}/tasks`, { title: 'Tarefa A' });
      cy.request('POST', `${API}/tasks`, { title: 'Tarefa B' });
      cy.request('GET', `${API}/tasks`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.length(2);
        expect(res.body[0]).to.have.property('title', 'Tarefa A');
        expect(res.body[1]).to.have.property('title', 'Tarefa B');
      });
    });
  });

  // ── POST /tasks ──
  describe('POST /tasks - Criar tarefa', () => {
    it('deve criar uma tarefa e retornar status 201', () => {
      cy.request('POST', `${API}/tasks`, { title: 'Minha nova tarefa' }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('title', 'Minha nova tarefa');
        expect(res.body).to.have.property('completed', false);
        expect(res.body).to.have.property('createdAt');
      });
    });

    it('deve retornar erro 400 ao criar tarefa sem título', () => {
      cy.request({
        method: 'POST',
        url: `${API}/tasks`,
        body: {},
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body).to.have.property('error');
      });
    });

    it('deve retornar erro 400 ao criar tarefa com título vazio', () => {
      cy.request({
        method: 'POST',
        url: `${API}/tasks`,
        body: { title: '   ' },
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body).to.have.property('error');
      });
    });

    it('deve remover espaços extras do título', () => {
      cy.request('POST', `${API}/tasks`, { title: '  Tarefa com espaços  ' }).then((res) => {
        expect(res.body.title).to.eq('Tarefa com espaços');
      });
    });
  });

  // ── GET /tasks/:id ──
  describe('GET /tasks/:id - Buscar tarefa por ID', () => {
    it('deve retornar a tarefa com o ID correto', () => {
      cy.request('POST', `${API}/tasks`, { title: 'Buscar esta tarefa' }).then((postRes) => {
        const id = postRes.body.id;
        cy.request('GET', `${API}/tasks/${id}`).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.id).to.eq(id);
          expect(res.body.title).to.eq('Buscar esta tarefa');
        });
      });
    });

    it('deve retornar 404 para ID inexistente', () => {
      cy.request({
        method: 'GET',
        url: `${API}/tasks/99999`,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body).to.have.property('error');
      });
    });
  });

  // ── PUT /tasks/:id ──
  describe('PUT /tasks/:id - Atualizar tarefa', () => {
    it('deve atualizar o título de uma tarefa', () => {
      cy.request('POST', `${API}/tasks`, { title: 'Título original' }).then((postRes) => {
        const id = postRes.body.id;
        cy.request('PUT', `${API}/tasks/${id}`, { title: 'Título atualizado' }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.title).to.eq('Título atualizado');
        });
      });
    });

    it('deve marcar uma tarefa como concluída', () => {
      cy.request('POST', `${API}/tasks`, { title: 'Concluir esta' }).then((postRes) => {
        const id = postRes.body.id;
        cy.request('PUT', `${API}/tasks/${id}`, { completed: true }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.completed).to.eq(true);
        });
      });
    });

    it('deve retornar 404 ao atualizar ID inexistente', () => {
      cy.request({
        method: 'PUT',
        url: `${API}/tasks/99999`,
        body: { title: 'Teste' },
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });

  // ── DELETE /tasks/:id ──
  describe('DELETE /tasks/:id - Deletar tarefa', () => {
    it('deve deletar uma tarefa e retornar status 204', () => {
      cy.request('POST', `${API}/tasks`, { title: 'Deletar esta tarefa' }).then((postRes) => {
        const id = postRes.body.id;
        cy.request('DELETE', `${API}/tasks/${id}`).then((res) => {
          expect(res.status).to.eq(204);
        });
      });
    });

    it('deve remover a tarefa da lista após deletar', () => {
      cy.request('POST', `${API}/tasks`, { title: 'Tarefa para remover' }).then((postRes) => {
        const id = postRes.body.id;
        cy.request('DELETE', `${API}/tasks/${id}`);
        cy.request('GET', `${API}/tasks`).then((res) => {
          expect(res.body).to.have.length(0);
        });
      });
    });

    it('deve retornar 404 ao deletar ID inexistente', () => {
      cy.request({
        method: 'DELETE',
        url: `${API}/tasks/99999`,
        failOnStatusCode: false
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });
  });

});
