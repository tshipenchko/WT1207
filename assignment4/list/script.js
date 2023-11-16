import {todoService, priority} from "../core/todoService.mjs";
import {success, error_sound, bong, task_created, showAlert} from "../core/root.js"

const getCurrentListId = () => {
    // http://localhost/list/index.html?listId=1
    const listId = Number.parseInt(
        new URLSearchParams(window.location.search).get("listId")
    );
    if (!listId) {
        window.location.href = "../lists/index.html";
    }
    return listId;
}

const eventTodosChanged = () => {
    document.dispatchEvent(new CustomEvent("custom:todosChanged"));
}


const listId = getCurrentListId();


$(() => {
    const list = getCurrentList();

    $("#list-name").text(list.title);
    $("#list-description").text(list.description);

    renderTodos();
    document.addEventListener('custom:todosChanged', renderTodos);
})

$(() => {
    const $modal = $("#addTodosModal");
    const $form = $modal.find("form");
    const $confirm = $modal.find(".btn-primary");
    const $close = $modal.find(".btn-secondary");

    const $title = $form.find("#title");
    const $description = $form.find("#description");
    const $deadline = $form.find("#deadline");
    const $priority = $form.find("#priority");

    const onConfirm = () => {
        const title = $title.val();
        const description = $description.val();
        const deadline = $deadline.val();
        const priority = $priority.val();

        let isValid = true;
        if (!title) {
            $title.addClass("is-invalid");
            isValid = false;
        }
        if (!description) {
            $description.addClass("is-invalid");
            isValid = false;
        }
        if (!deadline) {
            $deadline.addClass("is-invalid");
            isValid = false;
        }

        if (!isValid) {
            error_sound.play().then();
            showAlert("Please fill all fields", "danger");
            return;
        }

        todoService.addTodoToList(listId, title, description, deadline, priority);
        eventTodosChanged();

        // noinspection JSUnresolvedReference
        $modal.modal("toggle");
        task_created.play().then();
        showAlert("Todo added", "success");
    };


    // Listeners
    $confirm.click(onConfirm)
    $(document).keypress(function (event) {
        if (!$modal.hasClass("show")) {
          return;
        }
        let keycode = (event.keyCode || event.which);
        if (keycode === 13 && event.ctrlKey) {
            onConfirm();
        }
        event.stopPropagation();
    });
    $confirm.mouseover(() => {
        $confirm.attr("title", "Click to confirm");
    })
    $close.mouseover(() => {
        $close.attr("title", "Click to close");
    });
    $modal.on("hidden.bs.modal", () => {
        $form.trigger("reset");
        $title.removeClass("is-invalid");
        $description.removeClass("is-invalid");
        $deadline.removeClass("is-invalid");
        $priority.removeClass("is-invalid");
    });
    $title.on("input", () => $title.removeClass("is-invalid"));
    $description.on("input", () => $description.removeClass("is-invalid"));
    $deadline.on("input", () => $deadline.removeClass("is-invalid"));
})

const renderTodos = () => {
    const $todos = $("#todos");
    $todos.empty();

    const {todos} = todoService.getListById(listId);
    if (!todos.length) {
        $todos.append(`
             <div class="todo card bg-secondary p-3 rounded-3">
                <h4>No todos yet</h4>
            </div>
        `);
        return;
    }

    todoService.getListById(listId).todos.forEach(todo => {
        const doneOrUndo = todo.isDone ? "Undo" : "Done";
        const $todo = $(`
            <div class="todo card bg-secondary p-3 mb-3 rounded-3">
                <div class="_todo_body">
                    <h4>${todo.title}</h4>
                    <p>${todo.description}</p>
                    <p>Deadline: ${todo.deadline}</p>
                    <p class="priority-${priority[todo.priority]}">Priority: ${priority[todo.priority]}</p>
                </div>
                <div class="list-actions">
                    <button class="btn btn-primary btn-lg ms-1">${doneOrUndo}</button>
                    <button class="btn btn-danger btn-lg ms-1">Delete</button>
                </div>
            </div>
        `);

        if (todo.isDone) {
            $todo.find("._todo_body").addClass("text-decoration-line-through");
        }

        $todo.find(".btn-primary").click(() => {
            if (todo.isDone) {
                bong.play().then();
            } else {
                success.play().then();
            }

            todoService.toggleTodoDone(listId, todo.id);
            eventTodosChanged();
        })

        $todo.find(".btn-danger").click(() => {
            bong.play().then();
            todoService.deleteTodoFromList(listId, todo.id);
            eventTodosChanged();
        });

        $todos.append($todo);
    });
}

const getCurrentList = () => {
    const list = todoService.getListById(listId);
    if (!list) {
        window.location.href = "../lists/index.html";
    }
    return list;
}
