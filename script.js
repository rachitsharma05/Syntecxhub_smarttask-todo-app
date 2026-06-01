const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

const taskCounter = document.getElementById("taskCounter");

const themeToggle = document.getElementById("themeToggle");

const filterButtons =
    document.querySelectorAll(".filter-btn");

/* =========================
   APP STATE
========================= */

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

let currentFilter = "all";

/* =========================
   THEME LOGIC
========================= */

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.add(
        "light-theme"
    );

    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-theme"
        );

        const isLight =
            document.body.classList.contains(
                "light-theme"
            );

        themeToggle.textContent =
            isLight
                ? "☀️"
                : "🌙";

        localStorage.setItem(
            "theme",
            isLight
                ? "light"
                : "dark"
        );
    }
);

/* =========================
   SAVE TASKS
========================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* =========================
   ADD TASK
========================= */

function addTask() {

    const text =
        taskInput.value.trim();

    const dueDate =
        dueDateInput.value;

    if (!text) {
        alert(
            "Please enter a task."
        );
        return;
    }

    tasks.push({

        id: Date.now(),

        text: text,

        dueDate: dueDate,

        completed: false

    });

    taskInput.value = "";
    dueDateInput.value = "";

    saveTasks();

    renderTasks();
}

addBtn.addEventListener(
    "click",
    addTask
);

taskInput.addEventListener(
    "keypress",
    (e) => {

        if (e.key === "Enter") {
            addTask();
        }

    }
);

/* =========================
   TOGGLE TASK
========================= */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed =
                !task.completed;
        }

        return task;
    });

    saveTasks();

    renderTasks();
}

/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    tasks = tasks.filter(

        task => task.id !== id

    );

    saveTasks();

    renderTasks();
}

/* =========================
   FILTERS
========================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn =>
                btn.classList.remove(
                    "active"
                )
            );

            button.classList.add(
                "active"
            );

            currentFilter =
                button.dataset.filter;

            renderTasks();
        }
    );

});

/* =========================
   UPDATE STATS
========================= */

function updateStats() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    const active =
        total - completed;

    totalTasks.textContent =
        total;

    activeTasks.textContent =
        active;

    completedTasks.textContent =
        completed;

    taskCounter.textContent =
        `${active} task${active !== 1 ? "s" : ""} remaining`;

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );

    progressFill.style.width =
        `${percentage}%`;

    progressPercent.textContent =
        `${percentage}%`;
}

/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks =
        [...tasks];

    if (
        currentFilter === "active"
    ) {

        filteredTasks =
            tasks.filter(
                task => !task.completed
            );

    } else if (
        currentFilter === "completed"
    ) {

        filteredTasks =
            tasks.filter(
                task => task.completed
            );
    }

    if (
        filteredTasks.length === 0
    ) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";
    }

    filteredTasks.forEach(task => {

        const li =
            document.createElement("li");

        li.className =
            task.completed
                ? "task completed"
                : "task";

        li.innerHTML = `

            <div class="task-left">

                <div class="task-title">

                    ${task.text}

                </div>

                <div class="task-date">

                    ${
                        task.dueDate
                        ? "📅 Due: " + task.dueDate
                        : "No due date"
                    }

                </div>

            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">

                    ✓

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">

                    🗑

                </button>

            </div>

        `;

        taskList.appendChild(li);
    });

    updateStats();
}

/* =========================
   INITIAL LOAD
========================= */

renderTasks();

/* =========================
   GLOBAL FUNCTIONS
========================= */

window.toggleTask =
    toggleTask;

window.deleteTask =
    deleteTask;