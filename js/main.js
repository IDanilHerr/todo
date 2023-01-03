// находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

chekEmptyList();

// Adding a task
form.addEventListener('submit', addTask);

//  Deleting a task
tasksList.addEventListener('click', deleteTask);

// Mark the task as completed
tasksList.addEventListener('click', doneTask);


function addTask(event) {
    //  Cancel form submission
    event.preventDefault();

    // Get the text of the task from the input field
    const taskText = taskInput.value;

    // Describe the task as an object
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    // Add a task to the array with tasks
    tasks.push(newTask)

    // Save the list of tasks in the localStorage
    saveToLocalStorage();

    // Render the task on the page
    renderTask(newTask);

    // Clear the input field and return focus to it
    taskInput.value = ""
    taskInput.focus()

    chekEmptyList();
}

function deleteTask(event) {
    // Chek if the click was not on the button 'delete task'
    if (event.target.dataset.action !== 'delete') return;

    // Chek if the click was on the button 'delete task'
    const parentNode = event.target.closest('.list-group-item');

    confirm('Do you really want to delete?');

    // Define task ID
    const id = Number(parentNode.id);

    // Delete the task through array filtering
    tasks = tasks.filter((task) => task.id !== id);

    // Save the list of tasks in the localStorage
    saveToLocalStorage();

    // Remove task from markup
    parentNode.remove();

    chekEmptyList();
}

function doneTask(event) {
    // Check that the click was not on the button 'task completed'
    if (event.target.dataset.action !== 'done') return;

    // Check that the click was on the button 'task completed'
    const parentNode = event.target.closest('.list-group-item');

    // Define task ID
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id)
    task.done = !task.done

    // Save the list of tasks in the localStorage
    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function chekEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                    <div class="empty-list__title">List of empty</div>
                </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListElement = document.querySelector('#emptyList');
        emptyListElement ? emptyListElement.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    // Form css class
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    // Generate markup for new task
    const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                </li>`;

    // Add task to page
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
