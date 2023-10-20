const changeStorageBtn = document.querySelector('.change-storage__btn');

function changeStorage() {
  if (localStorage.getItem('storageStatus') === null) {
    changeStorageBtn.textContent = 'Сервер';
    localStorage.setItem('storageStatus', 'server');
    location.reload();
  }
  else if (localStorage.getItem('storageStatus') === 'server') {
    changeStorageBtn.textContent = 'Локальное хранилище';
    localStorage.removeItem('storageStatus');
    location.reload();
  }
}

changeStorageBtn.addEventListener('click', changeStorage);

// создаем и возвращаем заголовок приложения
function createAppTitle(title) {
  let appTitle = document.createElement('h2');
  appTitle.innerHTML = title;
  return appTitle;
}
// создаем и возвращаем форму для создания дела
function createTodoItemForm() {
  let form = document.createElement('form');
  let input = document.createElement('input');
  let buttonWraper = document.createElement('div');
  let button = document.createElement('button');

  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = 'Введите название нового дела';
  buttonWraper.classList.add('input-group-append');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Добавить дело';

  // Блокируем кнопку
  button.disabled = true;

  buttonWraper.append(button);
  form.append(input);
  form.append(buttonWraper);

  return {
      form,
      input,
      button,
  };
}

// создаем и возвращаем список элементов
function createTodoList() {
  let list =  document.createElement('ul');
  list.classList.add('list-group');
  return list;
}

let listArray = [],
    listName = '';

import { saveList, getNewId } from './local.js';

function createTodoItem(obj, handlers) {
  let item = document.createElement('li');

  let buttonGroup = document.createElement('div');
  let doneButton = document.createElement('button');
  let deleteButton = document.createElement('button');

  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  item.textContent = obj.name;

  // Если у элемента дела done: true, то оно сразу отмечено выполненным
  if (obj.done) {
      item.classList.add('list-group-item-success');
  };

  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success');
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Удалить';

  // навешиваем на клик событие для кнопок
  doneButton.addEventListener('click', function () {
    item.classList.toggle('list-group-item-success');

    if (localStorage.getItem('storageStatus') === null) {
      for (let listItem of listArray) {
        if (listItem.id == obj.id) listItem.done = !listItem.done;
      }

      saveList(listArray, listName);
    } else handlers.onDone(obj);

  });

  deleteButton.addEventListener('click', function () {
    if (localStorage.getItem('storageStatus') === null) {
      if (confirm('Вы уверены?')) {
        item.remove();

        for (let i = 0; i < listArray.length; i++) {
          // Ищем объект по индеку
          // Если id этого объекта в массиве равен id объекта
          if (listArray[i].id == obj.id) {
              // удаляем из массива объект i в количестве 1
              listArray.splice(i, 1);
          };
        };
      };
      saveList(listArray, listName);
    } else handlers.onDelete(obj, item);

  });

  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  return item;
}

async function createTodoApp(container, {title, owner, todoItemList = [], onCreateFormSubmit, onDoneClick, onDeleteClick}) {
  // Вызываем функции
  let todoAppTitle = createAppTitle(title);
  let todoItemForm = createTodoItemForm();
  let todoList = createTodoList();
  const handlers = { onDone: onDoneClick, onDelete: onDeleteClick };

  // Добавляем элементы в контейнер
  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  listArray = todoItemList;
  listName = owner;

  if (localStorage.getItem('storageStatus') === null) {
    let localData = localStorage.getItem(listName);
    if (localData !== null && localData !== '') {
        listArray = JSON.parse(localData);
    };

    for (const itemList of listArray) {
        let todoItem = createTodoItem(itemList);
        todoList.append(todoItem);
    }
  } else {
    todoItemList.forEach(todoItem => {
      const todoItemElement = createTodoItem(todoItem, handlers);
      todoList.append(todoItemElement);
    });
  }



  // Блокируем кнопку отправки и разблокируем ее в случае ввода в поле input
  todoItemForm.form.addEventListener('input', function () {
      if (!todoItemForm.input.value) {
          todoItemForm.button.disabled = true;
      } else {
          todoItemForm.button.disabled = false;
      }
  })

  // Cоздаем событие по нажатию на ENTER или при клике на кнопку
  todoItemForm.form.addEventListener('submit', async function (e) {
      // отменяем перезагрузку страницы при добавлении item
      e.preventDefault();

      // если поле ввода пустое - не добавляем item
      if (!todoItemForm.input.value) {
          return
      };

      if (localStorage.getItem('storageStatus') === null) {
        let newItem  = {
          id: getNewId(listArray),
          name: todoItemForm.input.value,
          done: false,
        }

        listArray.push(newItem);

        // вызываем функцию создания элемента дела с объектом в качестве аргумента
        let todoItem = createTodoItem(newItem);

        // добавляем item  в список
        todoList.append(todoItem);

        saveList(listArray, listName);
      } else {
        let newItem  = await onCreateFormSubmit({
          owner,
          name: todoItemForm.input.value.trim()
        });

        // вызываем функцию создания элемента дела с объектом в качестве аргумента
        let todoItem = createTodoItem(newItem, handlers);

        // добавляем item  в список
        todoList.append(todoItem);
      }

      // очищаем поле ввода
      todoItemForm.input.value = '';

      // Блокируем кнопку отправки
      todoItemForm.button.disabled = true;
    })
  }

export { createTodoApp };
