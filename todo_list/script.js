let tasks = [];
let editingTaskId = null;

// Add Task
function addTask() {
  const name = document.getElementById("taskInput").value.trim();
  const category = document.getElementById("categorySelect").value;
  const priority = document.getElementById("prioritySelect").value;
  const dueDate = document.getElementById("dueDate").value;

  if (!name) {
    alert("Please enter a task name.");
    return;
  }

  if (editingTaskId !== null) {
    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
      task.name = name;
      task.category = category;
      task.priority = priority;
      task.dueDate = dueDate;
    }
    editingTaskId = null;
  } else {
    tasks.push({
      id: Date.now(),
      name,
      category,
      priority,
      dueDate,
      completed: false
    });
  }

  document.getElementById("taskInput").value = "";
  document.getElementById("dueDate").value = "";

  renderTasks();
  updateProgress();
}

// Render Tasks
function renderTasks(taskArray = tasks) {
  const container = document.getElementById("emptyMessage");

  if (!taskArray.length) {
    container.innerHTML = `
      <section class="card p-4 text-center text-muted mt-4">
        <p><center>🧘‍♀</center></p>
        <p class="mt-2 mb-0">
          Your mind is clear<br />
          <small>No tasks match your current filters. Time to add some goals!</small>
        </p>
      </section>`;
    return;
  }

  container.innerHTML = taskArray.map(t => `
    <div class="card p-3 mb-3 ${t.completed ? 'bg-success-subtle text-decoration-line-through' : ''}">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <strong>${t.name}</strong><br>
          <small>${t.category} • ${t.priority} • ${t.dueDate}</small>
        </div>
        <div>
          <button class="btn btn-sm btn-success me-1" onclick="toggleComplete(${t.id})">${t.completed ? "Undo" : "✓"}</button>
          <button class="btn btn-sm btn-warning me-1" onclick="editTask(${t.id})">✏</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTask(${t.id})">🗑</button>
        </div>
      </div>
    </div>
  `).join("");
}

// Edit Task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    document.getElementById("taskInput").value = task.name;
    document.getElementById("categorySelect").value = task.category;
    document.getElementById("prioritySelect").value = task.priority;
    document.getElementById("dueDate").value = task.dueDate;
    editingTaskId = id;
  }
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
  updateProgress();
}

// Toggle Complete
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks(); updateProgress();
    if (task.completed) {
      const b = document.createElement("div");
      b.className = "burst"; document.body.appendChild(b);
      setTimeout(() => b.remove(), 800);
    }
  }
}

// Filters
function applyFilters() {
  const cat = document.getElementById("filterCategory").value;
  const pri = document.getElementById("filterPriority").value;

  const filtered = tasks.filter(t =>
    (cat === "All" || t.category === cat) &&
    (pri === "All" || t.priority === pri)
  );

  renderTasks(filtered);
}

// Progress + Header Count
function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const xp = completed * 10;

  document.getElementById("xpProgress").style.width = `${percent}%`;
  document.getElementById("xpProgress").textContent = `${xp} XP`;

  document.getElementById("headerTotalTasks").textContent = total;
  document.getElementById("headerTodayTasks").textContent = completed;
  document.getElementById("progressTotalTasks").textContent = total;
  document.getElementById("progressTodayTasks").textContent = completed;
}

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");

});
// View Switch
function showTaskList() {
  document.getElementById("taskSection").style.display = "block";
  document.getElementById("calendarSection").style.display = "none";
}

function showCalendar() {
  document.getElementById("taskSection").style.display = "none";
  document.getElementById("calendarSection").style.display = "block";
}

function showDateTasks() {
  const d = calendarDate.value;
  if (!d) return calendarTasks.innerHTML = "<p>Select a date</p>";

  const filtered = tasks.filter(t => t.dueDate === d);
  if (!filtered.length) {
    calendarTasks.innerHTML = "<p>No tasks for this date</p>";
    return;
  }

  calendarTasks.innerHTML = filtered.map(t => `
    <div class="card p-2 mb-2 ${t.completed ? 'text-decoration-line-through bg-success-subtle' : ''}">
      <strong>${t.name}</strong><br>
      <small>${t.category} • ${t.priority}</small>
    </div>
  `).join("");
}

// Nav Active Button
function setActive(button) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}
