const date = document.querySelector('.date');
const time = document.querySelector('.time');
const form = document.querySelector('.form');
const todoInput = document.querySelector('.input');
const todoContainer = document.querySelector('.list-container');
const button = document.querySelector('.button');
const alert = document.querySelector('.alert');

function getDate() {
  const today = new Date();
  const date = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
  });

  const todayDate = date.format(today);
  return todayDate;
}
date.innerHTML = getDate();

function getTime() {
  const today = new Date();
  const time = new Intl.DateTimeFormat('en-us', {
    timeStyle: 'medium',
  });

  const currentTime = time.format(today);

  return currentTime;
}

setInterval(() => {
  time.innerHTML = getTime();
});

let editElement;
let editFlag = false;
let editID = '';

let todos = getLocalStorage();

form.addEventListener('submit', addTodo); // form eventListener
window.addEventListener('DOMContentLoaded', setupTodos);

function addTodo(e) {
  e.preventDefault();

  const value = todoInput.value.trim(); // todoInput value (.trim() removes trailing whitespaces)

  const id = new Date().getTime().toString(); // todo id

  let todos = getLocalStorage();

  const isExisting = todos.some(
    (todo) => todo.value.toLowerCase() === value.toLowerCase()
  ); // to check if todo already exists

  if (isExisting) {
    displayAlert('Todo already exists!');
  } else if (value && !editFlag) {
    createTodo(id, value, false);

    addToLocalStorage(id, value, false);

    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerText = value;

    editLocalStorage(editID, value);

    setBackToDefault();
  } else {
    displayAlert('Hey!!! Todo is empty');
  }

  setBackToDefault();
}

function createTodo(id, value, checked = false) {
  let element = document.createElement('li'); // creating a todo list element
  element.id = id;

  element.innerHTML = `
    <span>
      <i class="${
        checked
          ? 'fa-solid fa-check-circle check-btn'
          : 'fa-regular fa-circle check-btn'
      }"></i>
      <p class="${checked ? 'checked' : ''}">${value}</p>
    </span>
    <span>
      <i class="fa-regular fa-pen-to-square edit-btn"></i>
      <i class="fas fa-trash delete-btn"></i>
    </span>
  `;

  const checkBtn = element.querySelector('.check-btn');
  const editBtn = element.querySelector('.edit-btn');
  const deleteBtn = element.querySelector('.delete-btn');

  checkBtn.addEventListener('click', checkTodo);
  editBtn.addEventListener('click', editTodo);
  deleteBtn.addEventListener('click', deleteTodo);

  todoContainer.appendChild(element);
}

function checkTodo(e) {
  const element = e.currentTarget; // targeting the edit icon

  const valueEl = element.nextElementSibling; // targeting paragraph element

  const todoEl = element.parentElement.parentElement; // targeting list element

  let todoId = todoEl.id;

  todos.map((todo) => {
    todo.id === todoId
      ? (todo.checked = !todo.checked)
      : (todo.checked = todo.checked);
  });
  localStorage.setItem('todos', JSON.stringify(todos));
  todos.map((todo) => {
    if (todo.id === todoId) {
      valueEl.classList.toggle('checked');

      if (todo.checked) {
        element.classList.remove('fa-regular');
        element.classList.remove('fa-circle');
        element.classList.add('fa-solid');
        element.classList.add('fa-check-circle');
      } else {
        element.classList.add('fa-regular');
        element.classList.add('fa-circle');
        element.classList.remove('fa-solid');
        element.classList.remove('fa-check-circle');
      }
    }
  });
}

function editTodo(e) {
  const element = e.currentTarget; // targeting the edit icon

  const todoEl = element.parentElement.parentElement; // targeting list element

  editElement = element.parentElement.previousElementSibling.lastElementChild; // assigning editElement variable to the paragraph element

  todoInput.value = editElement.innerText; // displaying & assigning the todo value as the new todoInput value

  editID = todoEl.id; // retaining the todo id as the edit ID

  editFlag = true;
  button.innerHTML = `<i class="fas fa-pen"></i>`;
}

function deleteTodo(e) {
  const element = e.currentTarget; // target the edit icon
  const todoEl = element.parentElement.parentElement; // target the todo list element
  const id = todoEl.id; // get the todo.id

  todoContainer.removeChild(todoEl); // delete the todo from the todo container

  setBackToDefault();
  removeFromLocalStorage(id); // delete the todo from local storage
}

function setBackToDefault() {
  todoInput.value = ''; // empty the input field after adding todo
  editFlag = false;
  editID = '';
  button.innerHTML = `<i class="fas fa-plus"></i>`;
}

function getLocalStorage() {
  const storedTodos = localStorage.getItem('todos'); // get local storage

  return storedTodos ? JSON.parse(storedTodos) : []; // if there are todos stored in the local storage return them else return an empty array
}

function addToLocalStorage(id, value, checked = false) {
  todos.push({
    id: id,
    value: value,
    checked: checked,
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

function removeFromLocalStorage(id) {
  todos = todos.filter((todo) => todo.id !== id);

  localStorage.setItem('todos', JSON.stringify(todos));
}

function editLocalStorage(id, value) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      todo.value = value;
    }
    return todo;
  });

  localStorage.setItem('todos', JSON.stringify(todos));
}

function setupTodos() {
  if (todos.length > 0) {
    todos.forEach((todo) => {
      createTodo(todo.id, todo.value, todo.checked);
    });
  }
}

function displayAlert(text) {
  alert.textContent = text;
  // display notification alert
  alert.classList.remove('alert-display');

  // remove notification alert
  setTimeout(() => {
    alert.textContent = '';
    alert.classList.add('alert-display');
  }, 1000);
}
