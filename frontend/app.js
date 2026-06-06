const API_URL = 'http://localhost:3001'; 

let allTasks = [];
let currentFilter = 'all';

// ── DOM Elements ──
const taskInput   = document.getElementById('taskInput');
const addBtn      = document.getElementById('addBtn');
const taskList    = document.getElementById('taskList');
const errorMsg    = document.getElementById('errorMsg');
const emptyState  = document.getElementById('emptyState');
const loadingState= document.getElementById('loadingState');
const totalCount  = document.getElementById('totalCount');
const doneCount   = document.getElementById('doneCount');
const pendingCount= document.getElementById('pendingCount');
const filterBtns  = document.querySelectorAll('.filter-btn');

// ── API ──
async function fetchTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error('Erro ao buscar tarefas');
  return res.json();
}

async function createTask(title) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erro ao criar tarefa');
  }
  return res.json();
}

async function updateTask(id, updates) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Erro ao atualizar tarefa');
  return res.json();
}

async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao deletar tarefa');
}

// ── Render ──
function getFilteredTasks() {
  if (currentFilter === 'completed') return allTasks.filter(t => t.completed);
  if (currentFilter === 'pending')   return allTasks.filter(t => !t.completed);
  return allTasks;
}

function updateStats() {
  const total   = allTasks.length;
  const done    = allTasks.filter(t => t.completed).length;
  const pending = total - done;
  totalCount.textContent   = total;
  doneCount.textContent    = done;
  pendingCount.textContent = pending;
}

function renderTasks() {
  const tasks = getFilteredTasks();
  taskList.innerHTML = '';
  updateStats();

  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item${task.completed ? ' completed' : ''}`;
      li.dataset.testid = 'task-item';
      li.dataset.id = task.id;
      li.innerHTML = `
        <input
          type="checkbox"
          class="task-checkbox"
          ${task.completed ? 'checked' : ''}
          data-testid="task-checkbox"
          aria-label="Marcar como concluída"
        />
        <span class="task-title" data-testid="task-title">${escapeHtml(task.title)}</span>
        <button class="delete-btn" data-testid="delete-btn" aria-label="Deletar tarefa">✕</button>
      `;

      // Toggle completed
      li.querySelector('.task-checkbox').addEventListener('change', async (e) => {
        try {
          const updated = await updateTask(task.id, { completed: e.target.checked });
          const idx = allTasks.findIndex(t => t.id === task.id);
          if (idx !== -1) allTasks[idx] = updated;
          renderTasks();
        } catch {
          showError('Erro ao atualizar tarefa.');
        }
      });

      // Delete
      li.querySelector('.delete-btn').addEventListener('click', async () => {
        try {
          await deleteTask(task.id);
          allTasks = allTasks.filter(t => t.id !== task.id);
          renderTasks();
        } catch {
          showError('Erro ao deletar tarefa.');
        }
      });

      taskList.appendChild(li);
    });
  }
}

// ── Add Task ──
async function handleAddTask() {
  const title = taskInput.value.trim();
  if (!title) {
    showError('Por favor, escreva o título da tarefa.');
    taskInput.focus();
    return;
  }
  clearError();
  addBtn.disabled = true;
  try {
    const task = await createTask(title);
    allTasks.push(task);
    taskInput.value = '';
    renderTasks();
  } catch (err) {
    showError(err.message);
  } finally {
    addBtn.disabled = false;
  }
}

// ── Filters ──
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ── Helpers ──
function showError(msg) { errorMsg.textContent = msg; }
function clearError()   { errorMsg.textContent = ''; }
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Events ──
addBtn.addEventListener('click', handleAddTask);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleAddTask(); });

// ── Init ──
(async () => {
  try {
    allTasks = await fetchTasks();
  } catch {
    allTasks = [];
  } finally {
    loadingState.classList.add('hidden');
    renderTasks();
  }
})();
