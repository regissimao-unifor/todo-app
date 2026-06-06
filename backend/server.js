const express = require('express');
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Banco de dados em memória
let tasks = [];
let nextId = 1;

// GET /tasks - listar todas as tarefas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id - buscar tarefa por id
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  res.json(task);
});

// POST /tasks - criar nova tarefa
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'O título é obrigatório' });
  }
  const task = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  res.status(201).json(task);
});

// PUT /tasks/:id - atualizar tarefa
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  const { title, completed } = req.body;
  if (title !== undefined) tasks[taskIndex].title = title.trim();
  if (completed !== undefined) tasks[taskIndex].completed = completed;
  res.json(tasks[taskIndex]);
});

// DELETE /tasks/:id - remover tarefa
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// DELETE /tasks - remover todas as tarefas (útil para testes)
app.delete('/tasks', (req, res) => {
  tasks = [];
  nextId = 1;
  res.status(204).send();
});

// Iniciar servidor apenas se não estiver em modo de teste
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
