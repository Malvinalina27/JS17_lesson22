'use strict';

class ToDo {
  constructor(form, input, todoList, todoCompleted, todoContainer) { //создаем свойства
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoContainer = document.querySelector(todoContainer);
    this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList'))); //создали коллекцию
  }

  // добавляет дела в localStorage
  addToStorage() {
    localStorage.setItem('toDoList', JSON.stringify([...this.todoData])); //берёт todoData и отправляет в locSt
  }



  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.input.value = '';
    this.todoData.forEach(this.createItem, this); // перебирает все дела, записанные в todoData
    this.addToStorage(); // вызов addToStorage
  }


  // создаем элемент
  createItem(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML('beforeend', `
      <span class="text-todo">${todo.value}</span>
      <div class="todo-buttons">
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `);

    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }


  // получаем данные из инпута и перемещаем в todoData
  addTodo(e) {
    e.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo); //newTodo со значением key
      this.render();
    } else {
      alert('Пустое дело добавить нельзя');
    }
  }

  //генерирую ключ
  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  deleteItem(key) {
    const _this = this;

    this.todoData.forEach(item => {
      if (key === item.key) {
        _this.todoData.delete(item.key);
      }
    });

    this.render();
  }

  completedItem(key) { // метод

    this.todoData.forEach(item => {
      if (key === item.key) {
        item.completed = !item.completed;
      }
    });

    this.render();
  }

  handler() {
    this.todoContainer.addEventListener('click', event => {
      const target = event.target;
      const key = target.parentNode.parentNode.key;
      console.log(target);
      if (target.classList.contains('todo-remove')) {
        this.deleteItem(key);
      } else if (target.classList.contains('todo-complete')) {
        this.completedItem(key);
      }
      console.log(key);
    });


  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this)); //добавляю новое дело
    this.render();
    this.handler();
  }
}

const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');
todo.init();
