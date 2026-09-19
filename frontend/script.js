// Change this URL after you deploy your Django backend.
const API_URL = "http://127.0.0.1:8000/api/tasks/";

const form = document.getElementById("taskForm");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const statusInput = document.getElementById("status");
const taskIdInput = document.getElementById("taskId");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const message = document.getElementById("message");
const formTitle = document.getElementById("formTitle");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Backend not available");
    const tasks = await response.json();
    taskCount.textContent = tasks.length;
    renderTasks(tasks);
  } catch (error) {
    taskList.innerHTML = `<div class="empty">Start the Django backend to load tasks.</div>`;
  }
}

function renderTasks(tasks) {
  if (!tasks.length) {
    taskList.innerHTML = '<div class="empty">No tasks yet. Add your first task!</div>';
    return;
  }

  taskList.innerHTML = tasks.map(task => `
    <article class="task">
      <div class="task-top">
        <div>
          <h3>${escapeHtml(task.name)}</h3>
          <p>${escapeHtml(task.description || "No description")}</p>
        </div>
        <span class="badge">${escapeHtml(task.status)}</span>
      </div>
      <small>Created: ${new Date(task.created_date).toLocaleString()}</small>
      <div class="task-actions">
        <button onclick="editTask(${task.id})">Edit</button>
        <button class="secondary" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    </article>
  `).join("");
}

async function saveTask(event) {
  event.preventDefault();

  const id = taskIdInput.value;
  const data = {
    name: nameInput.value.trim(),
    description: descriptionInput.value.trim(),
    status: statusInput.value
  };

  const url = id ? `${API_URL}${id}/` : API_URL;
  const method = id ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    alert(error.error || "Something went wrong");
    return;
  }

  showMessage(id ? "Task updated successfully!" : "Task added successfully!");
  resetForm();
  loadTasks();
}

async function editTask(id) {
  const response = await fetch(`${API_URL}${id}/`);
  const task = await response.json();

  taskIdInput.value = task.id;
  nameInput.value = task.name;
  descriptionInput.value = task.description;
  statusInput.value = task.status;

  formTitle.textContent = "Update Task";
  saveBtn.textContent = "Update Task";
  cancelBtn.classList.remove("hidden");
  window.scrollTo({top: 0, behavior: "smooth"});
}

async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;

  const response = await fetch(`${API_URL}${id}/`, {method: "DELETE"});
  if (response.ok) {
    showMessage("Task deleted successfully!");
    loadTasks();
  }
}

function resetForm() {
  form.reset();
  taskIdInput.value = "";
  formTitle.textContent = "Add New Task";
  saveBtn.textContent = "Add Task";
  cancelBtn.classList.add("hidden");
}

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => message.textContent = "", 2500);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#039;"
  }[char]));
}

form.addEventListener("submit", saveTask);
cancelBtn.addEventListener("click", resetForm);
document.getElementById("refreshBtn").addEventListener("click", loadTasks);

loadTasks();
