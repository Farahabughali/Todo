let todos = [
  { id: 1, text: "Welcome to Todo manager Task", completed: false },
  { id: 2, text: "In this Task you are going to build your own custom logic to create todo manager", completed: false },
  { id: 3, text: "Task objectives is:", completed: false },
  { id: 4, text: "a. DOM manipulation", completed: false },
  { id: 5, text: "b. Event Handling", completed: false },
  { id: 6, text: "c. Data storing (Sessions or cookies)", completed: false }
];

let currentFilter = 'all';

function loadTodos() {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
      todos = JSON.parse(savedTodos);
  }
  renderTodos();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function validateAndAddTodo() {
  const input = document.getElementById('todoInput');
  const errorMessage = document.getElementById('errorMessage');
  const text = input.value.trim();

  if (text === '') {
      errorMessage.textContent = "Task cannot be empty";
      errorMessage.style.display = 'block';
      return;
  } else if (!isNaN(text.charAt(0))) {
      errorMessage.textContent = "Task cannot start with a number";
      errorMessage.style.display = 'block';
      return;
  } else if (text.length < 5) {
      errorMessage.textContent = "Task must be at least 5 characters";
      errorMessage.style.display = 'block';
      return;
  }

  errorMessage.style.display = 'none';
  todos.push({
      id: Date.now(),
      text: text,
      completed: false
  });
  input.value = '';
  saveTodos();
  renderTodos();
}

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  
  if (text) {
      todos.push({
          id: Date.now(),
          text: text,
          completed: false
      });
      input.value = '';
      saveTodos();
      renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map(todo => {
      if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
      }
      return todo;
  });
  saveTodos();
  renderTodos();
}

function editTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
      const newText = prompt('Edit todo:', todo.text);
      if (newText !== null && newText.trim() !== '') {
          todos = todos.map(t => {
              if (t.id === id) {
                  return { ...t, text: newText.trim() };
              }
              return t;
          });
          saveTodos();
          renderTodos();
      }
  }
}

function filterTodos(filter) {
  currentFilter = filter;
  renderTodos();
}

function deleteDoneTasks() {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
}
function deleteAllTasks() {
  const confirmation = confirm("Are you sure you want to delete all tasks?");
  if (confirmation) {
     
      localStorage.removeItem('todos'); 
      renderTodos(); 
      alert("All tasks have been deleted.");
  } else {
      alert("Deletion canceled.");
  }
}


function renderTodos() {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';

  let filteredTodos = todos;
  if (currentFilter === 'done') {
      filteredTodos = todos.filter(todo => todo.completed);
  } else if (currentFilter === 'todo') {
      filteredTodos = todos.filter(todo => !todo.completed);
  }

  filteredTodos.forEach(todo => {
      const todoItem = document.createElement('div');
      todoItem.className = 'todo-item';
      todoItem.innerHTML = `
          <input type="checkbox" class="todo-checkbox" 
                 ${todo.completed ? 'checked' : ''} 
                 onchange="toggleTodo(${todo.id})">
          <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
          <div class="action-buttons">
              <button class="edit-btn" onclick="editTodo(${todo.id})">✎</button>
              <button class="delete-btn" onclick="deleteTodo(${todo.id})">🗑</button>
          </div>
      `;
      todoList.appendChild(todoItem);
  });
}

let currentEditId = null;

// فتح النافذة المنبثقة
function openModal(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        currentEditId = id;
        document.getElementById('editInput').value = todo.text;
        document.getElementById('editModal').style.display = 'flex';
    }
}

// إغلاق النافذة المنبثقة
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// حفظ التعديلات
function saveEdit() {
    const newText = document.getElementById('editInput').value.trim();
    if (newText !== '' && currentEditId !== null) {
        todos = todos.map(todo => {
            if (todo.id === currentEditId) {
                return { ...todo, text: newText };
            }
            return todo;
        });
        saveTodos();
        renderTodos();
        closeModal();
    }
}

document.getElementById('todoInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
      addTodo();
  }
});
// فتح نافذة التعديل
function editTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
      document.getElementById('editInput').value = todo.text; // تعبئة النص الحالي
      editId = id; // تخزين الـ id
      document.getElementById('editModal').style.display = 'flex'; // إظهار النافذة
  }
}

// حفظ التعديلات
function saveEdit() {
  const newText = document.getElementById('editInput').value.trim();
  if (newText && editId !== null) {
      todos = todos.map(todo => {
          if (todo.id === editId) {
              return { ...todo, text: newText }; // تحديث النص
          }
          return todo;
      });
      saveTodos();
      renderTodos();
      closeModal(); // إغلاق النافذة
  }
}

// إغلاق النافذة
function closeModal() {
  document.getElementById('editModal').style.display = 'none';
  editId = null; // إعادة تعيين المتغير
}


loadTodos();
