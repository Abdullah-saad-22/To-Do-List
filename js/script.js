const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const tasksContainer = document.querySelector("#tasks");
const countValue = document.querySelector(".count-value");
const error = document.querySelector("#error");

let taskCount = 0;
let isEditing = false;
let currentTaskElement = null;
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const displayCount = (taskCount) => {
    countValue.innerText = taskCount;
};

const renderTask = (taskName, isCompleted = false) => {
    const task = document.createElement("div");
    task.classList.add("task");

    const taskCheck = document.createElement("input");
    taskCheck.type = "checkbox";
    taskCheck.classList.add("task-check");
    taskCheck.checked = isCompleted;

    const taskNameSpan = document.createElement("span");
    taskNameSpan.classList.add("taskname");
    taskNameSpan.innerText = taskName;
    if (isCompleted) {
        taskNameSpan.classList.add("completed");
    }

    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    task.appendChild(taskCheck);
    task.appendChild(taskNameSpan);
    task.appendChild(editButton);
    task.appendChild(deleteButton);

    tasksContainer.appendChild(task);

    deleteButton.onclick = () => {
        task.remove();
        if (!taskCheck.checked) {
            taskCount -= 1;
        }
        tasks = tasks.filter(t => t.name !== taskName);
        updateLocalStorage();
        displayCount(taskCount);
    };

    editButton.onclick = () => {
        newTaskInput.value = taskNameSpan.innerText;
        isEditing = true;
        currentTaskElement = task;
    };

    taskCheck.onchange = () => {
        taskNameSpan.classList.toggle("completed");
        const taskData = tasks.find(t => t.name === taskName);
        taskData.completed = taskCheck.checked;
        
        if (taskCheck.checked) {
            taskCount -= 1;
        } else {
            taskCount += 1;
        }

        updateLocalStorage();
        displayCount(taskCount);
    };

    if (!isCompleted) {
        taskCount += 1;
    }
    displayCount(taskCount);
};

const addTask = () => {
    const taskName = newTaskInput.value.trim();
    if (!taskName) {
        error.style.display = "block";
        setTimeout(() => {
            error.style.display = "none";
        }, 2000);
        return;
    }

    if (isEditing && currentTaskElement) {
        const taskNameSpan = currentTaskElement.querySelector(".taskname");
        taskNameSpan.innerText = taskName;
        tasks = tasks.map(t => t.name === taskNameSpan.innerText ? { name: taskName, completed: false } : t);
        updateLocalStorage();
        isEditing = false;
        currentTaskElement = null;
        newTaskInput.value = "";
        return;
    }

    renderTask(taskName);
    tasks.push({ name: taskName, completed: false });
    updateLocalStorage();

    newTaskInput.value = "";
};

const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const loadTasks = () => {
    tasks.forEach(task => renderTask(task.name, task.completed));
};

addBtn.addEventListener("click", addTask);

window.onload = () => {
    taskCount = 0;
    displayCount(taskCount);
    newTaskInput.value = "";
    loadTasks();
};
