# ✅ To-Do List — Trabalho Final Ambiente de Desenvolvimento de Software

Aplicação web completa de gerenciamento de tarefas desenvolvida para a disciplina **Ambientes de Desenvolvimento de Softwares** da **UNIFOR**.

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Backend | Node.js + Express.js |
| Testes | Cypress (E2E + API) |
| CI/CD | GitHub Actions |

---

## 📁 Estrutura do Projeto

```
todo-app/
├── .github/
│   └── workflows/
│       ├── test-frontend.yml   # Workflow: testes do frontend
│       └── test-backend.yml    # Workflow: testes do backend
├── backend/
│   ├── server.js               # Servidor Express (API REST)
│   └── package.json
├── frontend/
│   ├── index.html              # Interface principal
│   ├── style.css               # Estilos
│   └── app.js                  # Lógica do frontend
├── cypress/
│   ├── e2e/
│   │   ├── frontend.cy.js      # Testes do frontend
│   │   └── backend.cy.js       # Testes do backend (API)
│   ├── fixtures/
│   │   └── example.json
│   └── support/
│       └── e2e.js              # Comandos customizados
├── cypress.config.js
└── package.json
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/)

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/todo-app.git
cd todo-app
```

### 2. Instalar dependências
```bash
# Dependências raiz (Cypress)
npm install

# Dependências do backend
cd backend && npm install && cd ..
```

### 3. Iniciar o Backend
```bash
# Em um terminal
cd backend
node server.js
# Servidor rodando em http://localhost:3001
```

### 4. Iniciar o Frontend
```bash
# Em outro terminal, na raiz do projeto
npx serve frontend -p 5500
# Frontend disponível em http://localhost:5500
```

---

## 🧪 Executar os Testes

Com o backend **e** o frontend rodando:

```bash
# Testes do frontend
npm run test:frontend

# Testes do backend
npm run test:backend

# Todos os testes
npm run test:all

# Interface visual do Cypress
npm run cypress:open
```

---

## 🔌 API REST — Endpoints

Base URL: `http://localhost:3001`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/tasks` | Listar todas as tarefas |
| GET | `/tasks/:id` | Buscar tarefa por ID |
| POST | `/tasks` | Criar nova tarefa |
| PUT | `/tasks/:id` | Atualizar tarefa |
| DELETE | `/tasks/:id` | Deletar uma tarefa |
| DELETE | `/tasks` | Deletar todas as tarefas |

### Exemplo de corpo para POST/PUT
```json
{
  "title": "Minha tarefa",
  "completed": false
}
```

---

## ⚙️ GitHub Actions (CI/CD)

Dois workflows são executados automaticamente a cada `push`:

- **`test-frontend.yml`** — Sobe o backend e o frontend, executa os testes Cypress do frontend
- **`test-backend.yml`** — Sobe o backend e executa os testes Cypress de API

---

## 👤 Autor

Desenvolvido como trabalho final da disciplina Ambientes de Desenvolvimento de Softwares — UNIFOR, Fortaleza-CE.
