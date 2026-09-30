// ---------- Select elements ----------
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const message = document.querySelector('#message');
const counter = document.querySelector('#counter');
const list = document.querySelector('#task-list');

// ---------- Storage ----------
function save() {
  const json = JSON.stringify(tasks);
  localStorage.setItem('tasks', json);
}

function load() {
  const raw = localStorage.getItem('tasks');
  try {
    return JSON.parse(raw) || [];
  } catch (err) {
    console.warn('Bad saved data, starting fresh', err);
    return [];
  }
}

// ---------- The data (the array is the truth) ----------
let tasks = load();

// ---------- Changing the data ----------
function addTask(title) {
  tasks = [...tasks, { id: Date.now(), title: title, done: false }];
  save();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  renderTasks();
}

// ---------- Drawing the page ----------
function taskToListItem(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;
  if (task.done) {
    li.classList.add('done');
  }

  // checkbox: checked when the task is done (the state comes from the array)
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.classList.add('check');
  if (task.done) {
    checkbox.setAttribute('checked', '');
  }

  const text = document.createElement('span');
  text.textContent = task.title;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete');

  li.append(checkbox);
  li.append(text);
  li.append(deleteButton);
  return li;
}

function renderTasks() {
  list.innerHTML = '';
  tasks
    .map(taskToListItem)
    .forEach(li => list.append(li));

  const doneCount = tasks.reduce(
    (count, t) => t.done ? count + 1 : count,
    0
  );

  if (tasks.length === 0) {
    counter.textContent = 'No tasks yet. Add your first one above!';
  } else {
    counter.textContent = `${doneCount} of ${tasks.length} done`;
  }
}

// ---------- Events ----------
function handleSubmit(e) {
  e.preventDefault();

  const title = input.value.trim();
  if (!title) {
    message.textContent = 'Please type a task before adding.';
    return;
  }

  message.textContent = '';
  addTask(title);
  input.value = '';
}

function handleListClick(e) {
  const li = e.target.closest('li');
  if (!li) {
    return; // clicked the gap
  }

  const id = Number(li.dataset.id);

  if (e.target.closest('.delete')) {
    deleteTask(id);
    return;
  }
  toggleTask(id);
}

function handleInput() {
  message.textContent = '';
}

form.addEventListener('submit', handleSubmit);
list.addEventListener('click', handleListClick);
input.addEventListener('input', handleInput);

// ---------- Start ----------
renderTasks();
