/*
  Some notes:
  - deadline should be in format `YYYY-MM-DDTHH:mm:ss.sssZ` (e.g. `2020-12-31T23:59:59.000Z`)
    It can be loaded using: `new Date(deadline)`
    And then displayed using: `deadline.toLocaleString()`
    To convert existing date object to string format: `date.toISOString()`
  - to get date from form input use: `new Date(deadline.value)`
    Considering that form is something like this:
    ```html
     <form>
        <input id="deadline" type="datetime-local" />
     </form>
    ```
  - priority is a number from 1 to infinity
    1 is the highest priority

  - Some type hints as JS don't have them:
    listObject = {
        id: number,
        title: string,
        description: string,
        todos: todoObject[]
    }
    todoObject = {
        id: number,
        title: string,
        description: string,
        deadline: string,
        priority: number,
        isDone: boolean
    }
 */


class TodoService {
    constructor() {
        this.lists = JSON.parse(localStorage.getItem('lists')) || [];

        // Internal properties
        this._todoIdCounter = JSON.parse(localStorage.getItem('_todoIdCounter')) || 1;
        this._listIdCounter = JSON.parse(localStorage.getItem('_listIdCounter')) || 1;
    }

    createList(title, description) {
        const id = this._generateListId();
        const newList = {
            id,
            title,
            description,
            todos: []
        };
        this.lists.push(newList);
        this._save();

        return id;
    }

    getListById(id) {
        return this.lists.find(list => list.id === id);
    }

    deleteList(id) {
        this.lists = this.lists.filter(list => list.id !== id);
        this._save();
    }

    addTodoToList(listId, title, description, deadline, priority) {
        const list = this.getListById(listId);
        const id = this._generateTodoId();
        if (!list) {
            return null;
        }

        deadline = (new Date(deadline)).toISOString();

        const newTodo = {
            id,
            title,
            description,
            deadline,
            priority,
            isDone: false,
        };
        list.todos.push(newTodo);
        this._save();

        return id;
    }

    deleteTodoFromList(listId, todoId) {
        const list = this.getListById(listId);
        if (!list) {
            return;
        }

        list.todos = list.todos.filter(todo => todo.id !== todoId);
        this._save();
    }

    toggleTodoDone(listId, todoId) {
        const list = this.getListById(listId);
        if (!list) {
            return;
        }

        const todo = list.todos.find(todo => todo.id === todoId);
        if (!todo) {
            return;
        }

        todo.isDone = !todo.isDone;
        this._save();
    }

    getTodosSortedByDeadlinePriority(listId) {
        const list = this.getListById(listId);
        if (list) {
            return list.todos.slice().sort((a, b) => {
                if (a.deadline !== b.deadline) {
                    return a.deadline.localeCompare(b.deadline);
                } else {
                    return b.priority - a.priority;
                }
            });
        }
        return [];
    }

    getTodosSortedByPriorityDeadline(listId) {
        const list = this.getListById(listId);
        if (list) {
            return list.todos.slice().sort((a, b) => {
                if (a.priority !== b.priority) {
                    return b.priority - a.priority;
                } else {
                    return a.deadline.localeCompare(b.deadline);
                }
            });
        }
        return [];
    }


    // Internal methods
    _save() {
        // You don't have to manually call this method, it's called automatically
        localStorage.setItem('lists', JSON.stringify(this.lists));
        localStorage.setItem('_todoIdCounter', this._todoIdCounter);
        localStorage.setItem('_listIdCounter', this._listIdCounter);
    }

    _generateTodoId() {
        return this._todoIdCounter++;
    }

    _generateListId() {
        return this._listIdCounter++;
    }
}

export const todoService = new TodoService();
export const priority = {
    1: "High",
    2: "Medium",
    3: "Low"
}
